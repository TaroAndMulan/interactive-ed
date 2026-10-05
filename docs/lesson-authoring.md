# Writing a lesson

A lesson is a folder under `frontend/src/curriculum/<subject>/<course>/lessons/<slug>/` whose `index.tsx` default-exports a component that renders `<LessonPlayer steps={…} />`.

## 1. Register it

In the course's `index.ts` (e.g. `curriculum/math/ap-calculus-ab/index.ts`), add it to the right unit:

```ts
{
  slug: 'chain-rule',
  title: 'The Chain Rule',
  summary: 'One sentence shown on the course page.',
  standard: 'CED 3.1',          // framework code, shown as a badge
  durationMinutes: 45,
  component: lazy(() => import('./lessons/chain-rule')),
},
```

Leave `component` out to list a planned lesson as "Coming soon".

## 2. Build the steps

```tsx
export default function ChainRuleLesson() {
  const steps: LessonStep[] = [
    {
      id: 'hook',                      // stable id; step order lives in the URL as ?step=N
      title: 'Short step title',
      content: (
        <>
          <Prose><p>Short framing text…</p></Prose>
          <SomeExplorer />               {/* the interactive part */}
          <Callout kind="think"><p>A question for the class.</p></Callout>
        </>
      ),
      teacherNotes: <p>How to run this step, the misconception to watch for, the answer to the Think question.</p>,
    },
    // …
    { id: 'check', title: 'Check your understanding', content: <Quiz questions={questions} /> },
  ]
  return <LessonPlayer steps={steps} />
}
```

### The lesson shape that has worked well

1. **Hook or discovery.** Students explore or predict before any formula, e.g. the speedometer paradox, the pattern table, or "is (fg)′ = f′g′?".
2. **Build the idea visually**, with one interactive per idea.
3. **Formalize**: the rule or definition, often with an `AlgebraStepper` proof.
4. **Practice**: a `PracticeGenerator`, plus AP-style context (tables, units).
5. **Check your understanding**: a `Quiz` of 4–6 questions mixing choice and input.

Use `Callout kind="idea"` for the takeaway, `kind="think"` for discussion prompts, and `kind="ap"` for exam technique. Put answers to Think prompts in `teacherNotes`, not on screen.

## 3. Pick widgets (check what already exists first)

| Need | Use |
| --- | --- |
| Show f and build f′ from slopes | `DerivativeTracer` / `TracerGallery` (math/shared) |
| Let the class choose a function (incl. custom) | `FunctionPicker` + `presetFunctions` |
| Secant slopes converging, from both sides | `LimitTable` |
| Exact algebra from the server | `DifferenceQuotientPanel`, `DerivativeStepsPanel` |
| A derivation revealed line by line | `AlgebraStepper` |
| Graph + controls layout | `ExplorerLayout` + `Readout` |
| A data table in a prompt | `ValueTable` |
| f·g or f/g with correct vs. wrong rule | `CombinationExplorer` (ap-calculus-ab/shared) |
| Curves with asymptotes or pieces | `FunctionPlot` with `breaks`/`domain`, `AutoGrid` |

A new widget goes in the lesson folder first. Move it to a `shared/` folder only when a second lesson needs it (see [structure.md](structure.md)).

## 4. Questions and practice

- `questions.tsx` exports `QuizQuestion[]`.
  - Numeric answers: `check: numericAnswer(value, tolerance)`.
  - Algebraic answers: `check: expressionAnswer('6 + h')`. Any equivalent form is accepted (SymPy), and students may type `sin x`, `sec^2 x`, `ln x`, `e^x`.
- Every question needs an `explanation`. Choice questions should use real misconceptions as wrong answers.
- `practice.tsx` exports `generateXProblem(): PracticeProblem`. Build the displayed LaTeX and the expected expression from the same random values, and write expected expressions with explicit `*` and parentheses.

## 5. Math and pedagogy quality

- **Verify every number you put in prose, teacher notes, and answers**, with a quick computation if in doubt. Past mistakes caught this way: a car speed of 15.6 vs. the correct 12.6 m/s, a claim about where a sum's tangent is flat, and a claim about symmetric difference quotients at an inflection point.
- Use the color language (orange = average, blue = instantaneous/derivative, red = mistake) consistently in graphs **and** in KaTeX via `\textcolor`.
- Name AP CED topic codes in `standard`, and use AP notation (sec²x, ln x, f′(x), dy/dx).

## 6. Technical checklist before calling it done

- [ ] `npm run build` and `npm run lint` are clean; `npm test` passes.
- [ ] Every step opens with no console errors and no red KaTeX errors (see [testing.md](testing.md)).
- [ ] No horizontal overflow at 390 px width.
- [ ] Interactive pieces work by mouse **and** don't trap ←/→ step navigation.
- [ ] Server-backed panels work with the API running, and degrade gracefully without it.
- [ ] Teacher notes exist for the steps that need facilitation.
- [ ] [progress.md](progress.md) is updated.

Read the pitfalls list in [frontend.md](frontend.md#pitfalls-each-one-has-bitten-this-project) before writing LaTeX or Mafs code.
