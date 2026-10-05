# Testing and verification

## Automated (run before every handoff)

From the repo root:

```bash
npm test        # frontend Vitest + backend pytest
npm run lint    # oxlint + ruff
npm run build   # type-check (tsc -b) + production build
```

| Suite | Location | Count (2026-10-05) |
| --- | --- | --- |
| Frontend unit tests | `frontend/src/**/*.test.ts` | 22 tests in 6 files |
| Backend tests | `backend/tests/` | 47 tests in 2 files |

What they cover:
- **Frontend:** numeric helpers and formatting (`lib/calculus.test.ts`), answer parsing (`components/quiz/checks.test.ts`), mathjs input normalization (`mathjs.test.ts`), asymptote detection and `onCurve` (`functions.test.ts`), the offline answer checker (`expressionAnswer.test.ts`) and LaTeX sums (`signedSum.test.ts`).
- **Backend:** safe parsing, including injection attempts (`__import__`, `x.__class__`, `9^9^9`), difference-quotient output, equivalence grading, the step-by-step rules (each result is checked against `sympy.diff`), and the endpoints.

## Browser verification (manual or scripted)

No end-to-end suite is committed yet (see the backlog in [progress.md](progress.md)). Until then, after changing lessons, run both servers (`npm run dev`) and check:

1. **Every step of every changed lesson** at desktop width (≈1400 px) and phone width (390 px):
   - no `console.error`/`console.warn` (KaTeX errors, React nesting warnings, Mafs NaN warnings)
   - no `.katex-error` elements (red LaTeX source)
   - `document.documentElement.scrollWidth <= window.innerWidth` (no horizontal overflow)
   - server panels finish loading (no lingering "Working it out…")
2. **The interactions**: drag points, sweep tracers, move sliders to target values, submit quiz answers in student notation, and cycle practice generators ("Reveal answer" then "New problem").

### How it was done in past sessions

Sessions used throwaway Playwright scripts (`playwright-core` installed in a scratch directory, driving the system Chrome at `/usr/bin/google-chrome` headless). For example:

```js
import { chromium } from 'playwright-core'
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
page.on('console', (m) => ['error', 'warning'].includes(m.type()) && console.log(m.text()))
await page.goto('http://localhost:5173/math/ap-calculus-ab/power-rule?step=2')
await page.waitForLoadState('networkidle')
console.log(await page.evaluate(() => ({
  katexErrors: document.querySelectorAll('.katex-error').length,
  overflow: document.documentElement.scrollWidth - window.innerWidth,
})))
await browser.close()
```

Two selector traps from past sessions:
- `text=Graph it` also matched the prose "On the graph it is…". Prefer role- or tag-scoped selectors such as `button:has-text("Graph it")`.
- Wait for the lazy lesson chunk (`.lesson-player section`) before counting elements.

### Known intentional "oddity"

Lesson 2.1, step 1 shows "undefined m/s" for the average speed at t = 0. This is deliberate: an average over a zero-length interval is undefined, and it is the hook of the lesson.

## Dev-environment notes

- The API runs on **:8787**, deliberately not :8000, which collides with other local tools.
- Never stop dev servers with a broad `pkill -f vite`: it matches every Vite process for the user, including other projects. Stop the specific process or background task instead.
