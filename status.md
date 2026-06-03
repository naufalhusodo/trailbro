# Project Status — SimBrake AI Trainer

## Current Phase
🟡 **Planning / Pre-Development**

## Completed
- [x] Concept definition
- [x] Feature list finalized
- [x] AI feature design (Gemini debrief + adaptive difficulty)
- [x] API key security strategy decided (Vercel serverless proxy)
- [x] Deployment strategy decided (Vercel, no Docker)
- [x] Documentation written (PRD, requirements, tech stack, frontend, backend, flow)

## In Progress
- [ ] Initial React component scaffold
- [ ] Web Gamepad API integration
- [ ] Pressure bar + drill loop

## Backlog

### v1 (MVP)
- [ ] Vercel project setup + GEMINI_API_KEY environment variable
- [ ] `/api/gemini.js` serverless proxy function
- [ ] Input device selector + axis mapping UI
- [ ] Live pressure bar with target zone
- [ ] Drill loop (hold timer, success/fail, auto-advance)
- [ ] Scrolling input trace (Canvas)
- [ ] Steering wheel telemetry
- [ ] Pedal telemetry (brake + throttle bars)
- [ ] Consistency score calculator
- [ ] Session stats panel
- [ ] AI session debrief
- [ ] Adaptive drill difficulty (weighted random + Gemini plan)

### v2
- [ ] Challenge mode (ghost graph overlay + scoring)
- [ ] Multiple ghost graph presets
- [ ] Zone weakness heatmap
- [ ] Performance profile persistence across sessions
- [ ] Lock-to-lock range setting
- [ ] Export session data as JSON

### v3 / Future
- [ ] Brake profile recognition (AI classifies driving style)
- [ ] Ghost driver profiles (AI-generated trace styles)
- [ ] Mobile / controller-only layout
- [ ] Community ghost graph sharing

## Known Limitations
- Web Gamepad API does not support all high-end pedal hardware natively
- Gemini free tier has rate limits — debrief and adaptive calls should be throttled
- No account system — performance profile is device/browser local only
- Vercel free tier has a limit of 100GB bandwidth and 100k serverless function invocations per month

## Deployment
- Platform: Vercel (free tier)
- Repository: GitHub (auto-deploy on push to main)
- Environment variables: managed via Vercel dashboard
- No Docker at any stage

## Last Updated
2026-06-02