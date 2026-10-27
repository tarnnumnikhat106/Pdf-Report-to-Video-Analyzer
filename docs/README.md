# Project Documentation Index

This folder is the single source of truth for the project's goals, progress, and open issues.
Update it after every work session so the team and AI assistants always share the same context.

## Documents

| File | Purpose | Update frequency |
| --- | --- | --- |
| [GOALS.md](./GOALS.md) | Vision, scope, milestones, success criteria, risks | Rarely; only when scope or milestones change |
| [PROGRESS.md](./PROGRESS.md) | Living status: completed, in progress, next, verification results, session log | Every work session |
| [UI_ISSUES.md](./UI_ISSUES.md) | Prioritized UI/UX bug tracker with acceptance criteria and fix status | Whenever an issue is found, fixed, or reprioritized |
| [FIX_PLAN.md](./FIX_PLAN.md) | Step-by-step phased plan to fix all tracked issues, with verification and rollback | When the plan or its status changes |

## How to maintain these docs

1. **Before starting work**: read `PROGRESS.md` to see the current focus, then pick the next item.
2. **While working**: if you discover a new bug or task, add it to `UI_ISSUES.md` (or the backlog in `PROGRESS.md`) with an ID and a location.
3. **Before ending work**:
   - Move finished items to "Completed" in `PROGRESS.md`.
   - Update the milestone checklist.
   - Add a row to the Session Log with the date, what changed, and any blockers.
   - Update issue statuses in `UI_ISSUES.md`.
4. **Keep IDs stable**: never renumber `UI-xx` or `Gx` items; mark them `DONE` instead.
5. **No secrets**: never paste API keys, tokens, or patient data into these files.

## Status legend

| Marker | Meaning |
| --- | --- |
| `DONE` | Implemented and verified |
| `IN PROGRESS` | Actively being worked on |
| `BLOCKED` | Waiting on a dependency or decision |
| `TODO` | Not started |
| `WONTFIX` | Intentionally out of scope; see GOALS.md |

## Project snapshot

- **Product**: MedVision AI - medical report analysis and educational video explanation.
- **Stack**: React 19 + Vite 8 + Tailwind CSS 4 (frontend), FastAPI (backend), scikit-learn models (ML), Llama 3.2 via Ollama or an optional external OpenAI-compatible API, edge-tts English/Hindi neural voices + offline pyttsx3 fallback + FFmpeg (video).
- **AI settings**: hidden `/ai-settings` page for an in-memory API key; see [PROGRESS.md](./PROGRESS.md) for setup caveats.
- **Narration**: choose English or Hinglish in the video modal. Hinglish uses the `hi-IN-SwaraNeural` voice with everyday English mixed in; override voices and pacing with `TTS_*` environment variables.
- **Current phase**: see [PROGRESS.md](./PROGRESS.md).
- **Known blockers**: see [UI_ISSUES.md](./UI_ISSUES.md) critical items.
