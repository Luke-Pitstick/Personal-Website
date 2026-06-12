import {
  getCurrentlyPlaying,
  getRecentlyPlayed,
  getSpotifyAccessToken,
  hasSpotifyPlaybackCredentials,
} from '../../src/lib/spotify.server.js';

const LIVE_PLAYBACK_CACHE = 'public, max-age=15, s-maxage=30, stale-while-revalidate=120';
const RECENT_PLAYBACK_CACHE = 'public, max-age=60, s-maxage=180, stale-while-revalidate=600';

const json = (res, statusCode, payload, cacheControl = LIVE_PLAYBACK_CACHE) => {
  res.setHeader('Cache-Control', cacheControl);
  return res.status(statusCode).json(payload);
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { status: 'error', error: 'Method not allowed' }, 'no-store');
  }

  if (!hasSpotifyPlaybackCredentials()) {
    return json(
      res,
      200,
      {
        status: 'unconfigured',
        isPlaying: false,
        recentTracks: [],
      },
      'no-store',
    );
  }

  try {
    const accessToken = await getSpotifyAccessToken();
    const [currentTrack, recentTracks] = await Promise.all([
      getCurrentlyPlaying(accessToken),
      getRecentlyPlayed(accessToken, 3).catch(() => []),
    ]);

    if (currentTrack) {
      return json(res, 200, {
        ...currentTrack,
        recentTracks,
      });
    }

    const recentTrack = recentTracks[0];

    if (recentTrack) {
      return json(
        res,
        200,
        {
          ...recentTrack,
          recentTracks,
        },
        RECENT_PLAYBACK_CACHE,
      );
    }

    return json(
      res,
      200,
      {
        status: 'idle',
        isPlaying: false,
        recentTracks: [],
      },
      RECENT_PLAYBACK_CACHE,
    );
  } catch (error) {
    console.error('Spotify currently-playing request failed:', error.message || error);

    return json(
      res,
      200,
      {
        status: 'error',
        isPlaying: false,
        recentTracks: [],
      },
      'no-store',
    );
  }
}
