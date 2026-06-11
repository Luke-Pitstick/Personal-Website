# T5 Resource Scheduling Notes

## Before
- `Projects` is below the hero and hydrated with `client:visible`, but Astro still includes project image tags in the initial HTML.
- The flagship project image used `loading="eager"`, allowing a remote project image to compete with hero resources during the initial and idle window.
- Non-flagship project images used `loading="lazy"` and all project images already used `decoding="async"`.

## After
- All project images now use `loading="lazy"`.
- All project images now set `fetchPriority="low"` while preserving the same `src`, `alt`, dimensions, object positioning, overlays, text, links, and layout classes.
- Hero preload and hero source files were not changed.

## Validation
- `npm run astro -- build` passed on 2026-06-11.
- Full `npm run build` was not run because it regenerates hero portrait assets under `public/`, which is outside the T5 owned write scope.
