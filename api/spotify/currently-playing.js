import {
  getCurrentlyPlaying,
  getRecentlyPlayed,
  getSpotifyAccessToken,
  hasSpotifyPlaybackCredentials,
} from '../../src/lib/spotify.server.js';

const json = (res, statusCode, payload, cacheControl = 'public, s-maxage=20, stale-while-revalidate=60') => {
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
        'public, s-maxage=120, stale-while-revalidate=300',
      );
    }

    return json(res, 200, {
      status: 'idle',
      isPlaying: false,
      recentTracks: [],
    });
  } catch (error) {
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
