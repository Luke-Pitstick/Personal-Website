# Hero Performance Dispatch Board

Generated: 2026-06-11

## Parent Coordination
- Plan source: `agents/hero-performance-subtasks.md`
- Parent-owned work: sequencing, integration review, final validation, and any commits after accepted results.
- Commit status: no delegated result is ready to commit yet.

## Active Agents
| Task | Agent | Status | Write Scope | Commit Status | Notes |
| --- | --- | --- | --- | --- | --- |
| T1 baseline | Peirce (`019eb47f-536e-7812-946c-aac89cba8b19`) | running | `agents/hero-performance-baseline.md`, optional `agents/hero-performance-baseline-assets/` | not ready | Critical-path baseline artifact. |
| PLAN-ENG-GATE | Pauli (`019eb47f-81c4-7630-9ca0-7c42fadad0ca`) | complete, integrated as constraints | read-only | not applicable | T2 must capture browser reference artifacts and define generated-asset build path before T3. |
| T5 resources | Ampere (`019eb47f-b96b-78d1-b60b-4a845e0ed1bc`) | complete, parent-reviewed | `src/components/Projects.jsx`, optional `agents/hero-performance-t5-resource-notes.md` | ready after final validation | Changed project images to `loading="lazy"` and `fetchPriority="low"`; no hero files touched. |
| T4 investigate | Hooke (`019eb47f-f8eb-7350-8c00-fb22799a3e5e`) | complete, integrated as notes | read-only | not applicable | Keep synthetic events; optimize wrapper loop/lifecycle only. |

## Pending Tasks
| Task | Status | Dependency |
| --- | --- | --- |
| T2 precompute deterministic hero image work | pending | T1 baseline, browser-produced reference artifacts, and generated-asset build-path decision |
| T3 simplify `DitheredHeroCanvas` runtime | pending | T2 recommendation/adopted assets; staged consume-first/remove-helpers-second integration |
| T4 implementation | pending | T1 baseline; safe strategy captured in `agents/hero-performance-t4-investigation.md` |
| T6 validate visual equivalence and performance gains | pending | T2/T3 and any accepted T4/T5 changes |

## Integration Rules
- Do not allow simultaneous code edits to `src/components/DitheredHeroCanvas.jsx`.
- Review subagent outputs against the task card acceptance criteria before accepting.
- Stage only accepted files with known ownership if committing later.
- Keep visual equivalence higher priority than raw metric gains.
- Treat browser-produced reference artifacts as the oracle for T2/T3 visual equivalence.
- Do not extend `scripts/generate-dithered-background.mjs` blindly: its pixel size and filter ordering differ from the runtime path.
