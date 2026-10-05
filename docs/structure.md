# Project structure

```
interactive-ed/
├── CLAUDE.md                 instructions loaded by Claude Code at the start of each session
├── README.md                 quick start + overview
├── package.json              root scripts: setup, dev, dev:api, dev:web, test, lint, build
├── docs/                     this documentation (see docs/README.md)
├── frontend/                 React + Vite app
└── backend/                  FastAPI + SymPy API
```

## Frontend: `frontend/src/`

```
main.tsx                      entry: RouterProvider + global CSS
index.css                     Tailwind import, @theme color tokens, Mafs light theme, KaTeX display overflow
app/
  router.tsx                  routes: /, /:subjectSlug, /:subjectSlug/:courseSlug, /:subjectSlug/:courseSlug/:lessonSlug
  RootLayout.tsx              header, footer, ScrollRestoration
  pages/                      HomePage, SubjectPage, CoursePage, LessonPage, NotFoundPage, ErrorPage
components/                   subject-agnostic building blocks
  Breadcrumbs.tsx
  lesson/
    LessonPlayer.tsx          step runner (URL sync, keyboard/clicker, Present, teacher notes)
    Callout.tsx               Callout (idea | think | ap) and Prose (readable text column)
    ExplorerLayout.tsx        graph-left / panel-right layout + Readout (big labelled value)
    AlgebraStepper.tsx        derivation revealed one line at a time
    ValueTable.tsx            horizontal AP-style data table
    ServerMessage.tsx         loading / offline / error text for API-backed panels
  quiz/
    types.ts                  QuizQuestion = ChoiceQuestion | InputQuestion (with async check)
    Quiz.tsx                  Quiz (list + first-try score) and QuestionCard
    PracticeGenerator.tsx     endless random problems built on QuestionCard
    checks.ts                 parseNumber, numericAnswer(expected, tolerance)
  math/Tex.tsx                KaTeX wrapper (logs invalid LaTeX in dev)
  ui/                         Button, Slider, SegmentedControl
lib/                          framework-level helpers (no subject knowledge)
  api.ts                      postJson, ApiError (.unavailable)
  useServerResult.ts          fetch-on-key hook returning loading/ready/error
  hooks.ts                    usePersistentState, useAnimationFrame
  calculus.ts                 averageRateOfChange, differenceQuotient, numericDerivative, niceStep
  format.ts                   fmt, fmtSig, axisLabeler, piLabel, paren, signedTerm
  random.ts                   randomInt, pick
curriculum/
  types.ts                    Subject, Course, Unit, Lesson
  registry.ts                 subjects[], findSubject/findCourse/findLesson, lessonPath
  math/
    index.ts                  the Mathematics subject
    shared/                   math-wide widgets and logic (see frontend.md for the catalogue)
    ap-calculus-ab/
      index.ts                course outline: 8 CED units, lessons with lazy components
      shared/                 course-wide: CombinationExplorer, factors, tableProblems
      lessons/<slug>/         one folder per lesson (see below)
```

### Inside a lesson folder

```
lessons/power-rule/
  index.tsx          default export: the lesson component (builds LessonStep[] → <LessonPlayer>)
  PatternTable.tsx   widgets used only by this lesson (PascalCase .tsx, one component per file)
  powers.ts          data/helpers (.ts, no components)
  practice.tsx       generateXProblem(): PracticeProblem (optional)
  questions.tsx      export const questions: QuizQuestion[]
```

The current lesson folders, matching the AP CED topics:

| Slug | Topic |
| --- | --- |
| `average-vs-instantaneous-rate` | 2.1 |
| `derivative-definition-notation` | 2.2 |
| `estimating-derivatives` | 2.3 |
| `differentiability-continuity` | 2.4 |
| `power-rule` | 2.5 |
| `basic-derivative-rules` | 2.6 |
| `trig-exp-log-derivatives` | 2.7 |
| `product-rule` | 2.8 |
| `quotient-rule` | 2.9 |
| `other-trig-derivatives` | 2.10 |
| `unit-2-review` | review |

## Backend: `backend/`

```
pyproject.toml                deps (fastapi, sympy, uvicorn) + dev group (pytest, httpx2, ruff); pytest/ruff config
uv.lock
app/
  main.py                     FastAPI app, optional CORS (CORS_ORIGINS), /api/health, includes routers under /api
  math/
    parsing.py                parse_math(): allowlisted, safe parsing of typed math → SymPy
    latex.py                  tex(): LaTeX in classroom notation (ln, not log)
    calculus.py               difference_quotient(), are_equivalent()
    rules.py                  derivative_steps(): rule-by-rule differentiation
    schemas.py                Pydantic models (camelCase JSON)
    router.py                 /math/* endpoints
tests/
  test_math.py                parsing, difference quotient, equivalence, endpoints
  test_rules.py               step-by-step differentiation
```

## Where new code goes

| You are adding… | Put it in |
| --- | --- |
| A lesson | `curriculum/<subject>/<course>/lessons/<slug>/` + register in the course `index.ts` |
| A widget used by one lesson | that lesson's folder |
| A widget used by several lessons of one course | `curriculum/<subject>/<course>/shared/` |
| A widget used across courses of one subject | `curriculum/<subject>/shared/` |
| A component with no subject knowledge | `components/` (lesson/, quiz/, ui/, math/) |
| A pure helper with no React | `lib/` (generic) or a `.ts` file next to its consumer |
| A new course | `curriculum/<subject>/<course>/index.ts`, listed in the subject's `courses` |
| A new subject | `curriculum/<subject>/index.ts`, appended to `subjects` in `registry.ts` |
| A server feature | `backend/app/<domain>/` with `router.py`, included in `app/main.py` |

## Naming conventions

- Lesson slugs: kebab-case and descriptive (`product-rule`), not topic numbers. The CED code goes in the lesson's `standard` field (`'CED 2.8'`).
- React components: PascalCase files, one exported component per file. Data and helpers go in `.ts` files. oxlint's `only-export-components` warns when a `.tsx` file mixes components with other exports.
- Imports: `@/` aliases `frontend/src/`. Inside a lesson, use relative imports for siblings and `../../shared/` for course-shared code.
- Python: modules by domain (`app/math/`), snake_case; JSON is camelCase through Pydantic aliases.
