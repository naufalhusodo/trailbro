# Tech Stack — SimBrake AI Trainer

## Frontend Framework
- **React** (functional components, hooks)
- **Tailwind CSS** for utility-based styling
- Single page application, no build tool required for development

## Input
- **Web Gamepad API** (`navigator.getGamepads()`)
- Polled via `requestAnimationFrame` loop
- No external library needed

## Rendering
- **HTML5 Canvas** for input trace graph and challenge mode overlay
- **CSS transforms** for steering wheel rotation
- **Tailwind** for pressure bar and pedal telemetry bars

## AI Integration
- **Google Gemini API** (free tier)
- Model: `gemini-1.5-flash` (fast, free tier friendly)
- All Gemini calls are routed through a Vercel serverless function (`/api/gemini`)
- The Gemini API key is stored as a Vercel environment variable — never exposed to the client
- Two call types:
  - Session debrief: unstructured text response
  - Adaptive drill plan: structured JSON response

## State Management
- React `useState` and `useRef` for all app state
- No external state library (Redux, Zustand, etc.)
- Session data accumulated in a `useRef` array to avoid re-render overhead during polling

## Data
- No database
- Session data lives in memory during session
- Performance profile persisted to `localStorage` across sessions
- No API key stored on client side

## Deployment
- **Vercel** (free tier)
- Frontend and serverless proxy function deployed together from one GitHub repository
- Environment variables managed via Vercel dashboard
- Auto-deploys on push to main branch

## No Docker
- No Docker used in development or production
- Local development runs the React app directly via Vite dev server
- Vercel handles all production infrastructure