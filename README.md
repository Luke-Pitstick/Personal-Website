# Luke Pitstick's Personal Website

This is the source code for my personal website. It is built using Astro and deployed using Vercel.

The live website can be found at https://lukepitstick.com

## Spotify listening card

The About page includes a live Spotify listening card. `/api/spotify/currently-playing` returns the current track when Spotify has an active or paused playback item, plus `recentTracks` with the exact last four completed plays from Spotify history. The card refreshes every 10 seconds, retries around expected track changes, and keeps cached recent tracks visible while a refresh is incomplete.

Required Vercel environment variables:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`

Optional Spotify setup variables:

- `SPOTIFY_REDIRECT_URI` overrides the inferred `/api/spotify/callback` URL.
- `SPOTIFY_AUTH_STATE` enables state validation during the authorization callback.

To generate a refresh token, set the client credentials, visit `/api/spotify/login`, authorize the app with the displayed scopes, then add the returned `SPOTIFY_REFRESH_TOKEN` to Vercel and redeploy.

Run the focused Spotify regression tests with:

```sh
npm run test:spotify
```

## Deployment

Vercel should use `npm run build` as the build command and `dist` as the output directory. Redirects are managed in `vercel.json`.

The production build regenerates the paper hero surface and responsive portrait assets, builds Astro, then prunes source-only images from `dist/`. The interactive home hero uses committed, precomputed WebP assets (`public/background-dithered.webp`, `public/hero-paper.webp`, and `public/hero-mountains.webp`) and center-crops them into the 1280 x 720 hero contract; the original hero JPEG sources stay in `public/` for local asset regeneration but are not shipped in the deployed output.

Hero asset scripts:

```sh
npm run generate:hero-fallback
npm run generate:hero-paper
npm run generate:hero-portrait
npm run verify:hero-crop
```

To deploy from the CLI:

```sh
npm run deploy
```
