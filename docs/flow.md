# Flow — Input Telemetry

## Main Loop
1. User connects a gamepad → auto-detected
2. `useGamepadInput` polls at ~60fps via `requestAnimationFrame`
3. Raw axis values are normalized (0–100) with deadzone and EMA smoothing
4. Current brake, throttle, and steering values update React state
5. Components re-render: PressureBar, InputTrace, PedalTelemetry, SteeringWheel
6. Loop repeats