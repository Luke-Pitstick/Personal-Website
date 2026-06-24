# Luke Pitstick's Personal Website

This is the source code for my personal website. It is built using Astro and deployed using Vercel.

The live website can be found at https://lukepitstick.com

## Deployment

Vercel should use `npm run build` as the build command and `dist` as the output directory. Redirects are managed in `vercel.json`.

The production build regenerates responsive portrait assets, builds Astro, then prunes source-only images from `dist/`. The interactive home hero uses committed, precomputed WebP assets (`public/background-dithered.webp` and `public/hero-mountains.webp`); the original hero JPEG sources stay in `public/` for local asset regeneration but are not shipped in the deployed output.

Hero asset scripts:

```sh
npm run generate:hero-fallback
npm run generate:hero-portrait
```

To deploy from the CLI:

```sh
npm run deploy
```
