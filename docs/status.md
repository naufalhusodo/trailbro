# Project Status — SimBrake AI Trainer

## Current Phase
🟢 **Telemetry Viewer (Live)**

## Completed
- [x] Concept definition
- [x] React component scaffold
- [x] Web Gamepad API integration
- [x] Pressure bar live display
- [x] Input trace (Canvas scrolling graph)
- [x] Steering wheel telemetry
- [x] Pedal telemetry (brake + throttle)
- [x] Gamepad debug panel
- [x] Input smoothing (EMA)
- [x] Deadzone filtering
- [x] Device selector + axis mapping UI
- [x] Settings persistence (localStorage)

## In Progress
- [ ] None — MVP complete

## Backlog
- [ ] Lock-to-lock range setting
- [ ] Mobile / controller-only layout
- [ ] Export session data as JSON

## Known Limitations
- Web Gamepad API does not support all high-end pedal hardware natively
- No account system — settings are device/browser local only

## Deployment
- Platform: Vercel (free tier)
- Repository: GitHub (auto-deploy on push to main)
- No Docker at any stage

## Last Updated
2026-06-04