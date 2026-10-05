# Architecture

Interactive Ed is a set of interactive lessons a teacher projects in class and students use on their own devices. The current content is AP Calculus AB, Unit 2.

## System overview

```
Browser (React SPA, Vite)                          Python API (FastAPI)
┌──────────────────────────────────────┐           ┌──────────────────────────────┐
│ Router: /:subject/:course/:lesson     │           │ /api/health                  │
│ LessonPlayer → steps (?step=N)        │  /api/*   │ /api/math/difference-quotient│
│ Interactive graphs: Mafs (SVG)        │ ────────► │ /api/math/derivative-steps   │
│ Math typesetting: KaTeX               │  JSON     │ /api/math/equivalence        │
│ Custom functions: mathjs (lazy)       │ (camel-   │                              │
│ Quiz / practice grading               │  Case)    │ SymPy: parse → algebra →     │
└──────────────────────────────────────┘           │ LaTeX (AP notation)          │
                                                   └──────────────────────────────┘
```

- **Everything interactive runs in the browser.** Dragging points, sweeping sliders and animations must run at 60 fps, so they never wait on the network.
- **The server does exact symbolic math** with SymPy. It simplifies difference quotients, explains derivatives rule by rule, and checks whether a typed answer is algebraically equivalent to the expected one.
- **The frontend degrades gracefully.** If the API is down, server panels show a "start the server" message (`ServerMessage`), and answer checking falls back to numerical comparison in the browser (`expressionAnswer.ts`).

In development, Vite (port 5173) proxies `/api` to uvicorn (port 8787). In production, set `VITE_API_URL` if the API lives on another origin, and `CORS_ORIGINS` on the server.

## Stack

| Layer | Choice | Version (at time of writing) |
| --- | --- | --- |
| UI | React + TypeScript | React 19, TS 6 |
| Build/dev server | Vite | 8 |
| Routing | React Router (data router) | 8 |
| Styling | Tailwind CSS (Vite plugin) | 4 |
| Interactive graphs | Mafs | 0.21 |
| Math typesetting | KaTeX | 0.19 |
| Expression parsing in the browser | mathjs (dynamically imported) | 15 |
| Frontend tests / lint | Vitest / oxlint | 5 / 1.x |
| API | FastAPI + uvicorn | FastAPI ≥ 0.142, uvicorn ≥ 0.54 |
| Computer algebra | SymPy | 1.14 |
| Python tooling | uv, pytest, ruff | Python 3.12 |

Why these were chosen: see [decisions.md](decisions.md).

## Core ideas

### 1. The curriculum is code, organized as a tree

`Subject → Course → Unit → Lesson`, defined in TypeScript under `frontend/src/curriculum/`. Each lesson is a lazily imported React component, so every lesson is its own bundle chunk. Pages (home, subject, course, lesson) are generic and driven by `curriculum/registry.ts`. Adding content never touches the app shell. See [structure.md](structure.md).

### 2. A lesson is a sequence of steps

`LessonPlayer` takes `steps: { id, title, content, teacherNotes? }[]` and provides classroom features:
- step navigation synced to the URL (`?step=3`)
- keyboard and presentation-clicker navigation (←/→, PageUp/PageDown)
- fullscreen "Present" mode
- a teacher-notes toggle remembered in `localStorage`

### 3. Three levels of sharing

| Scope | Folder | Examples |
| --- | --- | --- |
| Any subject | `frontend/src/components/` | LessonPlayer, Quiz, PracticeGenerator, AlgebraStepper, Tex, Slider |
| One subject (math) | `curriculum/math/shared/` | DerivativeTracer, FunctionPlot, LimitTable, SymPy panels, answer grading |
| One course | `curriculum/math/ap-calculus-ab/shared/` | CombinationExplorer (product/quotient) |
| One lesson | `lessons/<slug>/` | GrowingSquare, UnitCircleSine… |

Promote a component one level up when a second consumer appears, not before.

### 4. A consistent visual language

Defined in `curriculum/math/shared/colors.ts` and used in graphs and formulas (KaTeX `\textcolor`) alike:
- orange: average rate / secant line
- blue: instantaneous rate / tangent line / f′
- teal and violet: the two functions f and g when there are several
- pink: their combination (f + g, fg, f/g)
- red: something that breaks, or a common mistake

## Request flow example: "Step by step" panel

1. `DerivativeStepsPanel` calls `useServerResult(expression, fetchDerivativeSteps)`.
2. `postJson('/api/math/derivative-steps', { expression })` is proxied to FastAPI.
3. `parse_math()` validates tokens against an allowlist, then parses with SymPy.
4. `rules.derivative_steps()` walks the expression tree, naming each rule, and returns LaTeX.
5. The panel renders each step with KaTeX. If the server is unreachable, `ServerMessage` explains how to start it.

## What doesn't exist yet

There are no accounts, classes, student progress, or database. The backend is stateless. See the backlog in [progress.md](progress.md).
