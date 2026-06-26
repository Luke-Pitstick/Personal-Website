import {
  SPOTIFY_RECENT_TRACK_LIMIT,
  getCurrentlyPlaying,
  getRecentlyPlayed,
  getSpotifyAccessToken,
  hasSpotifyPlaybackCredentials,
} from '../../src/lib/spotify.server.js';

const LIVE_PLAYBACK_CACHE = 'private, no-store, max-age=0';

const json = (res, statusCode, payload, cacheControl = LIVE_PLAYBACK_CACHE) => {
  res.setHeader('Cache-Control', cacheControl);
  return res.status(statusCode).json(payload);
};

const hasExactRecentTrackCount = (recentTracks) => recentTracks.length === SPOTIFY_RECENT_TRACK_LIMIT;

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
      getRecentlyPlayed(accessToken, SPOTIFY_RECENT_TRACK_LIMIT),
    ]);

    if (!hasExactRecentTrackCount(recentTracks)) {
      throw new Error(`Spotify returned ${recentTracks.length} of ${SPOTIFY_RECENT_TRACK_LIMIT} recent tracks.`);
    }

    return json(
      res,
      200,
      {
        ...(currentTrack || {
          status: 'idle',
          isPlaying: false,
        }),
        recentTracks,
      },
      LIVE_PLAYBACK_CACHE,
    );
  } catch (error) {
    console.error('Spotify currently-playing request failed:', error.message || error);

    return json(
      res,
      503,
      {
        status: 'error',
        isPlaying: false,
        recentTracks: [],
      },
      'no-store',
    );
  }
}
