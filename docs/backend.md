# Backend Architecture — SimBrake AI Trainer

## Overview
SimBrake has no backend server. All app logic runs client-side in the browser using the Web Gamepad API.

## Input Layer
- **Source:** Web Gamepad API (`navigator.getGamepads()`)
- **Poll rate:** ~60fps via `requestAnimationFrame`
- **Normalization:** Raw axis values (-1.0 to 1.0) normalized to 0–100 for pressure bars
- **Deadzone:** Configurable small deadzone (default 2%) applied to all axes to filter noise
- **Axis mapping:** User-configured via settings, stored in localStorage
- **Smoothing:** Exponential moving average applied to brake and throttle values

## Error Handling
- Gamepad disconnected: show warning banner
- localStorage unavailable: fall back to in-memory only, show warning