# Hero Performance T2A Precompute Notes

Task ID: T2A - Reference Assets and Build-Path Spike for Deterministic Hero Work  
Status: partial, reference-only handoff  
Collected: 2026-06-11 MDT / 2026-06-12 UTC

## Scope Guard

- No runtime hero source files were edited.
- No video-background specs or video work were created by this task.
- Writes were limited to `agents/hero-performance-t2-precompute-notes.md` and `agents/hero-performance-t2-reference-assets/`.
- Temporary static server was stopped.

## Commands Run

```sh
npm run astro -- build
python3 -m http.server 4321 --bind 127.0.0.1 --directory dist
```

The Astro build passed. The static server was used only for browser capture and was stopped with `Ctrl-C`.

## Reference Artifacts

Artifacts are under `agents/hero-performance-t2-reference-assets/`.

| Artifact | Bytes | Notes |
| --- | ---: | --- |
| `browser-runtime-canvas-manifest.json` | 2,113 | Capture metadata, canvas dimensions, CSS rects, and hero resource timing. |
| `desktop-mountain-canvas-raw.png` | 174,292 | Browser-exported `.dithered-hero-mountains` backing canvas, 1280 x 720. This is the best available final mountain oracle from this partial pass. |
| `desktop-webgl-canvas-raw-toDataURL.png` | 15,365 | Browser-exported current WebGL canvas frame, 1083 x 609 in the in-app browser capture. Use as a current-frame reference, not a deterministic source asset oracle. |

Captured source transfer sizes from the runtime page:

| Runtime source | Transfer size |
| --- | ---: |
| `/background.jpg` | 88,283 B |
| `/chautauqua-flatirons_fg.jpg` | 675,886 B |
| Combined delayed source transfer | 764,169 B |

File-system byte sizes for source files:

| Source file | Bytes |
| --- | ---: |
| `public/background.jpg` | 87,983 B |
| `public/chautauqua-flatirons_fg.jpg` | 675,586 B |
| Combined file bytes | 763,569 B |

## What Was Feasible

Browser DOM capture was feasible without source edits:

- Final mountain canvas PNG was exported from `.dithered-hero-mountains`.
- Current WebGL canvas frame was exported from `.dithered-hero-canvas canvas`.
- Runtime resource timings were captured in `browser-runtime-canvas-manifest.json`.

Direct capture of the hidden reveal-background `ImageData` was not completed. I attempted a Playwright pre-navigation instrumentation route through the Node REPL so the current runtime helper outputs could be captured without editing production files, but the bundled Playwright Chromium was missing and the local Chrome channel could not launch from this sandbox. The in-app browser evaluate path works after navigation, but does not give the same clean pre-bundle hook.

Exact follow-up for raw helper references:

1. Use a Playwright environment with an installed Chromium binary.
2. Add an init script before navigation that wraps `CanvasRenderingContext2D.prototype.getImageData` and `window.ImageData`.
3. Capture 1280 x 720 `ImageData` objects whose stacks include `loadSkyRevealBackground`, `loadMattedMountainForeground`, and `applyMountainColorFilters`.
4. Draw each captured `ImageData` to a scratch canvas and write PNGs named:
   - `desktop-raw-sky-reveal-background-enhanced.png`
   - `desktop-raw-mountain-base-matted-pixelated.png`
   - `desktop-raw-mountain-final-filtered.png`
5. Remove the hook from the measurement path and rerun the normal baseline checks.

If pre-navigation instrumentation remains unavailable, use temporary dev-only instrumentation in `DitheredHeroCanvas.jsx` after each helper resolves, export the same scratch-canvas PNGs, then revert the source before any integration or metric collection.

## Build-Time Path Spike

The full sharp generator spike was not completed in this pass. The source review did identify one important gate:

- `scripts/generate-dithered-background.mjs` is not a safe drop-in source of truth for the interactive reveal path.
- The runtime reveal path uses `BACKGROUND_PIXEL_SIZE = 2`; the existing static fallback generator uses `BACKGROUND_PIXEL_SIZE = 3`.
- The runtime foreground path also includes center-cover drawing, `height * 0.12` vertical offset, connected-sky alpha matte, 6px opaque foreground pixelation, and mountain palette filtering.

Recommended build/deploy path:

- Commit validated generated hero assets under `public/` with names beginning `hero-`.
- Keep a generator script under `scripts/` with a name beginning `generate-hero-...` for reproducibility.
- Do not wire the generator into `npm run build` until T3 has validated exact visual parity. Prefer a manual/update script first, because the current `build` already has portrait generation and source-pruning side effects.

Package-script implication if adopted later:

```json
"generate:hero-precomputed": "node scripts/generate-hero-precomputed-assets.mjs"
```

T3 can consume committed assets only after the raw helper references and generated candidates pass pixel/manual comparison. If the team later wants generation on every build, put `npm run generate:hero-precomputed` before `astro build`, but treat that as a separate reviewable change.

## Recommendation

Status recommendation: partial, not ready for integration.

Next implementation steps:

1. Finish raw `ImageData` reference capture for reveal background and intermediate/final mountain helper outputs.
2. Write a sharp-based spike script that decodes/resizes with `sharp`, then ports only the runtime-specific loops needed for exact parity.
3. Generate candidate assets under `public/hero-*` for byte-size comparison only.
4. Compare generated final mountain PNG against `desktop-mountain-canvas-raw.png`; compare reveal background against the raw helper export once captured.
5. Record candidate PNG/WebP/AVIF byte sizes against the current 763,569 B source-file baseline and 764,169 B runtime transfer baseline.
6. Only then allow T3 to consume precomputed assets.

## Validation Criteria For T3

- No visual drift against baseline desktop and narrow screenshots.
- Final mountain candidate should be pixel-identical or have a documented near-zero diff against browser-produced final mountain output.
- Reveal background candidate should match browser-produced `loadSkyRevealBackground` output before vendor dither/filter processing.
- Combined generated deliverables should stay below the current delayed source-file baseline of 763,569 B, with a target under 450 KB if practical.
- `npm run astro -- build` must pass after any generator or asset changes.
- The runtime source files must remain untouched until the T3 integration step.
