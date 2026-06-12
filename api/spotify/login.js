import { createSpotifyAuthorizeUrl, getSpotifyRedirectUri, hasSpotifyClientCredentials } from '../../src/lib/spotify.server.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!hasSpotifyClientCredentials()) {
    return res.status(500).json({
      error: 'Spotify client credentials are missing.',
      required: ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET'],
    });
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.redirect(302, createSpotifyAuthorizeUrl(getSpotifyRedirectUri(req)));
}
