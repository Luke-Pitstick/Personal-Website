# Hero Performance Subtasks

Generated: 2026-06-11

## Goal
Improve the home-page hero's load, CPU, memory, and runtime animation performance while preserving the current core behavior and matching the current visual output.

## Current Branch Note
This planning artifact is historical. The current branch has implemented the precomputed hero asset path, including `/hero-paper.webp`, idle module/data warmup, auto-reveal throttling and lifecycle reductions, coarse-pointer auto-only seeding, and production pruning of source-only hero JPEGs. Use `agents/hero-performance-dispatch-board.md` for current status.

## Frame
- Desired outcome: the hero should feel and measure lighter without changing the static first paint, portrait/title/socials, scroll affordance, shader reveal behavior, fallback behavior, or reduced-motion behavior.
- Known constraints: visual output must remain the same after performance changes; core functionality must not change; changes should be behavior-preserving and reviewable.
- Users affected: first-time site visitors, mobile visitors, reduced-motion users, and users on devices with weaker GPUs or no WebGL2 support.
- Existing artifacts inspected: `src/pages/index.astro`, `src/components/Hero.jsx`, `src/components/HeroContent.astro`, `src/components/DitheredHeroCanvas.jsx`, `src/styles/global.css`, `scripts/generate-dithered-background.mjs`, `scripts/generate-hero-portrait.mjs`, `vendor/dithered-particle-canvas-react/README.md`, `vendor/dithered-particle-canvas-react/dist/index.js`.
- Assumptions: the interactive dithered reveal is intentional and should remain; acceptable optimizations must be validated by metrics and visual comparison, not by subjective cleanup alone.

## Current Baseline
- Build: `npm run build` succeeded. Client chunks included `Hero` at 6.08 kB raw / 2.69 kB gzip and `DitheredHeroCanvas` at 62.15 kB raw / 20.06 kB gzip. Shared `client` was 186.62 kB raw / 58.46 kB gzip and `motion` was 123.27 kB raw / 40.29 kB gzip.
- Static hero path: `src/pages/index.astro` renders the static dithered background and hero content before `Hero client:idle` hydrates.
- Deferred shader path: `src/components/Hero.jsx` waits at least 900 ms plus idle callback before lazy-loading `DitheredHeroCanvas`.
- Local browser profile at `http://127.0.0.1:4321/`, 1200 x 952 viewport, DPR 2: FCP around 188 ms; no app console errors; `DitheredHeroCanvas` loaded around 1198 ms; `background.jpg` and `chautauqua-flatirons_fg.jpg` started around 1531 ms; used JS heap after idle was about 62.6 MB.
- Desktop post-idle canvas state: WebGL canvas was 2166 x 1219 backing pixels, foreground mountain canvas was 1280 x 720, and two canvases were present.
- Narrow viewport check at 390 x 844, DPR 1 after immediate resize: WebGL canvas was 960 x 540 backing pixels, foreground mountain canvas stayed 1280 x 720, both scaled to roughly 1500 x 844 CSS pixels.
- Memory model: one 1280 x 720 RGBA `ImageData` buffer is about 3.52 MiB; the current component creates or holds multiple full-size buffers before WebGL texture memory is considered.
- Notable resource contention: below-fold project HTML includes at least one `loading="eager"` project image, and those remote project images appeared in early resource timing. This is not hero code, but it can compete with the hero's first viewport budget.

## Execution Shape
- Critical path: T1 baseline and budgets -> T2 build-time asset spike -> T3 integrate simplified hero runtime -> T6 visual and performance validation.
- Parallel lanes: T4 animation lifecycle audit can run after T1; T5 first-viewport resource scheduling can run after T1 because it touches `Projects.jsx`, not the hero internals.
- Integration point: T6 must validate the combined output across desktop, narrow viewport, reduced motion, and no-WebGL fallback.
- Riskiest assumption: precomputed hero assets can replace runtime image preprocessing without a visible difference.
- Minimum complete slice: keep current renderer and behavior, but move deterministic background/foreground preprocessing out of `DitheredHeroCanvas.jsx` and prove visual equivalence with screenshots.

## Subtasks

### T1: Establish Hero Performance Baseline

Outcome: a reproducible measurement script or documented command set that captures current hero performance before any implementation changes.

Scope: measure current behavior only. Include initial paint, idle shader activation, resource timing, long tasks, canvas dimensions, JS heap if available, console errors, and screenshots. Do not change production code.

Context packet:
- Files: `src/pages/index.astro`, `src/components/Hero.jsx`, `src/components/DitheredHeroCanvas.jsx`, `src/styles/global.css`.
- Commands: `npm run build`; serve `dist/` locally with `python3 -m http.server 4321 --bind 127.0.0.1`.
- Baseline observations from this plan's "Current Baseline" section.

Agent instructions:
- Use the debug-runtime approach: define hypotheses, gather browser runtime evidence, and keep any instrumentation temporary.
- Capture at least desktop and narrow viewport profiles after a clean build.
- Record when `Hero` and `DitheredHeroCanvas` resources load, when `background.jpg` and `chautauqua-flatirons_fg.jpg` load, canvas backing sizes, and whether shader interactivity becomes active.
- Save the measurement method in a repeatable artifact, such as `agents/hero-performance-baseline.md` or a small script under `scripts/` if automation is worth it.

Expansion path: if browser timing is noisy, repeat each profile three times and report medians. If Playwright viewport control is flaky, use one browser context per viewport and document the exact workaround.

Reuse/library check: prefer standard browser Performance APIs, Playwright, and existing build output. Do not add Lighthouse or bundle-analyzer dependencies unless the built-in evidence is insufficient.

Acceptance criteria:
- Baseline artifact includes commands, environment, viewport sizes, metrics, and screenshots.
- No permanent debug logs or measurement-only code remains in production files.
- A performance budget is proposed for the implementation tasks, for example lower post-idle JS heap, fewer runtime ImageData loops, fewer early bytes competing with the hero, and no additional long tasks over 50 ms.

Validation: rerun the measurement artifact from a clean checkout/build and confirm it produces the same categories of data.

Dependencies: none.

Handoff: baseline artifact path, metrics table, screenshots, and recommended budgets.

### T2: Precompute Deterministic Hero Image Work

Outcome: a narrow spike that proves whether runtime image preprocessing in `DitheredHeroCanvas.jsx` can move to build time with visually equivalent output.

Scope: target deterministic work only: `loadSkyRevealBackground`, `enhanceSkyBackground`, `loadMattedMountainForeground`, `applyConnectedSkyMatte`, `pixelateOpaqueForeground`, and `applyMountainColorFilters`. Keep the live WebGL reveal and pointer behavior unchanged.

Context packet:
- Current runtime preprocessing lives in `src/components/DitheredHeroCanvas.jsx`.
- Existing build-time precedent lives in `scripts/generate-dithered-background.mjs`.
- Source assets: `public/background.jpg`, `public/chautauqua-flatirons_fg.jpg`, `public/background-dithered.webp`.
- Existing asset generation dependency: `sharp`.

Agent instructions:
- Port the deterministic foreground/background transforms into a build-time generator, or extend the existing hero asset generator if that keeps the scripts simpler.
- Generate candidate assets for the reveal background and the matted/pixelated/palette-filtered foreground.
- Preserve dimensions, crop positioning, color transforms, alpha behavior, and pixelation behavior exactly unless T1 metrics and visual diff prove a smaller equivalent is safe.
- Produce before/after visual comparisons using the current runtime output as the reference.

Expansion path: if exact pixel equivalence is hard due browser canvas color management, define an acceptable pixel-diff threshold and manually review screenshots at desktop and narrow viewport. If generated foreground WebP alpha quality visibly differs, test PNG despite larger bytes.

Reuse/library check: before implementing custom image code, use `$deep-dive` or a focused local spike to compare `sharp` APIs, Node canvas options, and the existing JS algorithms. Prefer `sharp` when it exactly reproduces the current result with less code; keep custom ported loops when exactness matters more than elegance.

Acceptance criteria:
- Generated assets render visually equivalent to current runtime output.
- Runtime code no longer needs the heaviest deterministic per-pixel transforms if the spike succeeds.
- Asset byte sizes are recorded and compared against the current `background.jpg` plus `chautauqua-flatirons_fg.jpg` path.

Validation: build assets, serve locally, compare screenshots, and record pixel-diff/manual review results.

Dependencies: T1 baseline.

Handoff: generated asset names, generator script changes or spike notes, before/after screenshots, byte-size table, and a recommendation to adopt or reject.

### T3: Simplify `DitheredHeroCanvas` Runtime

Outcome: a smaller, more maintainable hero runtime that uses precomputed assets where T2 proves safe, while preserving the current interactive reveal.

Scope: edit `src/components/DitheredHeroCanvas.jsx` and related CSS/assets only as needed. Keep props, visible DOM layering, shader hint behavior, auto reveal behavior, static fallback behavior, and reduced-motion behavior intact.

Context packet:
- Main complexity hotspot: `src/components/DitheredHeroCanvas.jsx` is about 29 KB and mixes rendering, preprocessing, fallback generation, pointer simulation, resizing, and color utilities.
- Current canvas loading and state are in lines around the `idleLayer`, `revealBackground`, `mountainBase`, `layers`, and `mountains` effects.
- CSS layering for static background, shader canvas, mountain canvas, and shade lives in `src/styles/global.css`.

Agent instructions:
- Replace runtime foreground generation with a precomputed visual layer if T2 validates it.
- Replace runtime reveal-background enhancement with a precomputed source if T2 validates it.
- Remove now-unused per-pixel helper functions from the client bundle.
- Keep local helpers only when they support live behavior. Prefer descriptive small helpers over new abstraction layers.
- Ensure the static fallback still works when WebGL2 is unavailable and when images fail.

Expansion path: if direct asset URLs through `DitheredParticleCanvas` reintroduce expensive package-level decoding or visual drift, test whether passing a preloaded `ImageBitmap` or `ImageData` is better. Adopt only the path that improves metrics without visual changes.

Reuse/library check: use the existing `@dithered-particle-canvas/react` API rather than custom rendering. Before adding any new client dependency, prove it reduces bundle/runtime cost after integration overhead.

Acceptance criteria:
- Current functionality remains: static first paint, delayed shader activation, auto reveal, cursor reveal on fine pointers, auto-only behavior on coarse pointers, shader hint, dismiss behavior, scroll button, and fallback.
- Client chunk size for `DitheredHeroCanvas` decreases meaningfully or runtime CPU/heap decreases measurably.
- No production `console.log` or temporary debug code remains.

Validation: `npm run build`; T1 measurement rerun; manual interaction test for cursor reveal and scroll button; screenshots before and after at the same viewports.

Dependencies: T1 and T2.

Handoff: diff summary, removed runtime helper list, metrics comparison, and any intentionally retained complexity.

### T4: Reduce Animation Loop and Resize Overhead

Outcome: the interactive shader loop does less per-frame DOM work and pauses when it cannot be seen, without changing the animation's appearance when visible.

Scope: focus on `src/components/DitheredHeroCanvas.jsx` animation lifecycle. Do not change shader colors, reveal radius, trail timing, quality, or visible timing unless visual equivalence is proven.

Context packet:
- Current auto reveal loop runs a `requestAnimationFrame`, queries `.dithered-hero-canvas canvas`, reads `getBoundingClientRect`, steps five auto pointer balls, and dispatches synthetic `PointerEvent`s each frame.
- Current resize scale uses `ResizeObserver` plus a window resize listener.
- The vendored package exposes `DitheredParticleCanvas` and `useDitheredCanvas`, but renderer internals are private.

Agent instructions:
- Cache the inner canvas element once available instead of querying every frame, if safe.
- Cache or update canvas rect through resize/observer events instead of reading layout every frame, if safe.
- Pause auto reveal on `document.visibilityState === "hidden"` and when the hero is outside the viewport, while resuming seamlessly.
- Investigate whether the public `useDitheredCanvas` API can replace synthetic pointer events. Use it only if it is simpler and behavior-equivalent.

Expansion path: if the public API does not expose pointer updates, keep synthetic events and optimize only DOM reads. If pausing offscreen creates visible catch-up artifacts, reset timestamps on resume.

Reuse/library check: prefer browser APIs already available: `IntersectionObserver`, `visibilitychange`, `ResizeObserver`, and the vendored package's public API. Do not add an animation library.

Acceptance criteria:
- Visible auto reveal and cursor reveal look the same to users.
- Per-frame DOM queries/layout reads are reduced or eliminated.
- Hidden-tab and offscreen hero work pauses without errors.

Validation: browser performance profile with screenshots/video observation; console has no app errors; manual tests for pointer move, tab hide/show, resize, and scroll out/in.

Dependencies: T1. Can run in parallel with T2.

Handoff: lifecycle changes, before/after per-frame work notes, and behavioral test notes.

### T5: Remove First-Viewport Resource Contention

Outcome: non-hero resources stop competing with the hero's first viewport budget while keeping below-fold content visually the same when reached.

Scope: inspect and adjust only resource scheduling that impacts the hero phase. Likely file: `src/components/Projects.jsx`. Do not redesign projects or change project content.

Context packet:
- `Projects` is hydrated with `client:visible`, but Astro still renders project image tags into the initial HTML.
- `ProjectTile` currently sets the flagship image to `loading="eager"`, which caused remote project image resource entries during the hero profile.
- The hero image preload in `src/pages/index.astro` and `HeroContent.astro` is intentional and should remain high priority unless T1 shows duplication or mismatch.

Agent instructions:
- Change below-fold project images to lazy/deferred loading if measurements confirm they compete with hero resources.
- Keep width, height, decoding, object positioning, and visual presentation unchanged.
- Confirm project images still load before or as their tiles become visible during normal scrolling.

Expansion path: if lazy loading alone is insufficient, evaluate whether project cards should defer image `src` until intersection. Do that only if it preserves SEO/accessibility expectations and does not flash empty cards during normal scroll.

Reuse/library check: prefer native `loading="lazy"`, `fetchpriority`, and `decoding` attributes before adding observers or dependencies.

Acceptance criteria:
- Early resource timing no longer includes below-fold project image downloads during initial hero idle window, or includes fewer/lower-priority downloads with a documented reason.
- Project section looks the same once visible.

Validation: T1 resource timing rerun; manual scroll to projects; screenshots of project tiles after images load.

Dependencies: T1. Can run in parallel with T2/T4.

Handoff: resource timing comparison and project-section visual check.

### T6: Validate Visual Equivalence and Performance Gains

Outcome: final proof that the optimized hero behaves and looks the same while measuring better.

Scope: integrate outputs from T2-T5 and run final validation. Do not introduce new performance changes here unless a small fix is needed to pass acceptance criteria.

Context packet:
- Use the T1 baseline artifact and budgets.
- Validate `src/pages/index.astro`, `src/components/Hero.jsx`, `src/components/HeroContent.astro`, `src/components/DitheredHeroCanvas.jsx`, `src/styles/global.css`, generated assets, and any resource-scheduling changes.

Agent instructions:
- Run `npm run build`.
- Serve the built site and capture screenshots for desktop, narrow viewport, reduced motion, and no-WebGL/static fallback when possible.
- Compare before/after metrics: initial paint, shader chunk load timing, hero image resources, canvas sizes, long tasks, JS heap, and early non-hero resources.
- Manually verify: scroll button, social hide/show, shader hint, hint dismiss, auto reveal, cursor reveal, reduced motion no shader load, fallback if WebGL2 unavailable.

Expansion path: if a metric improves but visual drift appears, prioritize visual equivalence and send the change back to the relevant implementation task. If a visual match is exact but metrics are flat, document why and identify the next likely bottleneck.

Reuse/library check: use existing scripts and browser tooling; avoid adding new test dependencies for a one-off visual check unless repeatability clearly justifies it.

Acceptance criteria:
- Visual output matches baseline screenshots at the same viewport states.
- Core functionality checklist passes.
- At least one meaningful performance budget improves without regressions elsewhere.
- Final report includes metrics table, screenshots, and remaining risks.

Validation: complete checklist above after all temporary instrumentation is removed.

Dependencies: T2, T3, and any adopted T4/T5 changes.

Handoff: final performance report, screenshot paths, and merge-ready summary.

## Coordination Notes
- Avoid assigning parallel agents to edit `src/components/DitheredHeroCanvas.jsx` at the same time. T2 should finish or clearly hand off before T3 edits the component.
- T4 can safely investigate while T2 runs, but its implementation should rebase onto T3 if both touch animation setup.
- T5 is independent of hero rendering code but should be validated in the same final profile because it affects the first viewport network budget.
- Do not lower shader quality, reduce reveal radius, change colors, remove the mountain layer, or alter timing as a shortcut unless a visual equivalence check proves the output is unchanged.
- The preferred optimization shape is "same pixels, less runtime work": precompute deterministic image transforms, keep live reveal logic, and simplify the client component.

## Engineering Gate Addendum
- Before T2 generator work, capture browser-produced reference artifacts for the current reveal background, final mountain canvas, and full hero screenshots. Treat these as the oracle for visual equivalence.
- Do not assume `scripts/generate-dithered-background.mjs` matches the runtime path: it currently uses a different background pixel size than `DitheredHeroCanvas.jsx`, and its transform ordering may differ from the vendor renderer.
- T2 must decide whether generated hero assets are committed under `public/` or generated by `npm run build`; T3 should not consume generated assets until this build/deploy path is explicit.
- Split T3 into two reviewable moves: first consume validated precomputed assets while preserving behavior, then remove dead runtime helpers only after visual and performance validation passes.
- Keep using `@dithered-particle-canvas/react` for live reveal unless a spike proves a simpler replacement preserves behavior and improves metrics after integration cost.

## Suggested Next Dispatch
Run T1 first:

```text
Using the debug-runtime skill, establish a reproducible performance baseline for the current home-page hero. Inspect `src/pages/index.astro`, `src/components/Hero.jsx`, `src/components/DitheredHeroCanvas.jsx`, and `src/styles/global.css`; run `npm run build`; serve `dist/` locally; collect browser Performance API metrics, resource timing, canvas dimensions, heap where available, console errors, and screenshots for desktop and narrow viewport. Do not change production code. Return a baseline artifact path, metrics table, screenshots, and proposed budgets for behavior-preserving hero optimization.
```
