# Hero Performance Dispatch Board

Generated: 2026-06-11

## Parent Coordination
- Plan source: `agents/hero-performance-subtasks.md`
- Parent-owned work: sequencing, integration review, final validation, and any commits after accepted results.
- Commit status: T5, T1R, T2A, and T4 are committed.

## Active Agents
| Task | Agent | Status | Write Scope | Commit Status | Notes |
| --- | --- | --- | --- | --- | --- |
| T1 baseline | Peirce (`019eb47f-536e-7812-946c-aac89cba8b19`) | unavailable after interruption | `agents/hero-performance-baseline.md`, optional `agents/hero-performance-baseline-assets/` | not applicable | Replaced by T1R. |
| T1R baseline | Locke (`019eb9a0-6c0d-7142-8b47-0b3465931980`) | partial handoff, parent-accepted artifact | `agents/hero-performance-baseline.md`, optional `agents/hero-performance-baseline-assets/` | committed `c620ce7` | Baseline markdown and screenshots produced; parent accepts as T2/T3/T4 oracle with noted limitations. |
| PLAN-ENG-GATE | Pauli (`019eb47f-81c4-7630-9ca0-7c42fadad0ca`) | complete, integrated as constraints | read-only | not applicable | T2 must capture browser reference artifacts and define generated-asset build path before T3. |
| T5 resources | Ampere (`019eb47f-b96b-78d1-b60b-4a845e0ed1bc`) | complete, parent-integrated for current file shape | `src/components/Projects.jsx`, optional `agents/hero-performance-t5-resource-notes.md` | committed `0e5a08b` | Parent reapplied the resource scheduling change to current `ProjectCard`/`motion.img`; `npm run astro -- build` passed. |
| T4 investigate | Hooke (`019eb47f-f8eb-7350-8c00-fb22799a3e5e`) | complete, integrated as notes | read-only | not applicable | Keep synthetic events; optimize wrapper loop/lifecycle only. |
| REVIEW-T5 | Heisenberg (`019eb9a0-e01b-70b1-899b-560b6c2ebadd`) | complete, clean | read-only | not applicable | No issues found; minor residual fast-scroll image-latency risk noted. |
| T2A references | Bohr (`019eb9ab-896a-7211-8489-78f87eaa1f07`) | partial, parent-accepted as reference evidence | `agents/hero-performance-t2-precompute-notes.md`, `agents/hero-performance-t2-reference-assets/` | committed `1df7e69` | Captured browser-produced mountain/WebGL references and build-path notes; not ready for T3 consumption. |
| T4 implementation | Hooke (`019eb9ab-c6a9-76e3-9339-6899f061f173`) | complete, parent-accepted after review/smoke | `src/components/DitheredHeroCanvas.jsx`, `agents/hero-performance-t4-implementation-notes.md`, `agents/hero-performance-t4-assets/` | committed `afdc71b` | Build, diff check, read-only review, and browser smoke passed. |
| REVIEW-T4 | Kuhn (`019eb9b6-9e41-7051-9edc-d468219ef2b4`) | complete, clean | read-only | not applicable | No code findings; noted vendor synthetic pointer path still needs profiling for exact layout-work reduction. |

## Pending Tasks
| Task | Status | Dependency |
| --- | --- | --- |
| T2 precompute deterministic hero image work | partially complete as T2A | Raw helper ImageData capture, generated candidate assets, and asset-size comparison still needed before T3. |
| T3 simplify `DitheredHeroCanvas` runtime | pending | T2 recommendation/adopted assets; staged consume-first/remove-helpers-second integration |
| T4 implementation | complete | T1R baseline; safe strategy captured in `agents/hero-performance-t4-investigation.md` |
| T6 validate visual equivalence and performance gains | post-T4/T5 validation complete with concerns | Full pass still depends on completed T2/T3 deterministic asset work. |

## Integration Rules
- Do not allow simultaneous code edits to `src/components/DitheredHeroCanvas.jsx`.
- Review subagent outputs against the task card acceptance criteria before accepting.
- Stage only accepted files with known ownership if committing later.
- Keep visual equivalence higher priority than raw metric gains.
- Treat browser-produced reference artifacts as the oracle for T2/T3 visual equivalence.
- Do not extend `scripts/generate-dithered-background.mjs` blindly: its pixel size and filter ordering differ from the runtime path.
