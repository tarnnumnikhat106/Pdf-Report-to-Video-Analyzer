# Project Goals & Scope

> Stable document. Change it only when the product direction, scope, or milestones change.
> For day-to-day status see [PROGRESS.md](./PROGRESS.md).

## 1. Vision

Help patients understand complex medical laboratory reports through plain-language explanations, transparent visualizations, and educational video summaries, while keeping a clear boundary that the system is decision support and not a diagnosis.

## 2. Primary goals

| ID | Goal | Success looks like |
| --- | --- | --- |
| G1 | **Report ingestion** | User can upload PDF/JPG/PNG up to 15 MB, validated client and server side, with graceful mock fallback when the backend is offline. |
| G2 | **Reliable analysis dashboard** | Every uploaded/sample report opens a dashboard that shows findings, reference ranges, severity, and plain-language explanations without crashes. |
| G3 | **Transparent ML layer** | CBC/LFT/KFT models produce a visible classification (prediction, confidence, features) that a non-technical user can read as visual cards or raw JSON. |
| G4 | **Educational video explanation** | A chaptered, narrated video is generated and playable; the player supports seek, chapters, captions, speed, and transcript. |
| G5 | **Clinical safety & privacy** | Disclaimers are visible on every relevant screen; no PHI is stored in browser storage; high-risk results escalate to a doctor-consultation prompt. |
| G6 | **Maintainable demo** | Clean build, no console errors, documented progress, and a demo path that works end-to-end offline via mock data. |

## 3. Scope

### In scope

- Multi-page React app (landing, upload, loading, dashboard, finding detail, video, history, ML diagnostic lab, about, privacy, 404).
- FastAPI backend with report upload/analyze/fetch, video generation, ML prediction, and diet-chat endpoints.
- Three scikit-learn models: CBC, LFT, KFT.
- Llama 3.2 via Ollama with rule-based fallback, plus optional external OpenAI-compatible API providers for analysis, diet chat, and video narration.
- Video generation (static slides + TTS + FFmpeg) with chapter metadata and captions.
- Client-side mock mode so the UI is demoable without any backend.

### Out of scope (for now)

- Real clinical diagnosis or treatment recommendations.
- Storing real patient records or long-term PHI.
- Authentication, multi-user accounts, or billing.
- HIPAA/GDPR/SOC2 certification claims.
- Mobile native apps.

## 4. Milestones

| ID | Milestone | Exit criteria | Status |
| --- | --- | --- | --- |
| M0 | Project scaffolding | Vite + React + Tailwind running, routing and layout in place | DONE |
| M1 | Frontend demo shell | All pages/components implemented, mock API works | DONE |
| M2 | Backend integration | FastAPI endpoints reachable, upload/analyze/fetch wired to frontend | DONE |
| M3 | ML + Llama pipeline | CBC/LFT/KFT models loaded, JSON output fed to Llama or an external API with fallback | DONE |
| M4 | Video pipeline | Generated MP4 with narration and chapters served and playable | DONE |
| M5 | Stabilization & demo readiness | Critical UI issues fixed, build/lint clean, end-to-end demo script verified | IN PROGRESS |

## 5. Success criteria (demo-ready definition)

- [ ] `npm run build` passes with no errors.
- [ ] Dashboard and video pages render without runtime errors for all sample reports.
- [ ] Upload -> loading -> dashboard -> video flow completes offline (mock mode).
- [ ] No critical issues open in [UI_ISSUES.md](./UI_ISSUES.md).
- [ ] Disclaimers present on upload, dashboard, finding detail, and video pages.
- [ ] README explains setup for frontend, backend, ML, and Ollama.

## 6. Risks & assumptions

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Local Ollama not running | Diet/advice falls back to rules | Fallback service already returns clinical rules; show model source in UI |
| Real PDF OCR quality varies | Incorrect extracted values | Keep sample reports for demos; show extraction confidence |
| Video rendering is slow or heavy | Demo delay/failure | Low-power static-slide/FFmpeg pipeline; pre-generate sample video; show live status |
| Missing Tailwind plugins | Silent style regressions | Audit utility classes (see UI_ISSUES) |
| External provider outage, quota, or model rename | Analysis/video narration falls back or fails | Validate the key with a test call, keep the model editable, and fall back to Ollama/rules |
| Shared demo browser exposes the key | Session key can be replaced or cleared by another user | Keep keys in backend memory, mask them, use `LLM_*` env for trusted deployments, and label `/ai-settings` as a local demo control |
| No automated tests | Regressions go unnoticed | Add smoke tests and a pre-demo checklist |

## 7. Decision log

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-10-27 | Document goals/progress in `docs/` instead of a single README | Keeps status and scope separate and easy to maintain |
| 2026-10-27 | Treat client-side mock mode as a supported demo path | Enables offline demos and frontend work without the backend |
| 2026-10-27 | Add optional OpenAI-compatible API providers with runtime-only keys | Lets the demo use a free Groq/Gemini key without installing Ollama, while preserving the local fallback path |
