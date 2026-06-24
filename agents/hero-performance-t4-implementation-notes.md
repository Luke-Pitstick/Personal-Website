# Hero Performance T4 Implementation Notes

Task ID: T4 - Reduce hero wrapper loop and layout work
Status: accepted after parent validation
Collected: 2026-06-11 MDT / 2026-06-12 UTC

## What Changed

- `src/components/DitheredHeroCanvas.jsx` now keeps a ref to the vendor renderer so the wrapper can call `pause()` and `resume()` when the hero is hidden or visible.
- The auto-reveal wrapper now caches the inner WebGL canvas and its `getBoundingClientRect()` result instead of querying and measuring the canvas on every animation frame.
- Canvas rect refreshes are invalidated by resize, scroll, root/canvas resize, DOM mutation, visibility, and hero intersection changes.
- The wrapper auto-reveal RAF is cancelled while the document is hidden or the hero is offscreen, then restarted with a fresh timestamp when visible again.
- `useInteractionScale` now coalesces resize observer and window resize updates into one RAF.

The implementation intentionally keeps synthetic pointer events because the public `@dithered-particle-canvas/react` hook does not expose a trail or pointer setter.

## Validation

Commands:

```sh
npm run astro -- build
git diff --check -- src/components/DitheredHeroCanvas.jsx agents/hero-performance-dispatch-board.md
```

Both passed.

Browser smoke used the local static build at `http://127.0.0.1:4321/`:

- Desktop viewport: `1200 x 952`
- Narrow viewport after resize: `390 x 844`
- Checked pointer pause path, scroll away/back, resize, console/page errors, resource timings, and reduced-motion.
- No page errors were reported.
- The only browser warning was the pre-existing `pictureofme-384.avif` preload warning, unrelated to the hero canvas.
- Reduced-motion path loaded no `DitheredHeroCanvas` chunk and no hero background/foreground resources.

Smoke metrics from this run:

| Case | Long Tasks | Total | Max |
| --- | ---: | ---: | ---: |
| Desktop default | 6 | 676 ms | 171 ms |
| Reduced motion | 0 | 0 ms | 0 ms |

These numbers are directional, not a final benchmark, because browser cache/process warmup differed from the baseline run.

## Visual Check

Current screenshots:

- `agents/hero-performance-t4-assets/desktop-hero-viewport-after-shader.png`
- `agents/hero-performance-t4-assets/narrow-hero-viewport-after-shader.png`

The narrow screenshot matches the baseline viewport dimensions exactly (`390 x 844`) and was visually checked against `agents/hero-performance-baseline-assets/narrow-hero-viewport-after-shader.png`. Desktop layout was visually checked, but the baseline desktop capture used a higher device scale (`2400 x 1904`) while this smoke capture is `1200 x 952`, so it is not a pixel-diff oracle.

## Review Gate

`REVIEW-T4` (`019eb9b6-9e41-7051-9edc-d468219ef2b4`) reviewed the uncommitted diff and found no actionable issues.

Residual review note: `dispatchAutoPointers` still sends synthetic pointer events into the vendor canvas, and the vendor handler still performs its own pointer-event rect work. That matches the accepted T4 strategy, but a final performance pass should verify the real layout-work reduction.

## Remaining Work

- The current branch has since adopted precomputed hero assets and removed the heavy runtime image-prep path from `DitheredHeroCanvas.jsx`.
- T6 should run a fresh current-HEAD comparison with cold-ish browser conditions and consistent device scale before claiming final performance deltas.
