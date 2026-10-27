# Progress Tracker

> Living document. Update this after every work session.
> Scope and milestones are defined in [GOALS.md](./GOALS.md). Bugs live in [UI_ISSUES.md](./UI_ISSUES.md).

**Last updated:** 2026-10-27
**Current focus:** Design refresh, the low-power video pipeline, external LLM provider settings, and the dev upload flow are complete; M4 is verified. Remaining: UI-15 launcher offset, DOC-01/DOC-02, and the Phase 5 regression matrix.
**Next milestone:** M5 - Stabilization and demo readiness

## 1. Status by area

| Area | Status | Notes |
| --- | --- | --- |
| Frontend pages & routing | DONE | 12 routes wired in `src/App.jsx`, including the hidden `/ai-settings` page; layout, navbar, footer in place |
| Frontend components | DONE | Common, report, video, and layout components implemented |
| Design system (Tailwind 4) | DONE | Warm editorial tokens, serif display type, hairline surfaces, reduced-motion guard; legacy screens harmonized by the palette remap |
| API client + mock fallback | DONE | `src/services/api.js` falls back to mock reports/video when the backend is unreachable; provider settings intentionally surface real errors instead of faking a connection |
| FastAPI backend | DONE | Endpoints for upload, analyze, report fetch, video, ML, chat in `backend/app.py` |
| ML models (CBC/LFT/KFT) | DONE | Models present in `ML/` and `backend/models/`; RandomForest classifier |
| LLM providers | DONE | External OpenAI-compatible API (Groq/OpenRouter/Gemini/OpenAI/custom) plus Ollama and rule fallback; keys are runtime-only and masked in every response |
| Video generation pipeline | DONE | FFmpeg narrated slides at 1920x1080/10 fps/ultrafast CRF 23; natural neural TTS with direct second-person English (Ava) and Hinglish (Swara) narration, plus offline pyttsx3 fallback; optional API-written bilingual narration; modal calls the backend and polls status; end-to-end generation, playback, chapters, and captions verified |
| Accessibility pass | IN PROGRESS | Modal focus trap, labels, and Escape handling done (UI-09/11/12); keyboard matrix and launcher offset (UI-15) remain |
| Automated tests | TODO | No unit/integration/e2e tests configured |
| Documentation | IN PROGRESS | `docs/` created; root `README.md` is still the Vite template |

## 2. Milestone checklist

- [x] M0 - Project scaffolding
- [x] M1 - Frontend demo shell
- [x] M2 - Backend integration
- [x] M3 - ML + Llama pipeline
- [x] M4 - Video pipeline (low-power generation, polling, playback, chapters, and captions verified)
- [ ] M5 - Stabilization & demo readiness (no critical UI issues, build/lint clean, demo script verified)

## 3. Completed

- [x] React + Vite + Tailwind 4 project setup with routing and shared layout.
- [x] Pages: Landing, Upload, Analysis Loading, Analysis Dashboard, Finding Details, Video Explanation, History, ML Diagnostic, About, Privacy & Safety, 404.
- [x] Upload with drag-and-drop, extension/size validation, and progress UI.
- [x] Mock reports (`src/services/mockData.js`) for CBC, lipid, and metabolic panels.
- [x] Dashboard with search, status filters, category pills, stat cards, and finding cards.
- [x] Finding detail modal and dedicated finding detail page.
- [x] ML diagnostic lab page with editable biomarkers, presets, visual ML output, and JSON view.
- [x] FastAPI backend with report, video, ML, and diet-chat endpoints.
- [x] RandomForest models for CBC, LFT, and KFT.
- [x] Llama 3.2 prompt/response service with clinical-rule fallback.
- [x] Toast system, loading/empty/error states, and medical disclaimers.
- [x] Documentation structure created (`docs/`).
- [x] Phase 1 of the fix plan: dashboard `ShieldCheck` crash, raw LaTeX arrows, and route-aware scroll reset (UI-01, UI-02, UI-04).
- [x] Phase 2 of the fix plan: entry animations enabled via `tw-animate-css` with a reduced-motion guard (UI-05), and the video player bound to real `<video>` media with a fallback (UI-03).
- [x] Design refresh: warm paper/ink token system, serif display headings, hairline cards, restrained motion, and palette remap in `src/index.css`.
- [x] Rewrote shared primitives (`Button`, `Card`, `SeverityBadge`, `StatCard`, `Navbar`, `Footer`, `Disclaimer`, `Toast`, `Modal`) and the Landing/Upload screens.
- [x] Reworked the dashboard: editorial header, stat cards, filters, `LlamaAdvisorCard`, `DietChatSection`, and finding cards; fixed the page-scroll-on-mount bug caused by chat auto-scroll.
- [x] Reworked ML Diagnostic, Video Explanation, History, About, Finding Details, and Privacy screens for consistent typography and states.
- [x] Video player: real media binding, fallback overlay, underline tabs, hand-styled transcript, and mobile-safe header actions.
- [x] Added `formatReportName` (`src/utils/format.js`) and applied it to report/video/history headings.
- [x] Phase 3 of the fix plan: honest Ollama status (UI-06), responsive toasts (UI-07), transcript styling (UI-08), and modal focus management (UI-09).
- [x] Phase 4 cleanup: UI-10 through UI-14 and UI-16 fixed; unused imports/vars swept (UI-17). Only UI-15 (launcher offset) remains.
- [x] Mobile audit at 390 px via Selenium device emulation; fixed horizontal overflow on the video tab bar and a `hidden`/`inline-flex` conflict that kept the Print button visible on mobile.
- [x] Replaced the MoviePy video path with a low-power FFmpeg renderer: static 1920x1080 slides, 10 fps, `ultrafast`/`stillimage`/CRF 23, AAC mono 96k, faststart, and 720p/8 fps fallback via env vars. Added gauges, cover/finding/normal/next-step slides, chapter captions, and timestamped output URLs.
- [x] Wired `VideoGeneratorModal` to `POST /reports/{id}/video` and `GET /reports/{id}/video/status`; it now shows real progress/stages, handles errors/retry, refreshes the video page from the report, and avoids duplicate generation calls.
- [x] End-to-end smoke test: dashboard -> Generate video -> live status -> Watch video -> real `<video>` with 1080p/10 fps source, 1:59 duration, correct chapters/captions, and 0 console errors.
- [x] Added `backend/llm_provider.py`: OpenAI-compatible requests, provider presets with key links, environment fallback, connection testing, masked status, JSON extraction, and runtime-only key storage.
- [x] Added `/api/llm/config` GET/POST/DELETE and `/api/llm/providers`; added `llm` status to `/api/ml/status`. API keys never appear in responses or logs.
- [x] Wired the configured provider into report advice, diet chat, and video narration, with Ollama and built-in rule fallback; video metadata records `narrationMode` and `scriptModel`.
- [x] Added hidden `src/pages/AISettingsPage.jsx` at `/ai-settings` with a footer link, provider picker, password field, key links, test/save/clear actions, and local-demo security copy.
- [x] Fixed the dev upload dead-end: Vite now ignores `backend/`, so uploads no longer trigger a browser reload; `python app.py` starts without reload by default, so uploads/video writes no longer restart the backend and clear the in-memory API key.

## 4. In progress

- [x] Phase 1 - stabilize critical UI defects ([UI_ISSUES.md](./UI_ISSUES.md)):
  - [x] UI-01 Missing `ShieldCheck` import crashes the dashboard.
  - [x] UI-02 Raw LaTeX arrows render as text in the ML visualizer.
  - [x] UI-04 Scroll-to-top not tied to route changes.
- [x] Phase 2 - UI-05 enable the animation plugin.
- [x] Phase 2 - UI-03 bind the player to real generated media.
- [x] Phase 3 - UI-06 honest ML/Ollama status.
- [x] Phase 3 - UI-07 responsive toast container, UI-08 transcript styling, UI-09 modal focus trap.
- [x] Phase 4 - UI-10 to UI-14 and UI-16; unused imports/vars swept (UI-17).
- [x] AI provider settings - external OpenAI-compatible key, masked status, and fallback wiring.
- [ ] Phase 4 - UI-15 launcher offset; DOC-01 real README; DOC-02 demo checklist.
- [ ] Phase 5 - regression matrix and M5 sign-off.

## 5. Next up (prioritized backlog)

Execution order and per-step detail live in [FIX_PLAN.md](./FIX_PLAN.md).

1. **Phase 1 - Unblock the demo (DONE):** UI-01 (dashboard crash), UI-02 (LaTeX text), UI-04 (scroll-to-top).
2. **Phase 2 - Polish (DONE):** UI-05 (animation plugin), UI-03 (real video playback).
3. **Phase 3 - Correctness/a11y (DONE):** UI-06 (status indicator), UI-07 (toast overflow), UI-08 (transcript), UI-09 (modal focus).
4. **Phase 4 - Cleanup (IN PROGRESS):** UI-15 launcher offset, DOC-01 (real README), DOC-02 (demo checklist).
5. **Phase 5 - Regression (next):** run the manual matrix and mark M5 complete.

Deferred: add automated smoke tests for key pages (post-demo).

Video generation now polls `/reports/{id}/video/status`, and completed URLs carry a cache-busting timestamp so the player swaps to the new MP4 without a reload.

## 6. Verification status

| Check | Command | Result | Date |
| --- | --- | --- | --- |
| Lint | `npm run lint` | Passes with 7 known warnings (`set-state-in-effect`, Fast Refresh export); no unused-variable noise | 2026-10-27 |
| Build | `npm run build` | Passes; warns main chunk > 500 kB | 2026-10-27 |
| Animation utilities | build CSS check | `.animate-in`/`.fade-in`/`.slide-in-*`/`.zoom-in-*` present; reduced-motion guard added | 2026-10-27 |
| Visual review | Edge screenshots | Landing, upload, dashboard, video, ML, history, about, finding, privacy checked at desktop width | 2026-10-27 |
| Mobile review | Selenium mobile emulation (390 x 844) | `window.innerWidth = 390` on all checked routes; video tab-bar overflow and mobile Print-button conflict fixed | 2026-10-27 |
| Runtime smoke | manual | UI-01 through UI-14 and UI-16 code paths complete; full manual matrix pending Phase 5 | 2026-10-27 |
| Backend | `uvicorn app:app --port 8000` (in `backend/`) | Report/video/status endpoints verified; low-power MP4 regenerated (1080p, 10 fps, 1:59) | 2026-10-27 |
| Video E2E | Selenium + live FastAPI/Vite | Dashboard -> modal -> generation -> watch -> `<video>` readyState 4; 0 severe console errors | 2026-10-27 |
| ML | `uvicorn app:app --reload` (in `ML/`) | Models present; not re-verified this session | 2026-10-27 |
| LLM provider API | TestClient + local mock OpenAI server | Save/test/mask/clear pass; key absent from responses; clinical advice, diet chat, and video script use the API branch | 2026-10-27 |
| AI settings UI | Selenium + live FastAPI/Vite | Save, mask, reload persistence, clear, and 390 px layout pass; key absent from DOM; 0 severe console errors | 2026-10-27 |
| Upload E2E | Selenium + Vite dev + FastAPI | Select PDF -> Analyze report navigates to `/analysis-loading/{id}` in ~1.1s; 0 severe console errors | 2026-10-27 |
| Voice + Hinglish | Full backend render + Selenium | Second-person English narration; Hinglish Swara render produced a 1:57 MP4 with Hinglish transcript; modal language selector works with 0 severe console errors | 2026-10-27 |

## 7. Session log

| Date | Summary | Blockers / follow-ups |
| --- | --- | --- |
| 2026-10-27 | Created `docs/` with goals, progress, and UI issue tracker. Reviewed frontend for UI defects and logged them in `UI_ISSUES.md`. | Critical dashboard crash (UI-01) should be fixed next. |
| 2026-10-27 | Added `FIX_PLAN.md` with five phases, exact changes, verification matrix, and rollback notes. Linked it from the docs index and backlog. | Awaiting go-ahead to start Phase 1. |
| 2026-10-27 | Completed Phase 1: imported `ShieldCheck` (UI-01), replaced LaTeX arrows (UI-02), and made `ScrollToTop` route-aware (UI-04). `npm run lint` has no errors; `npm run build` passes. | Browser smoke test deferred to Phase 5; begin Phase 2 next. |
| 2026-10-27 | Completed Phase 2: installed and imported `tw-animate-css` with a reduced-motion guard (UI-05); bound `VideoPlayer` to a real `<video>` with duration/seek/speed/mute sync, real download, and error/URL fallback (UI-03). Build passes and utilities appear in the CSS bundle. | Manual playback and animation checks deferred to Phase 5; begin Phase 3 next. |
| 2026-10-27 | Design refresh: introduced warm paper/ink tokens and serif display type; rewrote shared primitives and all main screens; fixed dashboard header hidden by chat auto-scroll; added `formatReportName`; completed Phase 3 (UI-06/07/08/09) and Phase 4 cleanup (UI-10/11/12/13/14/16/17). | Remaining: UI-15 launcher offset, DOC-01/DOC-02, and Phase 5 manual matrix. |
| 2026-10-27 | Mobile audit with Selenium device emulation (390 x 844): verified no horizontal overflow on landing/upload/dashboard/ML, fixed the video tab bar and the mobile Print-button display conflict. Lint warnings reduced from ~50 to 7 known notices; build passes. | UI-15 remains; manual playback and keyboard walk-through still pending Phase 5. |
| 2026-10-27 | Implemented low-power FFmpeg video generation and real frontend polling. Verified generation + playback end to end through Selenium; updated captions to use actual narration. | edge-tts returns 403 in this environment, so pyttsx3 is used (slower, still understandable). UI-15/DOC items and Phase 5 remain. |
| 2026-10-27 | Added runtime OpenAI-compatible LLM provider settings with Groq/Gemini/OpenRouter/OpenAI/custom presets, a hidden `/ai-settings` page, masked keys, and API-backed analysis/diet/video narration. Verified backend with a mock provider and UI with Selenium. | Keys are memory-only and disappear on backend restart; this is a local demo control, not authentication. UI-15/DOC/Phase 5 remain. |
| 2026-10-27 | Fixed upload -> Analyze report doing nothing in dev. Root cause: Vite watched backend upload/data writes and reloaded the page, while `uvicorn reload=True` restarted the backend. Vite now ignores backend artifacts and backend reload is opt-in. Verified navigation with Selenium. | Restart Vite and the backend to load the new config; re-paste any runtime API key after restarting. |
| 2026-10-27 | Upgraded edge-tts to 7.3.1, which fixes the 403 handshake, and switched narration to en-US-AvaMultilingualNeural at -4% rate with speech-friendly unit expansion. Verified live synthesis and offline fallback. | Regenerate existing videos to hear the new voice; `TTS_VOICE`, `TTS_RATE`, `TTS_PITCH`, and `TTS_VOLUME` can be overridden. |
| 2026-10-27 | Reworked narration to speak directly to the viewer in second person and added natural Hindi narration with `hi-IN-SwaraNeural`, a language selector in the video modal, Hindi scene copy, Hindi LLM instructions, and Hindi unit expansion. Verified English/Hindi script generation, full Hindi video render, and the UI selector. | Existing videos must be regenerated. Hindi slides remain English while narration/captions/transcript are Hindi. |
| 2026-10-27 | Switched the Hindi option to natural Hinglish: Devanagari Hindi mixed with everyday English words (???????, ??????, ?????? ????, ??????, ?????, ??????????, ????), plus Hinglish-specific built-in copy, TTS expansions, and LLM prompt examples. | Regenerate existing videos. Hindi slides still remain English while the spoken narration and transcript are Hinglish. |
| _yyyy-mm-dd_ | _What changed_ | _Blockers_ |

## 8. Notes

- The frontend intentionally supports a mock mode, so demos can run without FastAPI/Ollama.
- Existing `backend/uploads/`, `backend/data/`, and `backend/media/` contain generated artifacts; keep them out of commits if they include real data.
- Add a new row to the Session Log for every working session, even small ones.
- Design direction: warm paper background, ink text, one green accent, hairline borders, serif display headings, 6 to 8 px radii, and short fades. Avoid gradients, glows, emoji labels, and decorative pills. New screens should use semantic tokens (`paper`, `surface`, `ink`, `muted`, `line`, `accent`, `danger`, `attention`) rather than raw Tailwind colors.
- The `@theme` block remaps legacy `slate`/`blue`/`indigo` scales to warm neutrals and greens, so older markup stays visually consistent; migrate those class names to semantic tokens when touching a file.
- External LLM config lives in `backend/llm_provider.py`; set `LLM_PROVIDER`, `LLM_MODEL`, `LLM_BASE_URL`, and `LLM_API_KEY`, or use `GROQ_API_KEY`/`GEMINI_API_KEY`/`OPENROUTER_API_KEY`/`OPENAI_API_KEY`. The hidden page at `/ai-settings` is the preferred demo path and never stores the key in browser storage or on disk.
- Narration uses edge-tts 7.3.1+ (the 7.2.x WebSocket endpoint returns 403), direct second-person scripts, speech-friendly unit/abbreviation expansion, and a Zira-based offline fallback. English defaults to `en-US-AvaMultilingualNeural`; Hinglish uses `hi-IN-SwaraNeural`.
- Hinglish narration is conversational Hindi in Devanagari with common English words transliterated, not formal or Sanskritized Hindi. Slide labels and questions remain English to avoid font gaps; the spoken narration, captions, and transcript are Hinglish. The modal sends `language: "Hinglish"` and the backend records `narrationLanguage`.
- Dev stability: Vite ignores `backend/**`; `BACKEND_RELOAD=0` is the default. Set `BACKEND_RELOAD=1` only while editing backend code, and expect uploads/video writes to restart the backend when it is on.
- Gemini 2.5 Flash can spend its output budget on thinking and return empty text. `backend/llm_provider.py` sends `reasoning_effort: none` for 2.5 Flash and uses a 2048-token connection test; other providers/models are unchanged.
- Low-power video defaults live in `backend/app.py`: `VIDEO_WIDTH=1920`, `VIDEO_HEIGHT=1080`, `VIDEO_FPS=10`, `VIDEO_CRF=23`, `VIDEO_PRESET=ultrafast`, `PUBLIC_BASE_URL`. Set `VIDEO_HEIGHT=720` and `VIDEO_FPS=8` for the lightest fallback. Rendering requires Pillow plus `ffmpeg`/`ffprobe` on PATH.
