# TrailBro

Sim racing pedal telemetry viewer using Web Gamepad API.

## Commands

```bash
npm run dev      # Vite dev server
npm run build    # Production build → dist/
npm run preview  # Preview production build
npm run deploy   # Build + push dist/ to gh-pages branch
```

No test, lint, typecheck, or format commands exist. No CI.

## Architecture

- **Single-page React 18 app** (no router). Entry: `src/main.jsx` → `App`
- **Vite 6** with base path `/trailbro/` (for GitHub Pages). `vercel.json` present but unused — deploy is via `gh-pages -d dist`
- **Tailwind CSS 3** with custom colors `brake` (red-500), `throttle` (green-500), `steering` (blue-500). Font "Michroma" loaded from Google Fonts in `index.html`
- **No TypeScript, no ESLint, no Prettier** — plain JSX with `PropTypes`

## Module conventions

Barrel exports at `src/components/index.js`, `src/hooks/index.js`, `src/utils/index.js`. Import from the barrel, not individual files.

## Input pipeline

- `useGamepadInput` hook in `App.jsx` polls via `requestAnimationFrame` (~60fps)
- Two input modes: `'gamepad'` reads brake/throttle from `gamepad.buttons[]`; `'wheel'` reads from `gamepad.axes[]`
- Normalization: `normalizeButton` (0–100), `normalizeTrigger` (0–100 via (-1..1)→(0..100) mapping)
- Deadzone: default 2% (`applyDeadzone`)
- Smoothing: EMA with factor 0.6 (`smoothInput`)
- Steering axis reported as raw -1..1 value
- Raw data available via `rawDataRef` (used by `GamepadDebug`)

## Settings persistence

Key `simbrake-settings` in `localStorage`. Default axis mapping: `{brake: 6, throttle: 7, steering: 0}`, lock-to-lock 420°, `inputMode: 'gamepad'`.

## Notable

- `index.html` loads Google Fonts "Michroma" via `<link>`
- No backend — fully client-side
- `dist/`, `node_modules/`, `.env`, `.vercel` in `.gitignore`
