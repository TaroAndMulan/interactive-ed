# Decision log

Append-only. Each entry records a choice a future reader might question. To change a decision, add a new entry that supersedes the old one; don't edit history.

Format: **D-number: title** (date, status). Context → decision → consequences.

---

### D1: React + Vite + TypeScript single-page app (2026-10-05, accepted)
**Context:** Lessons are highly interactive and the site will grow to many subjects and courses.
**Decision:** A client-rendered SPA with Vite, React 19, TypeScript, Tailwind v4, and React Router (data router).
**Consequences:** A fast dev loop and per-lesson code splitting via `lazy()`. No SSR/SEO, which is acceptable for a classroom tool.

### D2: Interactivity runs in the browser, with Mafs for graphs (2026-10-05, accepted)
**Context:** Dragging and animation need 60 fps; a server round-trip per frame is impossible.
**Decision:** All interactive math is client-side. Mafs, a set of React components for interactive math, is the graphing library. KaTeX handles typesetting, and mathjs (lazy-loaded) parses functions students type.
**Consequences:** Mafs quirks must be handled (see the pitfalls in frontend.md). mathjs is large (~650 kB), so it is only loaded when needed.

### D3: Python backend with FastAPI + SymPy, which is optional at runtime (2026-10-05, accepted)
**Context:** The user asked which backend fits education, mentioning 3Blue1Brown's Manim.
**Decision:** FastAPI + SymPy for exact symbolic work: simplifying difference quotients, step-by-step rules, and checking answer equivalence. Python is the math-education ecosystem (SymPy, NumPy, Manim, Jupyter). The frontend must remain usable when the API is down.
**Consequences:** Two runtimes (Node + Python/uv). Server panels degrade with `ServerMessage`, and answer checking falls back to mathjs in the browser.

### D4: Manim deferred (2026-10-05, accepted)
**Context:** Manim renders videos offline; it is not interactive and not a web backend. Installing it requires system Cairo/Pango headers (`libcairo2-dev libpango1.0-dev`), which were not available in the dev environment.
**Decision:** Manim is not a dependency. If added later, it becomes an offline pipeline that renders clips into `frontend/public/media/`, kept in its own project or dependency group so `uv sync` stays simple.
**Consequences:** No pre-rendered videos yet.

### D5: The curriculum is code: Subject → Course → Unit → Lesson (2026-10-05, accepted)
**Context:** Many subjects and courses are planned, and lessons are bespoke interactive components.
**Decision:** TypeScript objects under `frontend/src/curriculum/`, registered in `registry.ts`. URLs are `/:subject/:course/:lesson`, and units are not part of the URL. A lesson without a component is listed as planned.
**Consequences:** No CMS; adding content is a code change. Lesson URLs stay stable when units are reorganized.

### D6: Lessons are step sequences with classroom features (2026-10-05, accepted)
**Decision:** `LessonPlayer` with the step in the URL (`?step=N`), keyboard and clicker navigation, fullscreen Present mode, and a teacher-notes toggle.
**Consequences:** Teachers can link straight to a step and present with a clicker. Each step's widget state resets when you leave the step.

### D7: Fixed color language (2026-10-05, accepted)
**Decision:** orange = average/secant, blue = instantaneous/tangent/f′, teal and violet = f and g, pink = their combination, red = mistake or break. The same hex values are used in graphs and in KaTeX `\textcolor`.
**Consequences:** Colors are defined in `colors.ts`, with three of them mirrored in `index.css` `@theme`.

### D8: Equal-aspect graphs by default (2026-10-05, accepted)
**Context:** Slope intuition depends on 45° looking like slope 1.
**Decision:** Mafs's default `preserveAspectRatio="contain"` is kept. `false` is used only for aligned f/f′ graphs (DerivativeTracer) and axes with different units (position vs. time).
**Consequences:** The visible range can exceed `viewBox`, so `AutoGrid` uses few grid lines.

### D9: Allowlist parsing before SymPy (2026-10-05, accepted)
**Context:** `sympy.parse_expr` uses `eval`.
**Decision:** Tokenize and allowlist names/characters before parsing, cap length (120) and symbol-free exponents (|n| ≤ 20), with tests for injection attempts.
**Consequences:** Unusual notation outside the allowlist is rejected with a friendly message. SymPy still has no time limit (see backlog).

### D10: camelCase JSON at the API boundary (2026-10-05, accepted)
**Decision:** Pydantic `alias_generator=to_camel`, so TypeScript stays idiomatic.

### D11: API dev port 8787 (2026-10-05, accepted)
**Context:** Port 8000 was taken by another local tool, and it is a very common default.
**Decision:** uvicorn runs on 8787. Port 8787 appears in the root `package.json` (`dev:api`) and `frontend/vite.config.ts` (proxy).

### D12: Answer checking by algebraic equivalence (2026-10-05, accepted)
**Decision:** Typed answers are graded with SymPy `simplify(expected − answer) == 0` plus a numeric spot check. Offline, mathjs random-point comparison is used. Student notation (`sin x`, `sec^2 x`, `ln x`, implicit multiplication) is accepted on both paths.
**Consequences:** Any equivalent form is accepted. Expected answers in code must be unambiguous (explicit `*`).

### D13: Three sharing levels for components (2026-10-05, accepted)
**Decision:** `components/` (any subject) → `curriculum/<subject>/shared/` → `curriculum/<subject>/<course>/shared/` → the lesson folder. Promote a component when a second consumer appears.

### D14: Backend LaTeX in AP notation (2026-10-05, accepted)
**Decision:** Output uses `ln` (not `log`), sec²x for (tan x)′, `(x + h)` ordering, and difference quotients grouped by powers of h. This lives in `latex.py`, `calculus.py`, and `rules.py`.

### D15: Documentation folder and session protocol (2026-10-05, accepted)
**Context:** Work happens across many sessions, often by an AI assistant without memory of earlier ones.
**Decision:** `docs/` holds architecture, structure, implementation, decisions, progress, handoff, and per-session logs. `CLAUDE.md` tells each session to read `docs/handoff.md` first and update the docs before finishing.
**Consequences:** A small per-session overhead. Docs must be kept in sync with the code.
