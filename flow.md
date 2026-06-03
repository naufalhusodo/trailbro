# App Flow — SimBrake AI Trainer

## Startup Flow
1. App loads → check localStorage for saved settings (API key, axis mapping, performance profile)
2. Show settings modal if no gamepad mapping found yet
3. User connects gamepad/pedals → Web Gamepad API fires `gamepadconnected` event
4. App detects available gamepads → populates device dropdown
5. User selects device and assigns axes (brake, throttle, steering) → saves to localStorage
6. User enters Gemini API key → saves to localStorage
7. App enters idle state → telemetry panels show live input

## Drill Mode Flow
START SESSION
│
▼
Generate target zone (weighted random)
│
▼
Display zone on pressure bar
│
▼
Poll brake input at 60fps ──────────────────────────┐
│                                               │
▼                                               │
Is pressure within zone?                             │
YES → start/continue hold timer                   │
NO  → reset hold timer                            │
│                                               │
▼                                               │
Hold timer reaches 1.0s?                            │
YES → DRILL SUCCESS                               │
NO  → Has 5s timeout elapsed?                     │
YES → DRILL FAIL                         │
NO  → continue polling ──────────────────┘
│
▼
Log drill result to session data
Update performance profile
Update consistency score
│
▼
Every 20 drills?
YES → send profile to Gemini → receive drill plan → queue next targets
NO  → generate next target (weighted random or from queue)
│
▼
Loop back to top

## Challenge Mode Flow
SELECT GHOST PROFILE (hairpin / threshold / ABS / etc.)
│
▼
3-second countdown
│
▼
Record user brake trace in real time (overlaid on ghost)
│
▼
Run ends (ghost completes)
│
▼
Score calculated (MAE vs ghost)
Grade assigned (S/A/B/C/D)
│
▼
Show result screen → option to retry or return to drill mode

## Session End Flow
User clicks "End Session" (or 30+ drills completed)
│
▼
Show session summary:

Total drills, success rate
Consistency score
Zone performance heatmap
│
▼
"Get AI Debrief" button
│
▼
Preprocess session data → send to Gemini
│
▼
Show loading spinner
│
▼
Display DebriefCard with coaching feedback
│
▼
Option: Start new session (clears session data, keeps performance profile)


## Settings Flow
- Accessible at any time via header button
- Does not interrupt active session
- Changes take effect immediately on save
- Axis reassignment re-normalizes live input instantly

## Error Flows
- Gamepad disconnected mid-session → pause loop, show reconnect banner → resume on reconnect
- Gemini call fails → show "AI unavailable" message → session continues normally
- No API key set → debrief button shows "Add API key in settings" tooltip