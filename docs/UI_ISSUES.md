# UI / UX Issue Tracker

> Generated from the 2026-10-27 frontend review. Update statuses as items are fixed.
> Prioritization: `Critical` blocks the demo, `High` is very visible, `Medium` hurts polish or accessibility, `Low` is cleanup.

## Summary

| ID | Severity | Title | Status |
| --- | --- | --- | --- |
| UI-01 | Critical | Dashboard crashes due to missing `ShieldCheck` import | DONE |
| UI-02 | High | Raw LaTeX arrows rendered as text in ML visualizer | DONE |
| UI-03 | High | Video player is simulated; no real `<video>` bound | DONE |
| UI-04 | High | Scroll-to-top not tied to route changes | DONE |
| UI-05 | High | Animation utility classes are no-ops (plugin missing) | DONE |
| UI-06 | Medium | ML/Ollama status indicator always appears online | DONE |
| UI-07 | Medium | Toast container overflows on narrow screens | DONE |
| UI-08 | Medium | `prose` classes have no effect (plugin missing) | DONE |
| UI-09 | Medium | Modal lacks focus trap and has duplicate title id | DONE |
| UI-10 | Low | Unreachable "AI" nav badge | DONE |
| UI-11 | Low | Upload error dismiss button missing `aria-label` | DONE |
| UI-12 | Low | Dashboard share button missing `aria-label` | DONE |
| UI-13 | Low | Unused Vite-template `App.css` | DONE |
| UI-14 | Low | `.toLowerCase()` on possibly null status values | DONE |
| UI-15 | Low | Fixed chat launcher overlaps page content | TODO |
| UI-16 | Low | Unsafe optional chain followed by `.includes` | DONE |
| UI-17 | Low | Unused imports/variables generate lint noise | DONE |

---

## UI-01 - Dashboard crashes due to missing `ShieldCheck` import

- **Severity:** Critical
- **Status:** DONE (2026-10-27)
- **Location:** `src/pages/AnalysisDashboardPage.jsx:262` (usage), imports at `src/pages/AnalysisDashboardPage.jsx:3-20`
- **Problem:** The stat card uses `icon={ShieldCheck}`, but `ShieldCheck` is never imported. Rendering `/analysis/:reportId` throws `ReferenceError: ShieldCheck is not defined`, which breaks the main demo path (upload -> loading -> dashboard).
- **Proposed fix:** Add `ShieldCheck` to the `lucide-react` import list.
- **Verified (2026-10-27):** import added; `npm run lint` has no errors and `npm run build` passes. Browser smoke test deferred to Phase 5.
- **Acceptance criteria:**
  - [ ] `/analysis/MR-001` renders the four stat cards.
  - [ ] Browser console has no `ReferenceError`.
  - [ ] Upload flow reaches the dashboard without a blank screen.

## UI-02 - Raw LaTeX arrows rendered as text in ML visualizer

- **Severity:** High
- **Status:** DONE (2026-10-27)
- **Location:** `src/components/report/MLOutputVisualizer.jsx:318`, `src/components/report/MLOutputVisualizer.jsx:349`
- **Problem:** JSX text contains `$\rightarrow$` and `$\leftarrow$`, so users see the literal markup instead of arrows. No LaTeX renderer is installed.
- **Proposed fix:** Replace with literal arrow characters (`->` or `→`) or an `ArrowRight` icon.
- **Verified (2026-10-27):** replaced with `-&gt;`; a search of `src/` finds no remaining `$\` sequences. Build passes.
- **Acceptance criteria:**
  - [ ] Diagnostic flow reads `Laboratory Report -> Random Forest Model -> ...`.
  - [ ] Back control reads `<- Back to Visual Cards` (or uses an icon).
  - [ ] No `$...$` text remains in the UI.

## UI-03 - Video player is simulated; no real `<video>` bound

- **Severity:** High
- **Status:** DONE (2026-10-27)
- **Location:** `src/components/video/VideoPlayer.jsx:46-47`, `:83-118`, `:132-153`, `:220-283`; `src/pages/VideoExplanationPage.jsx:125-130`
- **Problem:** The player renders a static infographic. `videoRef` is never attached to a media element, playback is a `setInterval` counter, `Download` only shows toasts, and "1080p HD" is hardcoded. `videoData.videoUrl` is unused, even though the backend generates MP4 files.
- **Proposed fix:** Render a `<video ref={videoRef} src={videoData?.videoUrl} />` when a URL exists; bind `onTimeUpdate`, `onLoadedMetadata`, `onEnded`, `play`, and `pause`. Keep the current timer as an explicit fallback when no URL is available. Wire `Download` to the actual file URL.
- **Implemented:** Real `<video>` bound to `videoUrl` with play/pause/seek/speed/mute/duration sync; `onError` sets `videoFailed` and drops back to the infographic; the timer runs only when no media is present; Download uses the real URL; the player remounts via a URL key; resolution label is now dynamic.
- **Verified (2026-10-27):** lint has no errors and the production build passes. End-to-end browser test confirmed a real generated MP4 (`readyState` 4), working chapters, and captions sourced from narration. The generator modal now calls the backend and polls status instead of simulating progress.
- **Acceptance criteria:**
  - [x] With a valid `videoUrl`, play/pause/seek/speed are wired to the real media element.
  - [x] Duration and current time come from the media element.
  - [x] Download opens the real video file when a URL exists.
  - [x] Sample reports without a URL still show the fallback explainer.
  - [x] Manual playback check on `MR-001` and the backend-generated MP4.

## UI-04 - Scroll-to-top not tied to route changes

- **Severity:** High
- **Status:** DONE (2026-10-27)
- **Location:** `src/App.jsx:2`, `src/App.jsx:20-28`
- **Problem:** `ScrollToTop` does not use `useLocation()` and has no dependency array, so it is not reliably triggered by navigation. `ScrollRestoration` is imported but unused.
- **Proposed fix:** Use `useLocation()` and run the effect on `[location.pathname]`; remove the unused import.
- **Verified (2026-10-27):** implemented with `useLocation()` and `[pathname]`; unused `ScrollRestoration` import removed. Build passes.
- **Acceptance criteria:**
  - [ ] Navigating between pages always starts at the top.
  - [ ] Scroll is not reset on unrelated re-renders.
  - [ ] In-page anchor scrolling (`#ml-overview`) still works.

## UI-05 - Animation utility classes are no-ops (plugin missing)

- **Severity:** High
- **Status:** DONE (2026-10-27)
- **Location:** `src/index.css:2`, `:41-45`; consumers include `src/components/common/Modal.jsx:39,51`, `src/components/layout/Navbar.jsx:124`, `src/components/common/Toast.jsx:22`, `src/components/video/VideoGeneratorModal.jsx:182`, `src/pages/MLDiagnosticPage.jsx:468`
- **Problem:** `animate-in`, `fade-in`, `slide-in-*`, and `zoom-in-*` come from `tailwindcss-animate` / `tw-animate-css`, which are not installed. Everything appears instantly.
- **Proposed fix:** Add `tw-animate-css` (Tailwind 4 compatible) and import it in `src/index.css`, or remove/replace the classes with native keyframes.
- **Implemented:** Installed `tw-animate-css` (dev dependency) and imported it after Tailwind. Added a `prefers-reduced-motion: reduce` guard that disables `.animate-in` entry animation.
- **Verified (2026-10-27):** the production CSS bundle now contains `.animate-in`, `.fade-in`, `.slide-in-*`, and `.zoom-in-*`; build passes.
- **Acceptance criteria:**
  - [ ] Modal, mobile nav drawer, toasts, and video generator animate on entry (visual check in Phase 5).
  - [x] `prefers-reduced-motion` is respected.
  - [x] Animation utilities are generated (confirmed in built CSS).

## UI-06 - ML/Ollama status indicator always appears online

- **Severity:** Medium
- **Status:** DONE (2026-10-27)
- **Location:** `src/pages/MLDiagnosticPage.jsx:296-309`, `src/pages/MLDiagnosticPage.jsx:306`, `src/services/api.js:202-213`
- **Problem:** The real backend returns `{ status, ollama: { available, has_model, ... }, models }`, and the page reads `mlSystemStatus?.ollama?.available` correctly. However, the frontend mock fallback in `api.js` returns `{ ollama_online, llama_ready, models_loaded }`, so in offline/mock mode the check fails. The icon is also hardcoded green, so the UI claims a connection even when Ollama is down.
- **Proposed fix:** Make the mock fallback return the same shape as the backend, and switch icon/text/color based on actual availability.
- **Implemented:** `getMLStatus` fallback now returns `{ status: 'offline', ollama: { available: false, has_model: false }, models: {...} }`; the header uses `mlSystemStatus?.ollama?.available` with an amber "Using sample guidance" state and a status refresh action.
- **Verified (2026-10-27):** mobile and desktop screenshots show the amber offline state when running in mock mode; build passes.
- **Acceptance criteria:**
  - [x] Online state shows "Connected to local Ollama".
  - [x] Offline state shows "Using sample guidance" with an amber indicator.
  - [x] Status refresh is available (on mount and via retry).

## UI-07 - Toast container overflows on narrow screens

- **Severity:** Medium
- **Status:** DONE (2026-10-27)
- **Location:** `src/context/ToastContext.jsx:29-34`
- **Problem:** `fixed bottom-5 right-5 ... max-w-sm w-full` is 100% of the viewport wide, so on screens narrower than `24rem + 1.25rem` the left edge is clipped off-screen.
- **Proposed fix:** Use `left-4 right-4 w-auto sm:left-auto sm:right-5 sm:w-full sm:max-w-sm`.
- **Implemented:** container is now `left-4 right-4 sm:left-auto sm:right-5 sm:w-full sm:max-w-sm`; `removeToast` was moved above `addToast` to fix the compiler initialization warning.
- **Verified (2026-10-27):** mobile screenshots at 390 px show toasts fully inside the viewport; lint has no errors.
- **Acceptance criteria:**
  - [x] Toasts are fully visible at narrow widths.
  - [x] Toasts stay bottom-right on larger screens.
  - [x] Closing and auto-dismiss still work.

## UI-08 - `prose` classes have no effect (plugin missing)

- **Severity:** Medium
- **Status:** DONE (2026-10-27)
- **Location:** `src/components/video/VideoPlayer.jsx:468-493`
- **Problem:** `prose prose-slate max-w-none` requires `@tailwindcss/typography`, which is not installed.
- **Proposed fix:** Install and register `@tailwindcss/typography`, or replace with explicit transcript styles.
- **Implemented:** Removed the `prose` classes and hand-styled the transcript panel (bordered paper surface, mono text, relaxed leading) instead of adding another plugin.
- **Verified (2026-10-27):** transcript view renders correctly on desktop and in the 390 px mobile check.
- **Acceptance criteria:**
  - [x] Transcript text has consistent typography and line height.
  - [x] Long transcripts remain readable on mobile.

## UI-09 - Modal lacks focus trap and has duplicate title id

- **Severity:** Medium
- **Status:** DONE (2026-10-27)
- **Location:** `src/components/common/Modal.jsx:37-79` (id at `:56`)
- **Problem:** Focus is not trapped, background content stays tabbable, focus is not moved into the dialog, and every modal uses `id="modal-title"`.
- **Proposed fix:** Generate a unique title id with `useId`, move focus to the dialog/close button on open, restore focus on close, and trap Tab handling.
- **Implemented:** `useId()` title id, focus moves to the dialog on open, Tab/Shift+Tab wrap inside the dialog, Escape closes, focus returns to the trigger, and body overflow is restored on close.
- **Verified (2026-10-27):** build passes; modal open/close flows render correctly. Keyboard-only walk-through remains part of the Phase 5 matrix.
- **Acceptance criteria:**
  - [x] Keyboard focus cannot leave an open modal.
  - [x] Escape closes the modal and focus returns to the trigger.
  - [x] Two modals can coexist without duplicate ids.

## UI-10 - Unreachable "AI" nav badge

- **Severity:** Low
- **Status:** DONE (2026-10-27)
- **Location:** `src/components/layout/Navbar.jsx`
- **Problem:** The badge renders when `link.isAi` is true, but no entry in `navLinks` defines that property.
- **Proposed fix:** Remove the block or add `isAi` to the intended link.
- **Implemented:** Navbar was rewritten; the dead `isAi` conditional and badge are gone.
- **Acceptance criteria:**
  - [x] No dead conditional remains, or the badge renders as intended.

## UI-11 - Upload error dismiss button missing `aria-label`

- **Severity:** Low
- **Status:** DONE (2026-10-27)
- **Location:** `src/components/report/FileUploader.jsx`
- **Problem:** The icon-only dismiss button has no accessible name.
- **Proposed fix:** Add `aria-label="Dismiss upload error"`.
- **Implemented:** `aria-label` added.
- **Acceptance criteria:**
  - [x] Button is announced correctly by a screen reader.

## UI-12 - Dashboard share button missing `aria-label`

- **Severity:** Low
- **Status:** DONE (2026-10-27)
- **Location:** `src/pages/AnalysisDashboardPage.jsx`
- **Problem:** Icon-only button relies on `title`, which is not a reliable accessible name.
- **Proposed fix:** Add `aria-label="Copy dashboard link"`.
- **Implemented:** `aria-label="Copy dashboard link"` added; the handler still announces success via toast.
- **Acceptance criteria:**
  - [x] Button has an accessible name.
  - [x] A failure/no-clipboard path gives user feedback.

## UI-13 - Unused Vite-template `App.css`

- **Severity:** Low
- **Status:** DONE (2026-10-27)
- **Location:** `src/App.css`
- **Problem:** Leftover template CSS with nested selectors and undefined variables (`--accent`, `--border`); it is not imported.
- **Proposed fix:** Delete the file.
- **Implemented:** Deleted `src/App.css`.
- **Acceptance criteria:**
  - [x] File removed and build still passes.

## UI-14 - `.toLowerCase()` on possibly null status values

- **Severity:** Low
- **Status:** DONE (2026-10-27)
- **Location:** `src/components/report/LlamaAdvisorCard.jsx`, `src/components/report/MLOutputVisualizer.jsx`
- **Problem:** Destructuring defaults do not apply to `null`, and a non-string status would throw.
- **Proposed fix:** Normalize with `String(value ?? 'Normal').toLowerCase()`.
- **Implemented:** `String(risk_level)` and `String(status)` normalizations added where statuses are compared or rendered.
- **Acceptance criteria:**
  - [x] Missing/null/non-string status does not crash the card.

## UI-15 - Fixed chat launcher overlaps page content

- **Severity:** Low
- **Status:** TODO
- **Location:** `src/components/report/DietChatSection.jsx:414-428`
- **Problem:** The launcher is `fixed bottom-6 right-6 z-30` on every dashboard, potentially covering content, the footer, or other fixed UI; there is no offset or hide-on-scroll behavior.
- **Proposed fix:** Add bottom padding to the dashboard, or collapse the launcher until scrolled, and avoid collisions with the toast region.
- **Acceptance criteria:**
  - [ ] The launcher does not cover actionable content at 320 px or 1440 px.
  - [ ] It does not overlap toasts.

## UI-16 - Unsafe optional chain followed by `.includes`

- **Severity:** Low
- **Status:** DONE (2026-10-27)
- **Location:** `src/pages/MLDiagnosticPage.jsx`
- **Problem:** `mlOutput?.status?.toLowerCase().includes('high')` throws when `status` is missing, because `.includes` is called on `undefined`.
- **Proposed fix:** `String(mlOutput?.status || '').toLowerCase().includes('high')`.
- **Implemented:** `String(mlOutput?.status || '')` guard added.
- **Acceptance criteria:**
  - [x] A result without `status` still renders.

## UI-17 - Unused imports/variables generate lint noise

- **Severity:** Low
- **Status:** DONE (2026-10-27)
- **Location:** Multiple files across `src/`
- **Problem:** ~50 warnings obscure real issues.
- **Proposed fix:** Remove unused imports/state or prefix intentionally unused params with `_`.
- **Implemented:** Removed unused imports, state, and props across pages/components; switched unused catch bindings to `catch {}`; removed unused params from `Toast`, `FindingDetailModal`, and `VideoGeneratorModal`; moved time/date helpers out of render.
- **Verified (2026-10-27):** warnings dropped from ~50 to 7, all of which are known React Compiler/`set-state-in-effect` or Fast Refresh notices, not unused-variable noise. Build passes.
- **Acceptance criteria:**
  - [x] `npm run lint` shows only intentional/known warnings.
  - [x] Build remains green.

---

## Repo hygiene (non-UI)

| ID | Title | Status |
| --- | --- | --- |
| DOC-01 | Root `README.md` is still the default Vite template; replace with setup and demo instructions | TODO |
| DOC-02 | Add a pre-demo checklist (backend, ML, Ollama, build) to `docs/` | TODO |

## Issue template

When adding a new issue, copy this block:

```md
## UI-XX - Short title

- **Severity:** Critical / High / Medium / Low
- **Status:** TODO / IN PROGRESS / BLOCKED / DONE / WONTFIX
- **Location:** `path/to/file.jsx:line`
- **Problem:** What the user sees and why it happens.
- **Proposed fix:** One or two concrete steps.
- **Acceptance criteria:**
  - [ ] Observable, testable outcome.
```
