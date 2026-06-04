# Requirements — TrailBro

## Functional
- [x] Read gamepad input via Web Gamepad API
- [x] Display live brake pressure as vertical bar
- [x] Display live throttle as vertical bar
- [x] Canvas-based scrolling trace of brake and throttle history
- [x] Steering wheel visualization with rotation
- [x] Device selector for gamepad
- [x] Configurable axis mapping (brake, throttle, steering axes)
- [x] Lock-to-lock steering range setting
- [x] Deadzone filtering (default 2%)
- [x] Input smoothing (exponential moving average)
- [x] Settings persistence via localStorage
- [x] Gamepad debug panel (raw axis/button values)
- [x] Auto-detect and select first gamepad on connect

## Non-Functional
- [x] Dark theme (#0f0f0f background)
- [x] ~60fps polling via requestAnimationFrame
- [x] No backend server — fully client-side
- [x] Monospace font for telemetry values