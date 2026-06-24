# Hero Performance Baseline

Task: T1R - Replacement Hero Performance Baseline  
Collected: 2026-06-11 20:25 MDT / 2026-06-12T02:25Z  
Baseline state at collection: then-current worktree after parent-integrated T5 resource scheduling in `src/components/Projects.jsx`.

## Current Branch Note

This baseline is historical and predates the current branch's precomputed hero asset integration. Current HEAD no longer loads `background.jpg` or `chautauqua-flatirons_fg.jpg` from the interactive hero runtime path; it uses committed WebPs including `/hero-paper.webp`.

## Commands

Build:

```sh
npm run astro -- build
```

Served built output:

```sh
python3 -m http.server 4321 --bind 127.0.0.1 --directory dist
```

Browser collection:
- Playwright Chromium fresh browser contexts for desktop and narrow profiles.
- `PerformanceObserver` installed before navigation for `longtask` and `largest-contentful-paint`.
- After `domcontentloaded` and best-effort `networkidle`, waited 3800 ms so `Hero client:idle`, the 900 ms shader delay, lazy `DitheredHeroCanvas`, and source image preprocessing could complete.
- Captured Performance API navigation, paint, resource, long task, heap, canvas dimensions, console/page errors, and screenshots.

I used `npm run astro -- build` instead of `npm run build` to avoid the portrait generation and source-pruning side effects in the package `build` script.

## Environment

| Item | Value |
| --- | --- |
| OS | macOS 26.1, build 25B78, arm64 |
| Repo | `/Users/lukepitstick/Projects/Websites/website` |
| Branch / HEAD | `main` / `0e5a08b` |
| Node / npm | Node v25.8.1 / npm 11.11.0 |
| Astro / React / Motion | Astro 5.15.9 / React 19.2.0 / Motion 12.40.0 |
| Dither package | `@dithered-particle-canvas/react@0.0.0` from local vendor package |
| Browser | Playwright Chromium 149.0.7827.103 |

Pre-existing dirty files before T1R measurement: `agents/hero-performance-dispatch-board.md`, `agents/hero-performance-t5-resource-notes.md`, and `src/components/Projects.jsx`.

## Build Output

`npm run astro -- build` completed successfully.

| Output | Raw | Gzip |
| --- | ---: | ---: |
| `Hero.g0B6Y2yG.js` | 6.03 kB | 2.67 kB |
| `DitheredHeroCanvas.DNYtEjnG.js` | 62.15 kB | 20.06 kB |
| `Projects.Dr5ABvXh.js` | 6.10 kB | 2.47 kB |
| `SectionChrome.x0OshY84.js` | 124.45 kB | 40.91 kB |
| `client.BLUn-lwI.js` | 186.62 kB | 58.46 kB |

Key hero asset sizes from `dist/`:

| Asset | Size |
| --- | ---: |
| `background-dithered.webp` | 360 KB |
| `background.jpg` | 88 KB |
| `chautauqua-flatirons_fg.jpg` | 660 KB |

## Runtime Metrics

| Metric | Desktop | Narrow |
| --- | ---: | ---: |
| Viewport | 1200 x 952, DPR 2 | 390 x 844, DPR 1 |
| First paint | 180.0 ms | 132.0 ms |
| First contentful paint | 180.0 ms | 132.0 ms |
| Navigation load end | 157.2 ms | 131.9 ms |
| `Hero` chunk response end | 162.8 ms | 93.6 ms |
| `DitheredHeroCanvas` chunk start / response end | 1114.7 / 1117.6 ms | 1012.3 / 1014.0 ms |
| `background.jpg` start / response end | 1455.0 / 1457.1 ms | 1339.6 / 1341.6 ms |
| `chautauqua-flatirons_fg.jpg` start / response end | 1455.1 / 1457.9 ms | 1339.6 / 1342.7 ms |
| Long tasks over 50 ms | 6 | 5 |
| Long task total / largest | 1341 ms / 556 ms | 489 ms / 161 ms |
| JS heap used / total | 19.9 MB / 37.6 MB | 20.4 MB / 37.1 MB |
| Console errors / page errors | 0 / 0 | 0 / 0 |
| Shader active | yes | yes |
| Shader hint | full cursor hint | auto-only/coarse pointer hint |
| Early project image resources | 2 | 0 |

Long tasks clustered after the shader chunk loaded and around the source image preprocessing window. The desktop run recorded long tasks at approximately 1459.9, 1512.5, 1583.1, 2139.6, 2310.5, and 2369.9 ms. The narrow run recorded long tasks at approximately 1353.0, 1474.6, 1545.4, 1708.1, and 1762.4 ms.

The LCP observer was noisy for this pass because the run waited for shader activation and desktop native lazy loading still pulled project images into the resource timeline. I would not budget against the recorded late project-image LCP entries; use the screenshot and paint/resource timings above for T2/T3 and rerun a focused LCP profile in T6 if needed.

## Hero Resource Timing

Desktop key resource entries:

| Resource | Start | Response End | Transfer |
| --- | ---: | ---: | ---: |
| `/pictureofme-768.avif` | 71.3 ms | 73.7 ms | 22,852 B |
| Google Fonts CSS | 78.8 ms | 154.8 ms | 2,295 B |
| `/_astro/Navbar.BmDTQH9v.js` | 90.3 ms | 92.3 ms | 8,162 B |
| `/_astro/client.BLUn-lwI.js` | 90.5 ms | 92.5 ms | 186,919 B |
| `/background-dithered.webp` | 99.0 ms | 101.0 ms | 368,560 B |
| `/_astro/SectionChrome.x0OshY84.js` | 152.6 ms | 162.2 ms | 124,753 B |
| `/_astro/Hero.g0B6Y2yG.js` | 153.6 ms | 162.8 ms | 6,333 B |
| `/_astro/DitheredHeroCanvas.DNYtEjnG.js` | 1114.7 ms | 1117.6 ms | 62,449 B |
| `/background.jpg` | 1455.0 ms | 1457.1 ms | 88,283 B |
| `/chautauqua-flatirons_fg.jpg` | 1455.1 ms | 1457.9 ms | 675,886 B |

Narrow key resource entries:

| Resource | Start | Response End | Transfer |
| --- | ---: | ---: | ---: |
| `/pictureofme-512.avif` | 57.7 ms | 59.6 ms | 14,022 B |
| Google Fonts CSS | 58.3 ms | 131.2 ms | 2,295 B |
| `/_astro/Navbar.BmDTQH9v.js` | 61.5 ms | 63.4 ms | 8,162 B |
| `/_astro/client.BLUn-lwI.js` | 61.6 ms | 64.3 ms | 186,919 B |
| `/background-dithered.webp` | 63.5 ms | 66.8 ms | 368,560 B |
| `/_astro/SectionChrome.x0OshY84.js` | 87.7 ms | 92.3 ms | 124,753 B |
| `/_astro/Hero.g0B6Y2yG.js` | 90.8 ms | 93.6 ms | 6,333 B |
| `/_astro/DitheredHeroCanvas.DNYtEjnG.js` | 1012.3 ms | 1014.0 ms | 62,449 B |
| `/background.jpg` | 1339.6 ms | 1341.6 ms | 88,283 B |
| `/chautauqua-flatirons_fg.jpg` | 1339.6 ms | 1342.7 ms | 675,886 B |

Despite T5 changing all project images to `loading="lazy"` and `fetchPriority="low"`, desktop still fetched two native-lazy project images during the early window:

| Resource | Start | Response End |
| --- | ---: | ---: |
| `renewably.png` | 152.1 ms | 1294.8 ms |
| `nycrentpriceforecaster.png` | 152.3 ms | 1339.4 ms |

The narrow viewport did not fetch project images during the early window.

## Canvas State

| Canvas | Desktop Backing | Desktop CSS Rect | Narrow Backing | Narrow CSS Rect |
| --- | ---: | --- | ---: | --- |
| WebGL shader canvas | 2166 x 1219 | x -246.2, y 0, 1692.4 x 952 | 960 x 540 | x -555.2, y 0, 1500.4 x 844 |
| Mountain foreground canvas | 1280 x 720 | x -246.2, y 0, 1692.4 x 952 | 1280 x 720 | x -555.2, y 0, 1500.4 x 844 |

The WebGL canvas and mountain canvas both existed in both profiles, and the shader hint appeared. On narrow, the hint omitted the cursor instruction because the context was coarse pointer / touch.

One 1280 x 720 RGBA `ImageData` buffer is about 3.52 MB. The current runtime creates or retains several buffers around idle surface, reveal background, matted mountain base, filtered mountain output, and WebGL texture upload, before accounting for decoded source images and renderer internals.

## Screenshots And Assets

Screenshots saved under `agents/hero-performance-baseline-assets/`:

| File | Notes |
| --- | --- |
| `desktop-hero-viewport-after-shader.png` | Desktop viewport screenshot after shader activation |
| `desktop-home-section.png` | Desktop `#home` section screenshot |
| `desktop-mountain-canvas-screenshot.png` | Browser screenshot of mountain canvas element |
| `desktop-webgl-canvas-current-screenshot.png` | Browser screenshot of current WebGL canvas element |
| `narrow-hero-viewport-after-shader.png` | Narrow viewport screenshot after shader activation |
| `narrow-home-section.png` | Narrow `#home` section screenshot |
| `narrow-mountain-canvas-screenshot.png` | Browser screenshot of mountain canvas element |
| `narrow-webgl-canvas-current-screenshot.png` | Browser screenshot of current WebGL canvas element |

The desktop viewport screenshots are 2400 x 1904 because the profile used DPR 2. The narrow viewport screenshot is 390 x 844 at DPR 1. I visually checked the desktop and narrow viewport screenshots; both show the current layered hero output with title, copy, socials, mountains, shader cloud reveal, hint, and scroll control.

## T2/T3 Reference Notes

The saved mountain and WebGL canvas files are screenshots of browser-rendered canvas elements, not raw backing-store exports. They are still useful as visual references, but T2 should create raw browser-produced reference artifacts before changing runtime code.

Recommended raw mountain canvas capture:

```js
const canvas = document.querySelector('.dithered-hero-mountains');
const link = document.createElement('a');
link.href = canvas.toDataURL('image/png');
link.download = 'hero-mountain-canvas-reference.png';
link.click();
```

Direct reveal-background `ImageData` is not exposed by the current component. To capture it for T2/T3, use temporary debug-only instrumentation after `loadSkyRevealBackground()` resolves: draw the returned `ImageData` to a scratch canvas, export `toDataURL('image/png')`, then remove the instrumentation before collecting performance metrics. Do the same after `loadMattedMountainForeground()` and after `applyMountainColorFilters()` if T2 needs separate before/after references for matte, pixelation, and palette filtering.

Do not compare T2 generated assets only against the static `background-dithered.webp`; the live reveal path uses `background.jpg` plus `enhanceSkyBackground()`, and the foreground path uses `chautauqua-flatirons_fg.jpg` plus matte, pixelation, palette, and alpha changes.

## Observations

- Static first paint is fast: FCP was 180 ms desktop and 132 ms narrow.
- The delayed shader chunk behavior is working: `DitheredHeroCanvas` starts around 1.0-1.1 s, after the parent idle/min-delay gate.
- The heavy hero source images start around 1.34-1.46 s, after the shader chunk arrives.
- Long tasks appear during and after deterministic image work. Desktop is especially expensive, with two very large long tasks at 556 ms and 442 ms.
- No console errors or page errors were observed.
- Desktop still has early native-lazy project image downloads despite T5. T6 should verify whether that is acceptable, whether it is browser lazy-load distance behavior, or whether project image `src` needs stronger intersection deferral.

## Proposed Budgets

### T2: Precompute Deterministic Hero Image Work

- Generate browser reference artifacts before implementation: raw reveal background, raw matted/pixelated mountain, and final palette-filtered mountain.
- Preserve output dimensions at 1280 x 720 unless visual comparison proves a smaller asset is equivalent.
- Generated reveal and foreground assets should not exceed the current combined delayed source transfer of about 764 KB; target <= 450 KB combined if using compressed browser-deliverable assets.
- Eliminate runtime execution of `enhanceSkyBackground`, `applyConnectedSkyMatte`, `pixelateOpaqueForeground`, and `applyMountainColorFilters` from the client path if visual equivalence passes.
- Pixel diff budget should be near-zero for raw generated references; if browser color management prevents exactness, use a small threshold plus manual screenshot review at desktop and narrow viewports.

### T3: Simplify `DitheredHeroCanvas` Runtime

- Reduce `DitheredHeroCanvas` chunk from 62.15 kB raw / 20.06 kB gzip to <= 47 kB raw / <= 15 kB gzip, or document why runtime savings are the main win instead.
- Reduce post-shader long task total by at least 50%: desktop <= 670 ms and narrow <= 245 ms, with no single hero long task over 150 ms.
- Reduce post-shader JS heap used by at least 20% where `performance.memory` is available: target <= 16 MB used in the same Playwright profiles.
- Keep shader activation timing delayed: no eager `DitheredHeroCanvas` load before the existing idle/min-delay gate.
- Preserve current DOM layering, shader hint behavior, static fallback, reduced-motion behavior, auto reveal, cursor reveal, and scroll control.

### T4: Reduce Animation Loop And Resize Overhead

- Remove per-frame `querySelector` from the wrapper animation loop.
- Remove per-frame `getBoundingClientRect()` from the steady-state loop; refresh rect on resize, scroll, observer, and visibility/intersection changes.
- Pause wrapper RAF when `document.visibilityState === 'hidden'` and when the hero is offscreen; resume without catch-up bursts.
- Keep synthetic pointer events unless the vendor API exposes an equivalent public pointer/trail setter.
- Add no new long tasks over 50 ms and do not increase current shader chunk size materially.

### T6: Final Validation

- Re-run this baseline profile after T2/T3/T4/T5 integration at the same viewport sizes.
- Visual screenshots must match the baseline desktop and narrow screenshots, with manual review taking priority over raw metric gains.
- No console errors or page errors.
- FCP should not regress by more than 50 ms or 10%, whichever is larger.
- `DitheredHeroCanvas` should still start after the 900 ms minimum delay and should not start later than 1500 ms on the same local static server unless intentional.
- Early desktop project image downloads should be eliminated or explicitly accepted with evidence. Target 0 project image resources before 2500 ms in both desktop and narrow profiles.
- Reduced-motion and no-WebGL/static fallback checks should be captured in T6 even though they were not part of this T1R measurement pass.
