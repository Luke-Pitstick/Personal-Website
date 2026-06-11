# T4 Animation Loop Investigation

## Recommendation
- Keep synthetic pointer events. The public `useDitheredCanvas` API does not expose a pointer or trail setter, and reaching into private renderer state would add risk.
- Use the `DitheredParticleCanvas` public imperative handle only for lifecycle control if implementing T4: `pause()` and `resume()`.
- Target wrapper overhead in `DitheredHeroCanvas.jsx`, especially the per-frame canvas query and `getBoundingClientRect()` call.

## Safe Patch Sequence
- Cache the inner vendor canvas after first discovery, re-querying only if it is missing or disconnected.
- Cache the canvas rect and refresh on resize, scroll, resize observer, and intersection changes.
- Cancel the wrapper RAF loop when the document is hidden or the hero is not intersecting.
- Reset `lastAutoRevealTime` on resume to avoid catch-up jumps.
- Preserve `AUTO_CURSOR_RESUME_MS`, ball constants, `stepAutoRevealBalls`, and the synthetic `PointerEvent` shape.
- Coalesce `useInteractionScale` resize work with one pending RAF callback while keeping both `ResizeObserver` and `window.resize`.

## Validation Checklist
- Desktop pointer movement pauses auto reveal, cursor reveal still works, and auto reveal resumes after about 2400 ms.
- Hide/show tab does not produce a burst or console errors.
- Desktop and narrow viewport resize preserve reveal scale and framing.
- Scrolling out and back pauses/resumes without offset reveal.
- Reduced motion still prevents shader load through the parent `Hero` path.
