# Project documentation

Living documentation for Interactive Ed. The root [README](../README.md) covers quick start; this folder covers how the project is built and where it stands.

## Start here

| If you want to… | Read |
| --- | --- |
| Pick up where the last session stopped | [handoff.md](handoff.md) |
| See what's built and what's next | [progress.md](progress.md) |
| Understand the system at a glance | [architecture.md](architecture.md) |
| Find where code lives, or where new code goes | [structure.md](structure.md) |
| Work on the React app | [frontend.md](frontend.md) |
| Work on the FastAPI/SymPy server | [backend.md](backend.md) |
| Write a new lesson | [lesson-authoring.md](lesson-authoring.md) |
| Verify a change | [testing.md](testing.md) |
| Know why something is the way it is | [decisions.md](decisions.md) |
| Read what happened in past sessions | [sessions/](sessions/) |

## Keeping these docs current

Every working session ends by updating the docs. The checklist:

1. **`handoff.md`**: rewrite it to describe the state *now*: what works, what's half-done, known issues, and the next concrete steps.
2. **`progress.md`**: tick off finished topics and features, and add new backlog items.
3. **`sessions/YYYY-MM-DD.md`**: add a session log (copy [sessions/_template.md](sessions/_template.md)). If there are several sessions on one day, append a suffix: `2026-10-06-b.md`.
4. **`decisions.md`**: append an entry for any choice a future reader might question (a library, a convention, a trade-off).
5. **`structure.md`, `frontend.md`, `backend.md`, `lesson-authoring.md`**: update them when you add a shared component, an endpoint, a folder, or a convention.

Rules of thumb:
- Write for someone who has never seen the code but knows React/Python.
- Prefer exact names (file paths, component names, endpoints) over descriptions.
- Docs describe the code as it **is**. Plans go in `progress.md` (backlog) or `handoff.md` (next steps).
- If docs and code disagree, the code wins. Fix the doc in the same session.
