# Requirements — SimBrake AI Trainer

## Functional Requirements

### Input System
- Read hardware input via the Web Gamepad API
- Support gamepad buttons and analog axes (triggers, joysticks)
- Dropdown to select active input device
- Dropdown to select brake axis, throttle axis, and steering axis (left/right joystick or wheel)
- Lock-to-lock range setting for steering wheel (default 900°, adjustable)
- Input polling at ~60fps via requestAnimationFrame

### Drill Mode
- Vertical pressure bar (0–100%)
- Randomly generated target zone (a band on the bar) per drill
- User must hold brake pressure within the target zone for 1 continuous second to succeed
- Visual indicator shows current pressure and target zone
- Loop automatically advances to next drill on success or timeout (5 seconds)
- Consistency score calculated and displayed after each drill
- Rolling consistency score shown across the session

### Input Trace
- Scrolling line graph to the left of the pressure bar
- Displays last ~5 seconds of brake pressure history
- Updates in real time at 60fps
- Color coded: green when in target zone, red when outside

### Steering Telemetry
- Circular steering wheel graphic
- Rotates 1:1 with steering axis input
- Respects lock-to-lock range setting
- Displayed as a panel separate from brake trace

### Pedal Telemetry
- Two vertical bars: brake and throttle
- Displays live axis values in real time
- Labeled and color coded (red for brake, green for throttle)

### Challenge Mode
- Predefined target brake graph shown as a ghost line
- User attempts to match the graph in real time
- Overlay of user trace vs ghost line
- Score calculated as percentage similarity (0–100%)
- Letter grade awarded: S / A / B / C / D
- Multiple preset graph profiles (hairpin trail brake, threshold stop, ABS simulation, etc.)

### AI Coaching Debrief
- Triggered at end of session (manual button or auto after N drills)
- App preprocesses session data into structured summary JSON
- Summary sent to Gemini API with a coaching system prompt
- Response displayed as a styled debrief card
- Specific feedback on: pressure consistency, overshoot, release pattern, zone weaknesses

### Adaptive Difficulty
- App tracks success rate and overshoot per pressure zone
- Weighted random drill generator biases toward weak zones
- Every 20 drills, performance profile sent to Gemini API
- Gemini returns a JSON drill sequence plan for the next block
- App applies the plan to the next 10 drills

## Non-Functional Requirements
- Runs entirely in the browser — no server required
- Gemini API key entered by user in settings panel (stored in localStorage)
- Responsive layout for 1080p and above
- No dependencies on simracing game APIs or plugins
- Input latency under 16ms (one frame at 60fps)