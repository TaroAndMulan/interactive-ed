import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.math.router import router as math_router

app = FastAPI(
    title="Interactive Ed API",
    version="0.1.0",
    description="Symbolic math (SymPy) and, later, classes and progress for the Interactive Ed frontend.",
)

# In development the Vite dev server proxies /api, so CORS is only needed when the
# frontend is served from another origin. Example: CORS_ORIGINS=https://learn.example.com
if origins := [o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip()]:
    app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"])


@app.get("/api/health", tags=["meta"])
def health() -> dict[str, str]:
    return {"status": "ok"}


# One router per domain. Future: classes (rosters, assignments), progress, accounts.
app.include_router(math_router, prefix="/api")
