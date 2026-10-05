# Frontend implementation

React 19 + TypeScript + Vite, styled with Tailwind v4. Source in `frontend/src/`. For the folder map, see [structure.md](structure.md).

## Commands (run in `frontend/`)

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on :5173 (proxies `/api` → :8787) |
| `npm run build` | `tsc -b` type-check, then a production build into `dist/` |
| `npm run lint` | oxlint |
| `npm test` / `npm run test:watch` | Vitest (node environment) |

The root `package.json` has `npm run dev`, which starts frontend and backend together.

## Routing and pages

`app/router.tsx` uses `createBrowserRouter`. Static routes (e.g. a future `/classes`) take precedence over the dynamic `/:subjectSlug/...` ones. Pages call the registry (`findSubject`, `findCourse`, `findLesson`) and render `NotFoundPage` for unknown slugs. `LessonPage` renders the lazy lesson inside `<Suspense>` and shows previous/next links to neighbouring lessons that have a component.

## Curriculum model (`curriculum/types.ts`)

```ts
Subject { slug, title, description, glyph, courses: Course[] }
Course  { slug, title, description, level?, units: Unit[] }
Unit    { slug, number?, title, lessons: Lesson[] }
Lesson  { slug, title, summary, standard?, durationMinutes?, component?: LazyExoticComponent }
```

A lesson without `component` is listed as "Coming soon". Lesson slugs must be unique within a course.

## Shared components catalogue

### `components/lesson/`

| Component | Props | Notes |
| --- | --- | --- |
| `LessonPlayer` | `steps: LessonStep[]` | `LessonStep = { id, title, content, teacherNotes? }`. Step in `?step=N` (replace, not push). ←/→ are ignored while focus is in an input, `.MafsView` or `[role=radiogroup]`; PageUp/PageDown work everywhere except text fields. Teacher-notes toggle stored in `localStorage['lesson:teacherNotes']`. Present = Fullscreen API on `.lesson-player`. |
| `Callout`, `Prose` | `kind?: 'idea' \| 'think' \| 'ap'`, `title?` | Key idea / discussion prompt / AP exam tip. `Prose` is a readable-width text column. |
| `ExplorerLayout`, `Readout` | `graph`, `panel` / `label`, `value`, `color?` | The standard widget layout: graph left, controls right (stacked on mobile). |
| `AlgebraStepper` | `title?`, `lines: { tex, note? }[]` | Reveals a derivation line by line ("Next line / Show all / Start over"). |
| `ValueTable` | `rows: { label, values[] }[]` | Horizontal AP-style data table. |
| `ServerMessage` | `state: ServerResult` | Loading / offline / error text for API-backed panels. |

### `components/quiz/`

- `QuizQuestion = ChoiceQuestion | InputQuestion`.
  - Choice: `choices: {id, label}[]` and `answer: id`.
  - Input: `check(response) → CheckResult | Promise<CheckResult>`, where `CheckResult = { correct, note? }`, plus `answer` (shown by "Reveal answer"), `inputPrefix?` and `placeholder?`.
- `Quiz({ questions })` shows a first-try score. `QuestionCard` is exported for reuse.
- `PracticeGenerator({ generate: () => PracticeProblem })` shows one random problem at a time with a "New problem" button and a first-try streak. `PracticeProblem = Omit<InputQuestion, 'id' | 'kind'>`.
- `checks.ts`: `numericAnswer(expected, tolerance = 0.01)` accepts decimals and simple fractions (`5/2`).

### `components/math/Tex.tsx`

`<Tex block?>{latex}</Tex>`. Renders with KaTeX. In development, invalid LaTeX is logged with `console.error` (students see KaTeX's red source text).

### `components/ui/`

`Button` (`variant: primary | secondary | ghost`), `Slider` (native range input with label and formatted `display`), `SegmentedControl<T>` (radio-group buttons).

### `lib/`

- `api.ts`: `postJson<T>(path, body, signal?)`. Throws `ApiError` with `.status`. `.unavailable` is true for network errors (status 0) or status ≥ 500.
- `useServerResult(key, load)`: refetches when `key` changes and returns `{status: 'loading' | 'ready' | 'error'}`. Results for a stale key read as loading.
- `hooks.ts`: `usePersistentState(key, initial)` (localStorage, fail-safe) and `useAnimationFrame(onFrame(dt), running)` (dt capped at 0.1 s).
- `calculus.ts`: `averageRateOfChange`, `differenceQuotient`, `numericDerivative` (central difference) and `niceStep(span, target)` (1/2/5 × 10ᵏ grid spacing).
- `format.ts`: `fmt` (fixed decimals; never "-0.00"; "undefined" for non-finite), `fmtSig`, `axisLabeler`, `piLabel` (π/2, π, 3π/2…), `paren`, `signedTerm`.
- `random.ts`: `randomInt(min, max, exclude?)`, `pick(items)`.

### `curriculum/math/shared/`

| Module | Purpose |
| --- | --- |
| `colors.ts` | The color language (`curve`, `average`, `instant`, `first`, `second`, `combined`, `wrong`). Hex values are needed because KaTeX can't read CSS variables. |
| `functions.ts` | `MathFunction { id, tex, expression, f, df, derivativeTex?, viewBox, defaultA, domain?, breaks? }`. Also `presetFunctions` (x², x³−3x, sin x, eˣ), `onCurve()` (MovablePoint constraint), `periodicBreaks()`, `sampleRange()`, `detectBreaks()`, and `compileCustomFunction(input)` (mathjs → MathFunction with derivative). |
| `mathjs.ts` | `normalizeMathInput()` rewrites `sin x → sin(x)`, `sec^2(x) → sec(x)^2`, `ln → log`. `parseMath()` lazy-imports mathjs. |
| `plot.tsx` | `FunctionPlot` (Plot.OfX split at `breaks`, so no false vertical lines), `AutoGrid` (readable grid; `pi` for π/2 labels), `GraphLabel`. |
| `DerivativeTracer.tsx` | Two aligned graphs: drag or sweep a point on f, and slope dots build f′. Props: `fn`, `revealed?`, `pi?`, `derivativeOverlay?` (extra Mafs content on the f′ graph), `panelExtra?`. |
| `TracerGallery.tsx` | A `SegmentedControl` of functions plus a `DerivativeTracer`. |
| `FunctionPicker.tsx` | Presets plus "Your own…" custom input. |
| `LimitTable.tsx` | Secant slopes for h = ±1, ±0.1, ±0.01, ±0.001; optional `limits: {left, right}` row. |
| `DifferenceQuotientPanel.tsx` | SymPy: (f(x+h) − f(x))/h simplified, then the limit. |
| `DerivativeStepsPanel.tsx` | SymPy: rule-by-rule derivative of an expression string. |
| `api.ts` | Typed clients: `fetchDifferenceQuotient`, `fetchDerivativeSteps`, `checkEquivalence`. |
| `expressionAnswer.ts` | `expressionAnswer(expected)` returns a quiz `check` that asks SymPy for equivalence and falls back to mathjs random-point comparison offline. |
| `signedSum.ts` | `signedSum(parts)` and `coefficientTex()` build LaTeX sums with correct signs. |

### `curriculum/math/ap-calculus-ab/shared/`

`CombinationExplorer({ mode: 'product' | 'quotient' })` picks f and g, draws f·g or f/g with the correct tangent (blue) and a common-mistake tangent (red dashed), and lists values and a numeric check. `factors.ts` defines the building-block functions. `tableProblems.tsx` has `generateTableProblem(mode)` for AP table questions.

## Patterns used throughout

- **Reset a widget when its input changes:** give it `key={fn.id}` rather than syncing state in effects.
- **Animation:** `useAnimationFrame` plus a `running` state; the callback reads fresh state each frame.
- **Lesson-level shared state:** e.g. the chosen function in 2.1 and 2.2 lives in the lesson's `index.tsx` and is passed to each step's widget.
- **Server-backed panels:** `useServerResult` + `<ServerMessage>`. Never block the lesson on the server.

## Pitfalls (each one has bitten this project)

1. **LaTeX inside JS strings.** In a normal template literal, `\f`, `\t` and `\n` are control characters (`\frac` becomes a form feed + "rac"). Use `` String.raw`\frac{a}{b}` ``, or double the backslashes in non-raw templates (`` `\\frac{${x}}{2}` ``).
2. **LaTeX as JSX text.** `<Tex>\sqrt{x}</Tex>` treats `{x}` as a JS expression. Write `<Tex>{String.raw`\sqrt{x}`}</Tex>`. Plain JSX text is fine only when it contains no braces (`<Tex>h \to 0</Tex>`).
3. **`<Tex block>` inside `<p>`** produces a `<div>` in a `<p>`, which React warns about. Put block math between paragraphs.
4. **Mafs `<Text>` defaults to a very large font.** Always pass `size={14–18}`.
5. **Mafs `Plot.OfX` connects across NaN and asymptotes.** Use `FunctionPlot` with `breaks` (or `domain`) for tan x, 1/x, piecewise functions, and ln x.
6. **Mafs `preserveAspectRatio` defaults to `"contain"`,** so the visible range is often wider than `viewBox`. Use `AutoGrid` (few lines) instead of hand-tuned grids. Use `preserveAspectRatio={false}` only when two graphs must align (DerivativeTracer) or the axes have different units.
7. **Mafs pans by default.** Lessons pass `pan={false}` for predictable classroom use.
8. **Responsive grids need a mobile column template.** Use `grid grid-cols-1 lg:grid-cols-[...]`. Without `grid-cols-1`, wide content (KaTeX, Mafs) widens the page on phones.
9. **mathjs doesn't understand `sin x`, `ln x`, or `sec^2(x)`.** Always go through `parseMath()` / `normalizeMathInput()`.
10. **Expected answers for the checker** should use explicit `*` and parentheses (`(4/3)*x^(-1/3)`): mathjs and SymPy treat implicit multiplication precedence differently.
11. **oxlint `only-export-components`.** Keep helpers and data in `.ts` files and components in `.tsx`.

## Styling

Tailwind v4 via `@tailwindcss/vite`. Tokens live in `index.css` `@theme` (`--color-average`, `--color-instant`, `--color-curve`). Mafs is re-themed light with `html .MafsView { --mafs-* }`. KaTeX display blocks scroll horizontally on narrow screens. The site is light-theme only for now.
