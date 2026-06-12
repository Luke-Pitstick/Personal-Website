import {
  exchangeCodeForTokens,
  getSpotifyRedirectUri,
  hasSpotifyClientCredentials,
  spotifyScopes,
} from '../../src/lib/spotify.server.js';

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const renderSetupPage = ({ refresh_token: refreshToken, scope }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Spotify Refresh Token</title>
    <style>
      :root {
        color: #101617;
        background: #f8f7f1;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      body {
        display: grid;
        min-height: 100vh;
        margin: 0;
        place-items: center;
        padding: 2rem;
      }

      main {
        width: min(100%, 44rem);
        border: 2px solid #101617;
        border-radius: 8px;
        background: #faf9f4;
        box-shadow: 7px 7px 0 rgba(255, 58, 18, 0.88);
        padding: 1.5rem;
      }

      h1 {
        margin: 0 0 0.75rem;
        font-size: clamp(1.5rem, 4vw, 2.5rem);
      }

      p {
        color: #334044;
        font-weight: 700;
        line-height: 1.55;
      }

      code,
      textarea {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      }

      textarea {
        box-sizing: border-box;
        width: 100%;
        min-height: 8rem;
        border: 2px solid #101617;
        border-radius: 6px;
        background: #fff;
        padding: 0.875rem;
        color: #101617;
        font-size: 0.85rem;
        font-weight: 700;
      }

      .meta {
        margin-top: 1rem;
        font-size: 0.85rem;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Spotify is authorized</h1>
      <p>Add this value to Vercel as <code>SPOTIFY_REFRESH_TOKEN</code>, then redeploy. Treat it like a password.</p>
      <textarea readonly>${escapeHtml(refreshToken)}</textarea>
      <p class="meta">Authorized scopes: ${escapeHtml(scope || spotifyScopes.join(' '))}</p>
    </main>
  </body>
</html>`;

export default async function handler(req, res) {
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

  if (process.env.SPOTIFY_AUTH_STATE && req.query.state !== process.env.SPOTIFY_AUTH_STATE) {
    return res.status(400).json({ error: 'Spotify auth state did not match.' });
  }

  if (req.query.error) {
    return res.status(400).json({ error: req.query.error });
  }

  if (!req.query.code) {
    return res.status(400).json({ error: 'Spotify authorization code is missing.' });
  }

  try {
    const tokens = await exchangeCodeForTokens({
      code: req.query.code,
      redirectUri: getSpotifyRedirectUri(req),
    });

    if (!tokens.refresh_token) {
      return res.status(500).json({
        error: 'Spotify did not return a refresh token. Revoke this app in Spotify and authorize again.',
      });
    }

    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(renderSetupPage(tokens));
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Spotify callback failed.' });
  }
}
