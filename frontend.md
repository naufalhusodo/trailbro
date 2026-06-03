# Frontend Architecture — SimBrake AI Trainer

## Layout
Single page, dark theme, divided into panels:
┌─────────────────────────────────────────────────────────────┐
│  HEADER: App title, mode selector (Drill / Challenge), Settings │
├───────────────┬──────────────┬──────────────────────────────┤
│  INPUT TRACE  │ PRESSURE BAR │  TELEMETRY PANEL             │
│  (Canvas)     │  (vertical)  │  - Steering Wheel            │
│               │              │  - Brake bar                 │
│               │              │  - Throttle bar              │
├───────────────┴──────────────┴──────────────────────────────┤
│  SESSION STATS: Consistency score, drill count, success rate │
├─────────────────────────────────────────────────────────────┤
│  AI DEBRIEF CARD (appears after session end)                 │
└─────────────────────────────────────────────────────────────┘

## Components

### `<App />`
- Root component
- Owns global state: activeGamepad, axisMapping, sessionData, appMode
- Runs the main requestAnimationFrame polling loop via useRef

### `<Header />`
- App name
- Mode toggle: Drill Mode / Challenge Mode
- Settings button (opens settings modal)

### `<SettingsModal />`
- Gamepad device selector dropdown
- Axis assignment dropdowns (brake, throttle, steering)
- Lock-to-lock range input (number, default 900)
- Gemini API key input (password field)
- Save button (persists to localStorage)

### `<PressureBar />`
- Vertical bar showing current brake pressure (0–100%)
- Target zone band highlighted (yellow/orange)
- Current pressure indicator (white line)
- Hold timer progress indicator (fills green as 1s hold counts down)
- Props: currentPressure, targetZone, holdProgress

### `<InputTrace />`
- HTML5 Canvas element
- Draws last ~300 frames of brake pressure as a scrolling line
- Color: green when within target zone, red otherwise
- Redrawn every frame via useEffect + canvas ref

### `<SteeringWheel />`
- SVG or div-based circular wheel graphic
- Rotates via CSS transform: rotate()
- Rotation mapped from steering axis value × (lockToLock / 2)
- Props: steeringValue, lockToLock

### `<PedalTelemetry />`
- Two vertical bars side by side
- Brake (red) and Throttle (green)
- Live fill height mapped to axis value
- Numeric percentage label

### `<DrillMode />`
- Orchestrates the drill loop
- Manages: currentTarget, holdTimer, drillHistory, adaptiveDrillQueue
- Calls weighted random zone generator
- Triggers Gemini adaptive call every 20 drills

### `<ChallengeMode />`
- Loads a selected ghost graph profile
- Canvas overlay: ghost line (white/gray) + user trace (colored)
- Score calculated at end of run using mean absolute error
- Grade display (S/A/B/C/D) with color coding

### `<SessionStats />`
- Consistency score (rolling standard deviation of pressure at target)
- Total drills, success rate, current streak
- Zone weakness heatmap (small colored grid showing performance per zone)

### `<DebriefCard />`
- Appears after session end or on manual trigger
- Shows AI coaching text from Gemini
- Loading spinner while API call in progress
- Styled as a "coach's notepad" card

## Styling Notes
- Dark background (#0f0f0f or similar)
- Accent colors: red for brake, green for throttle, blue/white for steering
- Monospace font for numbers and telemetry values
- Smooth canvas rendering, no jank — all draw calls in rAF loop