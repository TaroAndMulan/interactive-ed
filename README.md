# Interactive Ed

Interactive lessons for teaching in a classroom: project them, drag the graphs, and let students discover the idea.

**AP Calculus AB, Unit 2 (Differentiation: Definition and Fundamental Properties)** is complete: one lesson per CED topic plus a review workshop.

| Topic | Lesson | Interactive pieces |
| --- | --- | --- |
| 2.1 | Average vs. instantaneous rate | Speedometer paradox, secant → tangent, h → 0 animation, limit table |
| 2.2 | Defining the derivative & notation | Slope tracer that draws f′, two limit forms, notation translator with units, tangent-line builder |
| 2.3 | Estimating derivatives | "Eyeball the tangent" game, forward/backward/symmetric quotients, AP data-table picker |
| 2.4 | Differentiability & continuity | Zoom gallery (corner, cusp, vertical tangent, jump, hole), "make it differentiable" tuner |
| 2.5 | Power rule | Pattern table, guess-the-derivative, growing-square proof, roots & reciprocals |
| 2.6 | Constant, sum, multiple rules | Shift/stretch explorer, stacked slope bars, polynomial machine |
| 2.7 | sin x, cos x, eˣ, ln x | Tracers, unit-circle proof of sin′ = cos, "find e" slider, ln/eˣ reflection |
| 2.8 | Product rule | f′g′ mistake checker, growing-rectangle area model, proof stepper |
| 2.9 | Quotient rule | Derivation from the product rule, mistake checker, quotient vs. rewrite (SymPy) |
| 2.10 | tan, cot, sec, csc | Derivations, asymptote-aware tracers, co-function pattern table |
| Review | Derivative rules workshop | Rules sheet, type-any-function step-by-step differentiator, mixed practice |

Every lesson ends with a self-checking quiz, and most include an endless practice generator.

## Quick start

Requires Node 20+, Python 3.12+, and [uv](https://docs.astral.sh/uv/).

```bash
npm run setup   # installs root, frontend and backend dependencies
npm run dev     # web on http://localhost:5173, API on http://localhost:8787 (docs at /docs)
npm test        # frontend (Vitest) + backend (pytest)
npm run lint
```

The frontend works on its own. Without the API, the SymPy panels (algebra behind the limit, step-by-step rules) show a hint to start the server, and typed answers are checked in the browser instead.

## Documentation

Project documentation lives in [`docs/`](docs/README.md): architecture, structure, frontend and backend implementation, a lesson-authoring guide, testing, a decision log, progress, and session logs. **[`docs/handoff.md`](docs/handoff.md) always describes the latest state and next steps.**

## Stack and why

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | React 19 + Vite + TypeScript | Fast dev server and per-lesson code splitting. TypeScript keeps a growing curriculum consistent. |
| Interactive graphs | [Mafs](https://mafs.dev) | React components for draggable points, curves and lines, designed for math education. |
| Math typesetting | KaTeX | Fast LaTeX rendering. Formulas use the same colors as the graphs. |
| Custom functions | mathjs (lazy-loaded) | Parses and differentiates functions typed into the lesson, instantly and in the browser. |
| Styling / routing | Tailwind CSS v4, React Router | |
| Backend | FastAPI + SymPy | Python is the ecosystem for math education (SymPy, NumPy, Manim, Jupyter). SymPy does exact algebra, e.g. simplifying difference quotients and checking that `h+6` and `(12+2h)/2` are the same answer. |

**What about Manim (3Blue1Brown)?** Manim renders *videos* offline. It's great for polished explainer clips, but students can't interact with it, and it isn't a web backend. Interactivity has to run in the browser (Mafs), because dragging at 60 fps can't wait on a server. Because the backend is Python, Manim fits in later as an offline pipeline that renders clips into `frontend/public/media/`. Installing it needs system libraries first (`sudo apt install libcairo2-dev libpango1.0-dev`). Keep it in its own project or dependency group so the API stays easy to install.

## Project layout

```
frontend/src/
  app/                    router, layout, pages (Home → Subject → Course → Lesson)
  components/             subject-agnostic building blocks
    lesson/               LessonPlayer (steps, Present mode, teacher notes), Callout, ExplorerLayout,
                          AlgebraStepper (reveal a derivation line by line), ValueTable
    quiz/                 Quiz + question types (grading is pluggable per question), PracticeGenerator
    math/Tex.tsx          KaTeX
    ui/                   Button, Slider, SegmentedControl
  lib/                    api client, hooks, numeric calculus helpers, formatting
  curriculum/
    types.ts              Subject → Course → Unit → Lesson
    registry.ts           the list of subjects + lookups
    math/
      index.ts            the Mathematics subject
      shared/             reused by every math course: DerivativeTracer, FunctionPlot (asymptote-safe),
                          FunctionPicker, LimitTable, SymPy panels, answer grading, semantic colors
      ap-calculus-ab/
        index.ts          course outline (all 8 CED units; planned lessons show "coming soon")
        shared/           reused within this course, e.g. the product/quotient CombinationExplorer
        lessons/<topic>/
          index.tsx       the lesson: steps of prose + widgets + teacher notes
          *.tsx           interactive widgets used only by this lesson
          practice.tsx    random problem generator (if any)
          questions.tsx   quiz

backend/app/
  main.py                 FastAPI app; one router per domain under /api
  math/                   parsing.py (safe input → SymPy), calculus.py (difference quotients, answer
                          equivalence), rules.py (step-by-step differentiation), schemas.py, router.py
backend/tests/
```

URLs follow the tree: `/math/ap-calculus-ab/average-vs-instantaneous-rate?step=3`.

## Adding content

- **A lesson:** create a folder under the course's `lessons/` whose `index.tsx` default-exports a component (usually `<LessonPlayer steps={…} />`). Add it to the course's `index.ts` with `component: lazy(() => import('./lessons/<slug>'))`. Each lesson gets its own bundle chunk.
- **A course:** add `curriculum/<subject>/<course>/index.ts` exporting a `Course`, and list it in the subject's `courses`.
- **A subject:** add `curriculum/<subject>/index.ts` exporting a `Subject`, and append it to `subjects` in `curriculum/registry.ts`. Put widgets reused across that subject's courses in `curriculum/<subject>/shared/`.
- **Server-side features:** add a package under `backend/app/<domain>/` with its own `router.py` and include it in `main.py`. Planned domains include `classes` (rosters, assignments) and `progress`. Those will need a database and authentication.

## Teaching features

- **Present** makes the lesson fullscreen for a projector. **← / →** or a presentation clicker (PageUp/PageDown) move between steps.
- The step is in the URL (`?step=4`), so you can link students straight to it.
- **Show teacher notes** reveals facilitation tips and common misconceptions for each step. The setting is remembered per browser.
- **Color language:** orange = average rate (secant line), blue = instantaneous rate (tangent line, f′), in graphs and formulas alike. Red dashed = a common mistake.
- **Answers in student notation:** typed answers like `sec^2 x`, `2x sin x + x^2 cos x`, or `e^x(1+x)` are graded by SymPy, so any equivalent form is accepted.

## Security note

`sympy.parse_expr` uses `eval`, so `backend/app/math/parsing.py` allowlists every token before parsing and caps input length and exponent size. SymPy calls have no time limit. Put the API behind authentication or rate limiting before exposing it publicly.
