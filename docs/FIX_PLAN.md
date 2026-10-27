# Fix Plan - Step by Step

> Companion to [UI_ISSUES.md](./UI_ISSUES.md). Work top-down: each phase is independently shippable and verified before moving on.
> Update statuses here and in `UI_ISSUES.md` as steps complete.

**Created:** 2026-10-27
**Goal:** reach M5 (demo-ready) with no critical issues, no console errors, and a working upload -> dashboard -> video flow.
**Estimated effort:** 1 to 1.5 focused days (about 6 to 9 working hours), excluding full video re-encoding tests.

**Progress:** Phases 1 to 3 DONE (2026-10-27) - UI-01 through UI-09 fixed. Phase 4 is nearly complete: UI-10 through UI-14, UI-16, and UI-17 are done; UI-15 and the DOC items remain. The low-power FFmpeg video pipeline and real frontend polling are complete and verified. **Next:** Phase 4 tail, then Phase 5.

## Guiding rules

1. Fix the demo-blocking bug first; do not start polish while the dashboard crashes.
2. One issue per commit (or one small phase per commit) so a fix can be reverted independently.
3. Keep client-side mock mode working at every step; the app must demo offline.
4. After every phase run `npm run lint` and `npm run build`, then manually smoke-test the affected routes.
5. Do not add new features while fixing. Log new ideas in `PROGRESS.md` backlog instead.

## Prerequisites (Phase 0)

- [ ] Create a working branch, e.g. `fix/ui-stabilization`.
- [x] Capture the baseline: `npm run lint` (warnings only) and `npm run build` (passes) - verified 2026-10-27.
- [ ] Start the dev server: `npm run dev`.
- [ ] Optional backend: `cd backend; pip install -r requirements.txt; uvicorn app:app --reload --port 8000`.
- [ ] Optional Ollama: `ollama serve` and `ollama pull llama3.2`.
- [ ] Open DevTools Console and keep it visible for every manual check.

## Phase 1 - Unblock the demo (Critical/High, ~30 to 45 min)

**Objective:** dashboard renders, ML output text is clean, navigation resets scroll.

### Step 1.1 - UI-01: Import `ShieldCheck`

**Status:** DONE (2026-10-27). Code verified by build; browser smoke deferred to Phase 5.

- **File:** `src/pages/AnalysisDashboardPage.jsx`
- **Change:** add `ShieldCheck` to the `lucide-react` import block (lines 3-20).
- **Verify:**
  - [ ] `/analysis/MR-001` renders all four stat cards.
  - [ ] Console has no `ReferenceError: ShieldCheck is not defined`.
  - [ ] Upload flow reaches the dashboard.

### Step 1.2 - UI-02: Replace literal LaTeX arrows

**Status:** DONE (2026-10-27). No `$\` sequences remain in `src/`; build passes.

- **File:** `src/components/report/MLOutputVisualizer.jsx`
- **Change:**
  - Line 318: replace `$\rightarrow$` with `->` (or `→`).
  - Line 349: replace `$\leftarrow$` with `<-` (or `←`).
- **Verify:**
  - [ ] Diagnostic flow line reads as a normal arrow chain.
  - [ ] Back control reads correctly.
  - [ ] Searching `src/` for `$\` finds no remaining LaTeX sequences.

### Step 1.3 - UI-04: Make scroll reset on route change

**Status:** DONE (2026-10-27). Implemented with `useLocation()` and a `[pathname]` dependency; build passes.

- **File:** `src/App.jsx`
- **Change:** remove the unused `ScrollRestoration` import, then:

```jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
```

- **Verify:**
  - [ ] Scroll down on the dashboard, open another page, and confirm it starts at the top.
  - [ ] `#ml-overview` smooth scroll still works after analysis loading.

## Phase 2 - Visible polish and real video (~2 to 4 h)

**Objective:** entry animations work and the player controls actual generated media.

### Step 2.1 - UI-05: Enable the animation utilities

**Status:** DONE (2026-10-27). `tw-animate-css` installed and imported; utilities confirmed in the built CSS; reduced-motion guard added. Visual entry-animation check deferred to Phase 5.

- **Install:** `npm install -D tw-animate-css`
- **File:** `src/index.css`
- **Change:** add `@import "tw-animate-css";` immediately after `@import "tailwindcss";`.
- **Verify:**
  - [ ] Modal (finding detail) fades/zooms in.
  - [ ] Mobile nav drawer slides in.
  - [ ] Toasts slide up.
  - [ ] Video generator completion block animates.
  - [x] Check `prefers-reduced-motion` does not cause motion (guard added in `src/index.css`).
- **Fallback:** if the plugin conflicts with Tailwind 4, replace the classes with custom keyframes in `index.css` and delete the `animate-in`/`fade-in`/`slide-in-*`/`zoom-in-*` classes.

### Step 2.2 - UI-03: Bind the player to real video

**Status:** DONE (2026-10-27). Real `<video>` bound with event sync, fallback timer, real-URL download, and error fallback. End-to-end playback and generation verified with Selenium on the generated MP4.

- **File:** `src/components/video/VideoPlayer.jsx`
- **Change plan:**
  1. Derive `const videoUrl = videoData?.videoUrl;`.
  2. Render a real `<video>` inside the cinema container when `videoUrl` exists:

```jsx
<video
  ref={videoRef}
  src={videoUrl}
  className="absolute inset-0 h-full w-full object-cover"
  playsInline
  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || videoData?.durationSeconds || 0)}
  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
  onPlay={() => setIsPlaying(true)}
  onPause={() => setIsPlaying(false)}
  onEnded={() => setIsPlaying(false)}
/>
```

  3. Keep the infographic layer as an overlay/fallback. When `videoUrl` exists, hide it or reduce it to captions only.
  4. `togglePlay`: if `videoRef.current` exists call `play()`/`pause()`; otherwise keep the current timer fallback.
  5. `handleSeek` and `jumpToChapter`: set `videoRef.current.currentTime` when the element exists (already partly done).
  6. Add a `useEffect` to sync `duration` when `videoData` changes.
  7. `handleDownload`: when `videoUrl` exists, create an `<a href={videoUrl} download>` and click it; otherwise keep the toast.
  8. Make the timer fallback explicit so sample reports without a URL still work.
- **Verify:**
  - [x] `MR-001` (mock `videoUrl` present) plays real media and seek/speed/pause work.
  - [x] Without a URL, the fallback explainer still runs.
  - [ ] Download starts a file download when a URL exists.
  - [ ] No console errors from media events in mock mode.

## Phase 3 - Correctness, responsive, accessibility (~1.5 to 2 h)

### Step 3.1 - UI-06: Honest ML/Ollama status

**Status:** DONE (2026-10-27). Mock fallback uses the backend shape; the header switches to an amber "Using sample guidance" state with a refresh action when Ollama is unavailable.

- **Files:** `src/services/api.js`, `src/pages/MLDiagnosticPage.jsx`
- **Change:**
  - In `getMLStatus()` mock fallback, return the backend shape:
    `{ status: 'mock', ollama: { available: false, has_model: false, model_name: 'llama3.2' }, models: { cbc: true, lft: true, kft: true } }`.
  - In `MLDiagnosticPage`, derive `const isOllamaOnline = !!mlSystemStatus?.ollama?.available;`.
  - Switch the icon, dot color, and text between "Connected to local Ollama" and "Ollama offline - rule-based fallback" (amber/rose).
  - Add a small "Refresh" action that re-calls `getMLStatus()`.
- **Verify:**
  - [ ] Backend up + Ollama up shows connected/green.
  - [ ] Backend up + Ollama down shows offline/amber.
  - [ ] Backend down (mock) shows offline, not "Active & Ready".

### Step 3.2 - UI-07: Responsive toast container

**Status:** DONE (2026-10-27). Container insets on mobile and returns to bottom-right at `sm`; `removeToast` initialization order fixed.

- **File:** `src/context/ToastContext.jsx:30`
- **Change:** `fixed bottom-5 left-4 right-4 z-50 flex flex-col gap-2.5 sm:left-auto sm:right-5 sm:w-full sm:max-w-sm`.
- **Verify:**
  - [ ] At 320 px and 375 px, toasts are fully visible.
  - [ ] At >= 640 px, toasts stay bottom-right.
  - [ ] Toasts do not cover the chat launcher action.

### Step 3.3 - UI-08: Transcript typography

**Status:** DONE (2026-10-27). Chose not to add `@tailwindcss/typography`; the transcript now uses explicit bordered-paper/mono styles in `VideoPlayer.jsx`.

- **Install:** not needed
- **File:** `src/components/video/VideoPlayer.jsx`
- **Change:** remove `prose prose-slate max-w-none` and hand-style the transcript container.
- **Verify:**
  - [x] Transcript view has readable type scale and spacing.
  - [x] Build passes with the plugin registered.

### Step 3.4 - UI-09: Modal focus management

**Status:** DONE (2026-10-27). Unique title id, initial focus, Tab wrap, Escape close, focus restore, and body-overflow cleanup implemented.

- **File:** `src/components/common/Modal.jsx`
- **Change plan:**
  1. `const titleId = useId();` and use `aria-labelledby={titleId}` / `id={titleId}`.
  2. On open, store `document.activeElement`, focus the dialog (or close button), and restore focus on close.
  3. Trap Tab/Shift+Tab within the modal by collecting focusable elements and wrapping at the ends.
  4. Keep `Escape` close behavior.
- **Verify:**
  - [ ] Tab cycles inside the open modal only.
  - [ ] Closing returns focus to the triggering button.
  - [ ] Two modals mounted at once do not share ids.

## Phase 4 - Cleanup and docs (~1 h)

### Step 4.1 - Low-severity fixes

**Status:** MOSTLY DONE (2026-10-27). UI-10 through UI-14, UI-16, and UI-17 are complete; UI-15 remains.

- [x] UI-10: remove or implement `link.isAi` in `Navbar.jsx` (removed in the rewrite).
- [x] UI-11: add `aria-label="Dismiss upload error"` in `FileUploader.jsx`.
- [x] UI-12: add `aria-label="Copy dashboard link"` in `AnalysisDashboardPage.jsx`; success feedback via toast.
- [x] UI-13: delete unused `src/App.css`.
- [x] UI-14: normalize status strings in `LlamaAdvisorCard.jsx` and `MLOutputVisualizer.jsx`.
- [ ] UI-15: add bottom padding on the dashboard for the fixed chat launcher and offset it from toasts; verify at 320 px and 1440 px.
- [x] UI-16: fix `MLDiagnosticPage.jsx` to `String(mlOutput?.status || '')`.
- [x] UI-17: remove unused imports/vars; lint warnings dropped from ~50 to 7 known notices.

### Step 4.2 - Documentation

- [ ] DOC-01: replace the default Vite `README.md` with a real project README: overview, stack, setup (frontend/backend/ML/Ollama), demo walkthrough, and troubleshooting.
- [ ] DOC-02: add `docs/DEMO_CHECKLIST.md` with pre-demo checks and the 5-minute demo script.
- [x] Update `docs/PROGRESS.md` milestone checkboxes and session log.

## Phase 5 - Regression and demo readiness (~45 min)

- [ ] `npm run lint` - no errors; documented warnings only.
- [ ] `npm run build` - passes; note the bundle-size warning and optionally add code-splitting with `React.lazy` for the ML/video pages.
- [ ] Manual matrix below passes.
- [ ] Verify disclaimers on Upload, Dashboard, Finding Detail, Video, and About/Privacy.
- [ ] Verify high-risk escalation banners appear for `MR-001` and the ML high-risk presets.
- [ ] Run the 5-minute demo script end to end with the backend stopped (mock mode) and again with the backend running.
- [ ] Mark M5 complete in `PROGRESS.md`.

## Manual test matrix

| Route | Checks |
| --- | --- |
| `/` | Hero renders, CTAs navigate, no console errors |
| `/upload` | Drag/drop, validation errors, sample buttons, upload progress |
| `/analysis-loading/MR-001` | Steps advance, redirect to dashboard `#ml-overview` |
| `/analysis/MR-001` | Stat cards, summary, advisor, diet chat, filters, finding modal |
| `/analysis/MR-002` | Different findings and important severity render |
| `/finding/MR-001/f-01` | Detail sections and copy questions |
| `/video/MR-001` | Playback, seek, chapters, captions, transcript, download |
| `/history` | Search, status filter, sort, links |
| `/ml-diagnostic` | Presets, run pipeline, visual/JSON toggle, status indicator |
| `/about`, `/privacy`, `/404` | Content renders, links work |

## Dependencies and order

```
Phase 1 (1.1 -> 1.2 -> 1.3)  must finish first
        |
        v
Phase 2 (2.1 animations, 2.2 real video)  2.1 and 2.2 are independent
        |
        v
Phase 3 (3.1, 3.2, 3.3, 3.4)  independent of each other
        |
        v
Phase 4 (4.1 cleanup -> 4.2 docs)
        |
        v
Phase 5 (regression + demo)
```

## Effort estimate

| Phase | Items | Estimate |
| --- | --- | --- |
| 0 | Baseline | 10 min |
| 1 | UI-01, UI-02, UI-04 | 30 to 45 min |
| 2 | UI-05, UI-03 | 2 to 4 h |
| 3 | UI-06, UI-07, UI-08, UI-09 | 1.5 to 2 h |
| 4 | UI-10 to UI-17, DOC-01/02 | 1 h |
| 5 | Regression + demo | 45 min |

## Rollback notes

- Each phase is one commit; revert the phase commit if verification fails.
- UI-03 keeps the timer fallback, so reverting the `<video>` addition leaves a working (simulated) player.
- UI-05 and UI-08 add build-time dependencies; if they break the build, uninstall them and revert the `index.css` imports before continuing.
- UI-01 is a one-line change; no data migration or API change involved.

## Definition of done

- [ ] Zero Critical/High issues open in `UI_ISSUES.md`.
- [ ] `npm run build` passes and the app has no runtime console errors on the main routes.
- [ ] Upload -> loading -> dashboard -> video works in mock mode and with the backend.
- [ ] Status indicators reflect reality (no false "online" claims).
- [ ] Keyboard-only users can use modals and the mobile menu.
- [ ] `PROGRESS.md` and `UI_ISSUES.md` reflect the final state.
