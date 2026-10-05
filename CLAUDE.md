# Interactive Ed

Interactive lessons for classroom teaching. React + Vite frontend (`frontend/`), FastAPI + SymPy backend (`backend/`). Current content: AP Calculus AB, Unit 2 (complete).

## Session protocol (every session)

**At the start:** read `docs/handoff.md` (current state, next steps) and `docs/progress.md` (what exists). Before editing, read the relevant guide: `docs/frontend.md`, `docs/backend.md`, or `docs/lesson-authoring.md`.

**Before the final reply of a session that changed anything**, update the docs (details in `docs/README.md`):
1. Rewrite `docs/handoff.md` to describe the state now, open issues, and next steps.
2. Update `docs/progress.md` (statuses, backlog).
3. Add `docs/sessions/YYYY-MM-DD.md` from `docs/sessions/_template.md` (suffix `-b`, `-c` for more sessions that day).
4. Append to `docs/decisions.md` for any new decision a future reader might question.
5. Update `docs/structure.md` / `frontend.md` / `backend.md` / `lesson-authoring.md` if what they describe changed.

Docs describe the code as it is. If docs and code disagree, fix the doc.

## Commands (repo root)

- `npm run setup`: install everything (npm + `uv sync`)
- `npm run dev`: web http://localhost:5173 + API http://localhost:8787 (`/docs` for the API)
- `npm test` · `npm run lint` · `npm run build`

## Must-know conventions

- Where new code goes: `docs/structure.md` → "Where new code goes". Lessons: `frontend/src/curriculum/<subject>/<course>/lessons/<slug>/`, registered in the course `index.ts`.
- LaTeX in TSX: use `` String.raw`…` `` or doubled backslashes; never put braces in JSX text inside `<Tex>`; never put `<Tex block>` inside `<p>`.
- Mafs: `FunctionPlot` (not bare `Plot.OfX`) for asymptotes or pieces; always pass `size` to `<Text>`; `pan={false}`; responsive grids need `grid-cols-1`.
- Typed math in the browser goes through `parseMath()`/`normalizeMathInput()`; on the server, through `parse_math()` (allowlisted).
- Check every number in lesson prose, teacher notes, and answers by computing it.
- API dev port is 8787 (not 8000). Never stop servers with `pkill -f vite`.
