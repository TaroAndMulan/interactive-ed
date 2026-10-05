# Backend implementation

FastAPI + SymPy in `backend/`, managed with [uv](https://docs.astral.sh/uv/). The backend is stateless: no database yet.

## Commands (run in `backend/`)

| Command | What it does |
| --- | --- |
| `uv sync` | Create `.venv` and install deps (including the `dev` group) |
| `uv run uvicorn app.main:app --reload --port 8787` | Dev server; interactive docs at http://localhost:8787/docs |
| `uv run pytest` | Tests (`tests/`, with `pythonpath = ["."]`) |
| `uv run ruff check .` / `uv run ruff format .` | Lint / format (line length 110) |

From the repo root, `npm run dev:api` runs the server.

## Configuration

| Env var | Default | Meaning |
| --- | --- | --- |
| `CORS_ORIGINS` | empty (CORS off) | Comma-separated origins allowed to call the API. Not needed in dev: Vite proxies `/api`. |

## API reference

All JSON uses camelCase (Pydantic `alias_generator=to_camel`). Input expressions are limited to 120 characters.

### `GET /api/health`
`{"status": "ok"}`

### `POST /api/math/difference-quotient`
Request `{"expression": "x^2"}` (variable must be `x`). Response:
```json
{
  "functionLatex": "x^{2}",
  "quotientLatex": "\\frac{\\left(x + h\\right)^{2} - x^{2}}{h}",
  "simplifiedLatex": "2 x + h",
  "hCancels": true,
  "derivativeLatex": "2 x"
}
```
`hCancels` is true when the simplified denominator no longer vanishes at h = 0, so you can substitute h = 0. For sin x, eˣ and √x it is false: the frontend explains that the limit still exists. `simplifiedLatex` is printed in ascending powers of h (`3 x^{2} - 3 + 3 h x + h^{2}`), and f(x+h) is written as `(x + h)` rather than SymPy's `(h + x)`.

### `POST /api/math/derivative-steps`
Request `{"expression": "x^2 sin x"}`. Response:
```json
{
  "functionLatex": "x^{2} \\sin{\\left(x \\right)}",
  "steps": [
    {"rule": "Product rule", "latex": "\\frac{d}{dx}\\left[x^{2} \\sin{\\left(x \\right)}\\right] = \\frac{d}{dx}\\left[x^{2}\\right] \\cdot \\sin{\\left(x \\right)} + x^{2} \\cdot \\frac{d}{dx}\\left[\\sin{\\left(x \\right)}\\right]"},
    {"rule": "Power rule", "latex": "…= 2 x"},
    {"rule": "Derivative of sine", "latex": "…= \\cos{\\left(x \\right)}"}
  ],
  "derivativeLatex": "x^{2} \\cos{\\left(x \\right)} + 2 x \\sin{\\left(x \\right)}",
  "simplifiedLatex": "x \\left(x \\cos{\\left(x \\right)} + 2 \\sin{\\left(x \\right)}\\right)"
}
```
Rule names: `Constant rule`, `Power rule`, `Sum and difference rules`, `Constant multiple rule`, `Product rule`, `Quotient rule`, `Derivative of sine|cosine|tangent|cotangent|secant|cosecant|eˣ|ln x`, `Chain rule (Unit 3)` (composite input, answered by SymPy) and `Computed by SymPy` (anything else, e.g. |x|). `simplifiedLatex` is `null` unless SymPy finds a form with fewer operations.

### `POST /api/math/equivalence`
Request `{"expected": "6 + h", "answer": "(12+2h)/2"}` (variables x, h, a, t). Response `{"equivalent": true}`.
- 422 with a **string** `detail` when the student's answer can't be read. The frontend shows it as feedback.
- 400 when the *expected* answer is invalid (an authoring bug).
- Equivalence: `simplify(expected − answer) == 0`, otherwise a numeric check at 8 seeded random points in [0.5, 3.5].

## Modules

### `app/math/parsing.py`: safe parsing
`sympy.parse_expr` uses `eval`, so input is validated **before** SymPy sees it:
- Tokens must be numbers, operators `+ - * / ^ ( ) ,`, allowlisted names (`pi`, `e`, `sin cos tan sec csc cot asin acos atan arcsin arccos arctan exp log ln sqrt abs`), or the allowed variables. Runs of single-letter variables like `xh` are allowed (implicit product).
- Length ≤ 120 characters. Every symbol-free exponent must satisfy |n| ≤ 20 (blocks `9^9^9`). The check is done on an `evaluate=False` parse.
- Transformations: standard, then `convert_xor`, then `implicit_multiplication_application`. This order matters: it makes `sec^2(x)` and `sin^2 x` work.
- Symbols are real (`x, h, a, t`), so d/dx|x| = sign(x). Implicit products' plain symbols are mapped back with `xreplace`.
- Errors raise `ExpressionError` with a student-friendly message.

### `app/math/latex.py`
`tex(expr)` = `sp.latex(..., ln_notation=True)`. Always use it for output, so students see ln, not log.

### `app/math/calculus.py`
`difference_quotient(f)` and `are_equivalent(expected, answer)`. f(x+h) is printed through a placeholder symbol `XH`, which keeps SymPy from distributing `3(x + h)` into `3x + 3h`.

### `app/math/rules.py`
`derivative_steps(f)` walks the expression tree top-down. Each step shows the rule with unfinished `d/dx[...]` parts, then recurses. Notes:
- tan, cot, sec and csc derivatives use AP forms (sec²x, not tan²x + 1).
- Negative and fractional powers show the rewrite (`d/dx[1/x³] = d/dx[x^{-3}] = -3x^{-4}`).
- `x^n` with constant n uses the power rule, even for 1/x.
- Otherwise a division (via `sp.fraction`) uses the quotient rule, and `1/g(x)` is a quotient with numerator 1.

## Adding an endpoint or domain

1. Pure logic in a module (e.g. `app/math/something.py`), returning dataclasses.
2. Request/response models in `schemas.py` (inherit `CamelModel`).
3. A route in `router.py` (plain `def`, so FastAPI runs SymPy in a worker thread). Convert `ExpressionError` to `HTTPException(422, str(exc))`.
4. Tests in `tests/`, covering both the logic and the endpoint via `TestClient`.
5. A typed client in the frontend (`curriculum/<subject>/shared/api.ts`), and document the endpoint here.

A new domain (e.g. `classes`) gets `app/classes/` with its own `router.py`, included in `main.py` with `prefix="/api"`.

## Security and limits

- Parsing is allowlisted (above), but **SymPy calls have no time limit.** A pathological expression could tie up a worker. Before any public deployment, add authentication or rate limiting, and consider running SymPy in a subprocess with a timeout.
- There is no auth or persistence yet.
