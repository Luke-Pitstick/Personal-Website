# Hero Performance T6 Validation Report

Task ID: T6 - Validate visual equivalence and performance gains
Status: complete with concerns
Collected: 2026-06-11 MDT / 2026-06-12 UTC

## Current Branch Note

This report is historical. It predates the current branch's precomputed hero asset integration, initial WebP preload hints, interactive data warmup, auto-reveal throttling refinements, coarse-pointer auto-only seeding, and production pruning of source-only hero JPEGs. In current HEAD, the interactive path no longer loads `background.jpg` or `chautauqua-flatirons_fg.jpg`; it uses `/background-dithered.webp` and `/hero-mountains.webp` instead.

## Scope

At collection time, this was a post-T4/T5/T2A validation pass, not the final all-optimizations pass. T2 was still reference-only and T3 had not consumed precomputed deterministic assets, so this report validated the then-current committed state through `dde76de`.

The worktree was cleaned of off-scope video-background artifacts before measurement so the run reflects the committed hero-performance changes only.

## Commands

```sh
npm run build
python3 -m http.server 4323 --bind 127.0.0.1 --directory dist
```

`npm run build` passed. Port `4321` was already occupied, so this run used `4323`.

## Browser Profiles

| Profile | Viewport | DPR | Notes |
| --- | ---: | ---: | --- |
| Desktop | 1200 x 952 | 2 | Matches baseline desktop viewport/DPR. |
| Narrow | 390 x 844 | 1 | Matches baseline narrow viewport/DPR. |
| Reduced motion | 1200 x 952 | 2 | `prefers-reduced-motion: reduce`. |
| No WebGL fallback | 1200 x 952 | 2 | Pre-navigation canvas `webgl/webgl2` contexts returned `null`. |

Cache was disabled through CDP where available. The run waited for `domcontentloaded`, best-effort `networkidle`, then 3800 ms, matching the baseline timing shape.

## Before And After Metrics

| Metric | Baseline Desktop | T6 Desktop | Result |
| --- | ---: | ---: | --- |
| First paint | 180.0 ms | 84.0 ms | improved |
| First contentful paint | 180.0 ms | 120.0 ms | improved |
| Navigation load end | 157.2 ms | 132.9 ms | improved |
| `DitheredHeroCanvas` chunk start / end | 1114.7 / 1117.6 ms | 1012.1 / 1014.0 ms | still delayed, earlier |
| `background.jpg` start / end | 1455.0 / 1457.1 ms | 1341.1 / 1344.2 ms | still delayed, earlier |
| `chautauqua-flatirons_fg.jpg` start / end | 1455.1 / 1457.9 ms | 1341.2 / 1345.2 ms | still delayed, earlier |
| Long tasks over 50 ms | 6 | 5 | improved |
| Long task total / largest | 1341 ms / 556 ms | 1254 ms / 562 ms | total slightly improved, largest slightly worse |
| JS heap used / total | 19.9 MB / 37.6 MB | 64.1 MB / 77.9 MB | worse in this browser context |
| Early project image resources | 2 | 2 | unresolved |
| Console errors / page errors | 0 / 0 | 0 / 0 | pass |

| Metric | Baseline Narrow | T6 Narrow | Result |
| --- | ---: | ---: | --- |
| First paint | 132.0 ms | 80.0 ms | improved |
| First contentful paint | 132.0 ms | 140.0 ms | +8 ms, within budget |
| Navigation load end | 131.9 ms | 144.6 ms | +12.7 ms, acceptable |
| `DitheredHeroCanvas` chunk start / end | 1012.3 / 1014.0 ms | 1039.6 / 1041.8 ms | still delayed, +27.3 ms |
| `background.jpg` start / end | 1339.6 / 1341.6 ms | 1367.0 / 1370.0 ms | +27.4 ms |
| `chautauqua-flatirons_fg.jpg` start / end | 1339.6 / 1342.7 ms | 1367.0 / 1371.1 ms | +27.4 ms |
| Long tasks over 50 ms | 5 | 5 | same |
| Long task total / largest | 489 ms / 161 ms | 514 ms / 160 ms | slight total regression, largest flat |
| JS heap used / total | 20.4 MB / 37.1 MB | 28.3 MB / 45.5 MB | worse in this browser context |
| Early project image resources | 0 | 0 | pass |
| Console errors / page errors | 0 / 0 | 0 / 0 | pass |

## Build Output

| Output | Baseline | T6 | Result |
| --- | ---: | ---: | --- |
| `Hero` chunk raw / gzip | 6.03 kB / 2.67 kB | 6.03 kB / 2.67 kB | unchanged |
| `DitheredHeroCanvas` chunk raw / gzip | 62.15 kB / 20.06 kB | 63.64 kB / 20.58 kB | +1.49 kB / +0.52 kB |
| `Projects` chunk raw / gzip | 6.10 kB / 2.47 kB | 6.10 kB / 2.47 kB | unchanged |

## Resource Timing

Desktop T6 key resources:

| Resource | Start | Response End | Transfer |
| --- | ---: | ---: | ---: |
| `pictureofme-768.avif` | 52.5 ms | 56.6 ms | 22,852 B |
| `background-dithered.webp` | 70.1 ms | 74.1 ms | 368,560 B |
| `Hero.CCHgcQts.js` | 87.4 ms | 91.2 ms | 6,333 B |
| `DitheredHeroCanvas.CyiLsoRc.js` | 1012.1 ms | 1014.0 ms | 63,937 B |
| `background.jpg` | 1341.1 ms | 1344.2 ms | 88,283 B |
| `chautauqua-flatirons_fg.jpg` | 1341.2 ms | 1345.2 ms | 675,886 B |

Narrow T6 key resources:

| Resource | Start | Response End | Transfer |
| --- | ---: | ---: | ---: |
| `pictureofme-512.avif` | 52.5 ms | 54.5 ms | 14,022 B |
| `background-dithered.webp` | 66.7 ms | 70.4 ms | 368,560 B |
| `Hero.CCHgcQts.js` | 115.6 ms | 120.7 ms | 6,333 B |
| `DitheredHeroCanvas.CyiLsoRc.js` | 1039.6 ms | 1041.8 ms | 63,937 B |
| `background.jpg` | 1367.0 ms | 1370.0 ms | 88,283 B |
| `chautauqua-flatirons_fg.jpg` | 1367.0 ms | 1371.1 ms | 675,886 B |

Desktop still fetched two project images before 2500 ms:

| Resource | Start | Response End |
| --- | ---: | ---: |
| `nycrentpriceforecaster.png` | 85.6 ms | 746.0 ms |
| `renewably.png` | 85.6 ms | 829.3 ms |

This misses the T6 target of zero early project image resources on desktop.

## Canvas State

| Canvas | Baseline Desktop | T6 Desktop | Baseline Narrow | T6 Narrow |
| --- | ---: | ---: | ---: | ---: |
| WebGL shader backing | 2166 x 1219 | 2166 x 1219 | 960 x 540 | 960 x 540 |
| WebGL shader CSS rect | 1692 x 952 | 1692 x 952 | 1500 x 844 | 1500 x 844 |
| Mountain backing | 1280 x 720 | 1280 x 720 | 1280 x 720 | 1280 x 720 |
| Mountain CSS rect | 1692 x 952 | 1692 x 952 | 1500 x 844 | 1500 x 844 |

Canvas dimensions match the baseline.

## Reduced Motion And Fallback

Reduced motion:

- No `DitheredHeroCanvas` chunk loaded.
- No `background.jpg` or `chautauqua-flatirons_fg.jpg` loaded.
- Static dithered sky screenshot rendered correctly.
- Long tasks: 0.
- Console/page errors: 0 / 0.
- Desktop project images still loaded early.

No-WebGL fallback in the measured historical state:

- `DitheredHeroCanvas` chunk loaded to run the fallback component path.
- WebGL shader canvas was absent.
- Static fallback canvas and mountain canvas rendered at the expected dimensions.
- `background.jpg` was not loaded; `chautauqua-flatirons_fg.jpg` still loaded for the mountain layer.
- Long tasks: 2, total 226 ms, largest 171 ms.
- Console/page errors: 0 / 0.

## Functional Checks

| Check | Result |
| --- | --- |
| Desktop visual output | Pass, manually checked against baseline shape. |
| Narrow visual output | Pass, manually checked against same-size baseline screenshot. |
| Reduced-motion visual output | Pass, static dithered sky with no shader/mountain dynamic layer. |
| No-WebGL fallback visual output | Pass, static fallback canvas plus mountain layer. |
| Shader hint appears | Pass, verified by `Live shaders` and dismiss button text check. |
| Shader hint dismisses | Pass, text and dismiss button removed after click. |
| Cursor/pointer path | Pass, synthetic pointer dispatch completed without errors. |
| Scroll button | Pass, moved from `scrollY=0` to about `scrollY=951`. |
| Social links visible | Pass in desktop and narrow hero states. |
| Console/page errors | Pass, none observed. |

## Screenshots

Saved under `agents/hero-performance-t6-assets/`:

- `desktop-hero-viewport-after-shader.png`
- `narrow-hero-viewport-after-shader.png`
- `reduced-motion-hero-viewport-after-shader.png`
- `no-webgl-fallback-hero-viewport-after-shader.png`

## Verdict

T6 passes visual and core functionality checks for the current post-T4/T5 state, but it does not fully pass the performance acceptance bar.

What improved:

- Desktop FCP improved from 180 ms to 120 ms.
- Desktop navigation load end improved from 157.2 ms to 132.9 ms.
- Desktop long-task count improved from 6 to 5.
- Desktop long-task total improved from 1341 ms to 1254 ms.
- Reduced-motion path is clean: no shader chunk, no delayed hero source images, no long tasks.

What did not improve enough:

- Desktop largest long task was effectively flat/slightly worse: 556 ms to 562 ms.
- Narrow long-task total regressed slightly: 489 ms to 514 ms.
- JS heap readings were higher in this run.
- Desktop still fetches two project images early.
- `DitheredHeroCanvas` bundle size increased slightly.

Conclusion: the lifecycle/cache work is behavior-preserving and likely helps some steady-state wrapper overhead, but the dominant bottleneck is still deterministic hero image preparation and source image loading. T2/T3 remain the real path to the large performance win.

## Historical Recommended Next Steps

1. Finish T2 raw helper `ImageData` capture and generated candidate assets.
2. Run T3 to consume validated precomputed assets and remove runtime image transforms.
3. Add stronger desktop project-image intersection deferral if the early native-lazy image fetches matter.
4. Re-run T6 after T2/T3 with the same desktop/narrow/reduced-motion/no-WebGL profiles.
