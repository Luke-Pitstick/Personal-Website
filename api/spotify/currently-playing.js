import {
  getCurrentlyPlaying,
  getRecentlyPlayed,
  getSpotifyAccessToken,
  hasSpotifyPlaybackCredentials,
} from '../../src/lib/spotify.server.js';

const LIVE_PLAYBACK_CACHE = 'private, max-age=0, no-cache';
const RECENT_PLAYBACK_CACHE = 'public, max-age=30, s-maxage=60, stale-while-revalidate=120';

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
