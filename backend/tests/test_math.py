import pytest
import sympy as sp
from fastapi.testclient import TestClient

from app.main import app
from app.math.parsing import ExpressionError, h, parse_math, x

client = TestClient(app)


def test_health() -> None:
    assert client.get("/api/health").json() == {"status": "ok"}


@pytest.mark.parametrize(
    ("text", "expected"),
    [
        ("x^2", x**2),
        ("3x^2 + 2x", 3 * x**2 + 2 * x),
        ("sin x", sp.sin(x)),
        ("e^x", sp.exp(x)),
        ("ln(x) + pi", sp.log(x) + sp.pi),
        ("abs(x)", sp.Abs(x)),
    ],
)
def test_parses_classroom_notation(text: str, expected: sp.Expr) -> None:
    assert parse_math(text) == expected


def test_implicit_products_use_the_real_symbols() -> None:
    assert parse_math("2xh", frozenset({"x", "h"})) == 2 * x * h


@pytest.mark.parametrize(
    "text",
    [
        "__import__('os')",
        "x.__class__",
        "open('secrets')",
        "lambda: 1",
        "x; 1",
        "y + 1",
        "9^9^9",
        "x" * 200,
        "(x + 1",
        "",
    ],
)
def test_rejects_unsafe_or_unreadable_input(text: str) -> None:
    with pytest.raises(ExpressionError):
        parse_math(text)


def test_difference_quotient_cancels_h_for_polynomials() -> None:
    response = client.post("/api/math/difference-quotient", json={"expression": "x^2"})
    assert response.status_code == 200
    assert response.json() == {
        "functionLatex": "x^{2}",
        "quotientLatex": r"\frac{\left(x + h\right)^{2} - x^{2}}{h}",
        "simplifiedLatex": "2 x + h",
        "hCancels": True,
        "derivativeLatex": "2 x",
    }


def test_difference_quotient_is_written_like_a_textbook() -> None:
    body = client.post("/api/math/difference-quotient", json={"expression": "x^3 - 3x"}).json()
    assert body["quotientLatex"] == (
        r"\frac{\left(x + h\right)^{3} - 3 \left(x + h\right) - \left(x^{3} - 3 x\right)}{h}"
    )
    assert body["simplifiedLatex"] == "3 x^{2} - 3 + 3 h x + h^{2}"


def test_difference_quotient_for_sine_needs_a_limit() -> None:
    body = client.post("/api/math/difference-quotient", json={"expression": "sin(x)"}).json()
    assert body["hCancels"] is False
    assert body["derivativeLatex"] == r"\cos{\left(x \right)}"


def test_difference_quotient_reports_parse_errors() -> None:
    response = client.post("/api/math/difference-quotient", json={"expression": "x + y"})
    assert response.status_code == 422
    assert "Unknown name 'y'" in response.json()["detail"]


@pytest.mark.parametrize(
    ("answer", "equivalent"),
    [
        ("h+6", True),
        ("6 + h", True),
        ("(12 + 2h)/2", True),
        ("((3+h)^2 - 9)/h", True),
        ("6", False),
        ("6h", False),
    ],
)
def test_equivalence(answer: str, equivalent: bool) -> None:
    response = client.post("/api/math/equivalence", json={"expected": "6 + h", "answer": answer})
    assert response.status_code == 200
    assert response.json() == {"equivalent": equivalent}


def test_equivalence_reports_unreadable_answers() -> None:
    response = client.post("/api/math/equivalence", json={"expected": "6 + h", "answer": "6 + * h"})
    assert response.status_code == 422
    assert isinstance(response.json()["detail"], str)


@pytest.mark.parametrize(
    ("text", "expected"),
    [("sec^2(x)", sp.sec(x) ** 2), ("sin^2 x", sp.sin(x) ** 2), ("x^2 sin x", x**2 * sp.sin(x))],
)
def test_parses_function_powers(text: str, expected: sp.Expr) -> None:
    assert parse_math(text) == expected
