# Frontend Architecture — SimBrake AI Trainer

## Layout
Single page, dark theme, divided into panels:
```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: App title, Settings                                │
├───────────────┬────────────┬───────────────────────────────┤
│  INPUT TRACE  │ PRESSURE BAR│  TELEMETRY PANEL             │
│  (Canvas)     │  (vertical) │  - Steering Wheel            │
│               │             │  - Brake bar                 │
│               │             │  - Throttle bar              │
└───────────────┴────────────┴───────────────────────────────┘
```

## Components

### `<App />`
- Root component
- Owns global state: activeGamepad, axisMapping
- Runs the main requestAnimationFrame polling loop via useRef

### `<Header />`
- App name
- Settings button (opens settings modal)

### `<SettingsModal />`
- Gamepad device selector dropdown
- Axis assignment dropdowns (brake, throttle, steering)
- Lock-to-lock range input (number, default 900)
- Save button (persists to localStorage)

### `<PressureBar />`
- Vertical bar showing current brake pressure (0–100%)
- Current pressure indicator (white line)

### `<InputTrace />`
- HTML5 Canvas element
- Draws last ~300 frames of brake pressure as a scrolling line
- Redrawn every frame via useEffect + canvas ref

### `<SteeringWheel />`
- SVG or div-based circular wheel graphic
- Rotates via CSS transform: rotate()
- Rotation mapped from steering axis value × (lockToLock / 2)

### `<PedalTelemetry />`
- Two vertical bars side by side
- Brake (red) and Throttle (green)
- Live fill height mapped to axis value
- Numeric percentage label

## Styling Notes
- Dark background (#0f0f0f or similar)
- Accent colors: red for brake, green for throttle, blue/white for steering
- Monospace font for numbers and telemetry values
- Smooth canvas rendering, no jank — all draw calls in rAF loop