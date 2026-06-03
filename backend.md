# Backend Architecture — SimBrake AI Trainer

## Overview
SimBrake has no traditional backend server. All app logic runs client-side in the browser,
with one exception: a lightweight Vercel serverless function that proxies Gemini API calls
to keep the API key secure and off the client.

## Serverless Proxy Function

### Purpose
Prevent the Gemini API key from being exposed in client-side code or network requests.

### Location
`/api/gemini.js` in the project root (Vercel auto-detects and deploys this as a function)

### Implementation
```js
// /api/gemini.js
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Gemini API call failed" });
  }
}
```

### Environment Variable
- Variable name: `GEMINI_API_KEY`
- Set via Vercel dashboard → Project Settings → Environment Variables
- Never committed to the repository
- Never sent to or accessible by the client

### Frontend Call
The frontend calls `/api/gemini` instead of the Gemini API directly:
```js
const response = await fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ contents: [...] })
});
```

## Input Layer
- **Source:** Web Gamepad API (`navigator.getGamepads()`)
- **Poll rate:** ~60fps via `requestAnimationFrame`
- **Normalization:** Raw axis values (-1.0 to 1.0) normalized to 0–100 for pressure bars
- **Deadzone:** Configurable small deadzone (default 2%) applied to all axes to filter noise
- **Axis mapping:** User-configured via settings, stored in localStorage

## Session Data Accumulator
- Implemented as a `useRef` array (does not trigger re-renders)
- Each entry logged per drill attempt:
```json
{
  "drillIndex": 12,
  "targetZone": { "min": 55, "max": 65 },
  "peakPressure": 62,
  "holdDuration": 1.1,
  "success": true,
  "overshoot": 0,
  "approachRate": 45,
  "releaseRate": "gradual",
  "timestamp": 1714200000000
}
```

## Performance Profile
- Maintained in React state, persisted to localStorage
- Updated after each drill attempt
- Structure:
```json
{
  "zones": {
    "0-25":   { "attempts": 0, "successes": 0, "avgOvershoot": 0 },
    "26-50":  { "attempts": 0, "successes": 0, "avgOvershoot": 0 },
    "51-75":  { "attempts": 0, "successes": 0, "avgOvershoot": 0 },
    "76-100": { "attempts": 0, "successes": 0, "avgOvershoot": 0 }
  },
  "totalDrills": 0,
  "totalSuccesses": 0,
  "lastUpdated": ""
}
```

## Drill Generator
- Weighted random selection based on zone success rates
- Algorithm:
  1. Calculate weight for each zone: `weight = 1 - successRate` (weak zones get more reps)
  2. Never-attempted zones get weight 0.6 (medium)
  3. Normalize weights to sum to 1.0
  4. Random pick using weighted distribution
  5. Every 10th drill: fully random (wild card)
- Returns: `{ min: number, max: number }` target zone

## Consistency Score Calculator
- Runs after each drill
- Metric: standard deviation of brake pressure samples taken while user was within target zone
- Lower std dev = higher consistency score
- Mapped to 0–100 scale for display
- Rolling average maintained across session

## Challenge Mode Scorer
- At end of each challenge run, compares user trace array vs ghost trace array
- Both normalized to same length via linear interpolation
- Score = `100 - (meanAbsoluteError * scaleFactor)`
- Clamped to 0–100
- Grade thresholds: S ≥ 92, A ≥ 80, B ≥ 65, C ≥ 50, D < 50

## Gemini API Integration

### Session Debrief Call
- Triggered: manual button or auto after 30+ drills
- Preprocessing: aggregate session data into compact summary object
- Prompt type: conversational coaching instruction
- Expected response: plain text, 3–5 sentences
- Displayed in DebriefCard component

### Adaptive Drill Plan Call
- Triggered: every 20 completed drills
- Input: current performance profile JSON
- Prompt instructs Gemini to return ONLY valid JSON
- Expected response:
```json
{
  "focusZone": "0-25",
  "drillSequence": [12, 18, 8, 22, 15, 10, 20, 17, 9, 14],
  "reasoning": "Driver consistently struggles below 30% pressure."
}
```
- App applies drillSequence as the next 10 target midpoints
- Falls back to weighted random if JSON parse fails

## Error Handling
- Gamepad disconnected: show warning banner, pause drill loop
- Gemini API error: show error message in debrief card, do not crash
- JSON parse failure on adaptive response: silently fall back to weighted random
- localStorage unavailable: fall back to in-memory only, show warning
- Vercel function timeout: treated same as Gemini API error