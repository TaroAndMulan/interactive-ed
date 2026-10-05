# Handoff

_Last updated: 2026-10-05, end of the docs session. Rewrite this file at the end of every session._

## Current state in one paragraph

The app runs locally with `npm run dev` (web :5173, API :8787). AP Calculus AB Unit 2 is complete: 10 topic lessons plus a review workshop, each with interactive explorers, teacher notes, and a quiz, and most with practice generators. Backend endpoints: difference quotient, step-by-step derivative rules, and answer equivalence. All automated checks pass (22 frontend + 47 backend tests, lint, build), and every lesson step was swept in a headless browser at 1400 px and 390 px with no console or KaTeX errors and no overflow.

## Git

- Last commit: `254e911 first day` (all code up to and including Unit 2).
- Uncommitted:
  - `frontend/package-lock.json` (the package name synced to `interactive-ed-frontend`; harmless, commit it)
  - the new `docs/` folder and `CLAUDE.md`
  - the "Documentation" section added to `README.md`

## How to resume

1. Read [progress.md](progress.md) (what exists) and this file (what's next).
2. `npm run setup` if dependencies are missing, then `npm run dev`.
3. Before changing lessons, skim the pitfalls in [frontend.md](frontend.md#pitfalls-each-one-has-bitten-this-project).
4. To add content, follow [lesson-authoring.md](lesson-authoring.md).

## Open issues and known quirks

- **No e2e tests are committed.** Browser verification so far used throwaway Playwright scripts (see [testing.md](testing.md)). This is the most valuable next infrastructure task.
- **Practice generators** were verified by reasoning and by cycling problems in the browser (no KaTeX errors), but there is no automated check that each generated `expected` answer is mathematically correct (backlog item 4).
- **Unit 2 content** has not yet been reviewed by the teacher.
- **SymPy has no timeout**, and there is no auth or rate limiting. This is fine locally, but not for public deployment.
- **Light theme only.**
- **Lesson 2.1, step 1** shows "undefined m/s" at t = 0. This is intentional.

## Suggested next steps

1. Commit the docs and the lockfile change.
2. Ask the user which is next: Unit 1 (Limits), Unit 3 (chain rule), or classroom features.
3. Add a Playwright e2e suite under `frontend/e2e/`, mirroring the checks in testing.md.
