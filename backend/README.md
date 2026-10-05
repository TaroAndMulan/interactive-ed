# Interactive Ed backend

FastAPI + SymPy. See the [project README](../README.md) for setup and architecture.

```bash
uv sync
uv run uvicorn app.main:app --reload --port 8787   # http://localhost:8787/docs
uv run pytest
uv run ruff check .
```
