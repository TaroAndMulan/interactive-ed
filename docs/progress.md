# Progress

_Last updated: 2026-10-05_

Legend: ✅ done · 🟡 partial · ⬜ not started

## Curriculum

### Mathematics → AP Calculus AB

| Unit | Title | Status |
| --- | --- | --- |
| 1 | Limits and Continuity | ⬜ (outline only, no lessons) |
| 2 | Differentiation: Definition and Fundamental Properties | ✅ all 10 topics + review |
| 3 | Differentiation: Composite, Implicit, and Inverse Functions | ⬜ |
| 4 | Contextual Applications of Differentiation | ⬜ |
| 5 | Analytical Applications of Differentiation | ⬜ |
| 6 | Integration and Accumulation of Change | ⬜ |
| 7 | Differential Equations | ⬜ |
| 8 | Applications of Integration | ⬜ |

#### Unit 2 detail

| CED | Lesson slug | Steps | Quiz | Practice generator | Status |
| --- | --- | --- | --- | --- | --- |
| 2.1 | `average-vs-instantaneous-rate` | 7 | 6 Q | – | ✅ |
| 2.2 | `derivative-definition-notation` | 5 | 6 Q | – | ✅ |
| 2.3 | `estimating-derivatives` | 4 | 5 Q | random tables | ✅ |
| 2.4 | `differentiability-continuity` | 4 | 5 Q | – | ✅ |
| 2.5 | `power-rule` | 4 | 6 Q | powers, roots, reciprocals | ✅ |
| 2.6 | `basic-derivative-rules` | 5 | 6 Q | polynomials | ✅ |
| 2.7 | `trig-exp-log-derivatives` | 6 | 6 Q | sin/cos/eˣ/ln combos | ✅ |
| 2.8 | `product-rule` | 5 | 6 Q | AP tables | ✅ |
| 2.9 | `quotient-rule` | 5 | 6 Q | AP tables | ✅ |
| 2.10 | `other-trig-derivatives` | 4 | 6 Q | trig combos | ✅ |
| – | `unit-2-review` | 4 | 5 Q | mixed (all of the above + product/quotient formulas) | ✅ |

Content was written from the AP CED topic list and general knowledge of the course, without external research. A teacher review of wording and difficulty is still pending.

### Other subjects
None yet. The home page shows a "More subjects coming soon" placeholder.

## Platform features

| Feature | Status |
| --- | --- |
| Subject / course / lesson pages, registry-driven | ✅ |
| LessonPlayer: URL steps, keyboard/clicker, Present, teacher notes | ✅ |
| Quiz (choice + input), first-try score | ✅ |
| PracticeGenerator (endless problems) | ✅ |
| SymPy API: difference quotient, step-by-step rules, answer equivalence | ✅ |
| Offline fallbacks (server message, mathjs answer check) | ✅ |
| Mobile layout (390 px) without overflow | ✅ |
| Automated end-to-end browser tests in the repo | ⬜ |
| Dark mode | ⬜ (light only) |
| Accounts, classes/rosters, assignments | ⬜ |
| Student progress tracking / persistence (database) | ⬜ |
| Deployment (hosting, HTTPS, auth, rate limiting) | ⬜ |
| Manim video pipeline | ⬜ (deferred, see D4) |

## Backlog (rough priority)

1. Commit an e2e suite (Playwright): sweep every lesson step at two widths for console errors, KaTeX errors and overflow, plus key interactions. The scripts used so far were throwaway.
2. Teacher review pass on Unit 2 content; adjust difficulty and wording.
3. Unit 1 (Limits and Continuity) and Unit 3 (chain rule, implicit, inverse). The workshop already labels composite functions "Chain rule (Unit 3)".
4. Generator self-tests: expose each practice problem's function expression so a unit test can check `expected` against SymPy/mathjs derivatives.
5. Backend hardening before any public deployment: SymPy timeout (subprocess), rate limiting, auth.
6. Classroom features: classes, assignments, progress (needs a DB; probably SQLModel/Postgres in `backend/app/classes/`).
7. Dark mode (Mafs and KaTeX tokens already centralized in `index.css`).
