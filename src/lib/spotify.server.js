const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const CURRENTLY_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played';
export const SPOTIFY_RECENT_TRACK_LIMIT = 4;

export const spotifyScopes = ['user-read-currently-playing', 'user-read-recently-played'];

export const getSpotifyRedirectUri = (req) => {
  if (process.env.SPOTIFY_REDIRECT_URI) {
    return process.env.SPOTIFY_REDIRECT_URI;
  }

  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || (host?.includes('localhost') ? 'http' : 'https');

  return `${protocol}://${host}/api/spotify/callback`;
};

export const hasSpotifyClientCredentials = () => Boolean(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET);

export const hasSpotifyPlaybackCredentials = () => hasSpotifyClientCredentials() && Boolean(process.env.SPOTIFY_REFRESH_TOKEN);

export const createSpotifyAuthorizeUrl = (redirectUri) => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: spotifyScopes.join(' '),
    redirect_uri: redirectUri,
  });

  if (process.env.SPOTIFY_AUTH_STATE) {
    params.set('state', process.env.SPOTIFY_AUTH_STATE);
  }

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

const getBasicAuthorization = () => {
  const credentials = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
  return Buffer.from(credentials).toString('base64');
};

export const exchangeCodeForTokens = async ({ code, redirectUri }) => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${getBasicAuthorization()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error_description || body.error || 'Unable to exchange Spotify authorization code.');
  }

  return body;
};

export const getSpotifyAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${getBasicAuthorization()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok || !body.access_token) {
    throw new Error(body.error_description || body.error || 'Unable to refresh Spotify access token.');
  }

  return body.access_token;
};

const getBestAlbumImage = (images = []) => {
  if (!images.length) return null;

  return images.find((image) => image.width >= 300) || images[0];
};

const normalizeTrack = (track) => {
  if (!track) return null;

  const image = getBestAlbumImage(track.album?.images);

  return {
    title: track.name,
    artist: track.artists?.map((artist) => artist.name).join(', ') || '',
    album: track.album?.name || '',
    image: image?.url || null,
    url: track.external_urls?.spotify || null,
    durationMs: track.duration_ms || null,
  };
};

const clampRecentlyPlayedLimit = (limit) => {
  const numericLimit = Number(limit);

  if (!Number.isFinite(numericLimit)) {
    return SPOTIFY_RECENT_TRACK_LIMIT;
  }

  return Math.min(50, Math.max(1, Math.trunc(numericLimit)));
};

const getRecentlyPlayedFetchLimit = () => 50;

const getPlayedAtTime = (track) => {
  const playedAtTime = Date.parse(track.playedAt || '');

  return Number.isNaN(playedAtTime) ? 0 : playedAtTime;
};

const hasValidPlayedAt = (track) => getPlayedAtTime(track) > 0;

export const getCurrentlyPlaying = async (accessToken) => {
  const response = await fetch(CURRENTLY_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 204) return null;

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error?.message || 'Unable to read current Spotify playback.');
  }

  const track = normalizeTrack(body.item);

  if (!track) return null;

  return {
    status: body.is_playing ? 'playing' : 'paused',
    isPlaying: Boolean(body.is_playing),
    progressMs: body.progress_ms ?? null,
    ...track,
  };
};

export const getRecentlyPlayed = async (accessToken, limit = SPOTIFY_RECENT_TRACK_LIMIT) => {
  const normalizedLimit = clampRecentlyPlayedLimit(limit);
  const params = new URLSearchParams({
    limit: String(getRecentlyPlayedFetchLimit(normalizedLimit)),
  });

  const response = await fetch(`${RECENTLY_PLAYED_ENDPOINT}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.error?.message || 'Unable to read recent Spotify playback.');
  }

  return (body.items || [])
    .map((recentTrack) => {
      const track = normalizeTrack(recentTrack?.track);

      if (!track) return null;

      return {
        status: 'recent',
        isPlaying: false,
        playedAt: recentTrack.played_at || null,
        ...track,
      };
    })
    .filter(Boolean)
    .filter(hasValidPlayedAt)
    .sort((firstTrack, secondTrack) => getPlayedAtTime(secondTrack) - getPlayedAtTime(firstTrack))
    .slice(0, normalizedLimit);
};
