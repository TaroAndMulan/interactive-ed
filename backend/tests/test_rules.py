import pytest
import sympy as sp
from fastapi.testclient import TestClient

from app.main import app
from app.math.parsing import parse_math, x
from app.math.rules import _differentiate, derivative_steps

client = TestClient(app)


@pytest.mark.parametrize(
    "text",
    [
        "x^3 - 4x + 7",
        "x^2 sin x",
        "e^x / x^2",
        "sqrt(x) + 1/x",
        "3x^2 e^x",
        "1/sin(x)",
        "(x^2 + 1)/(x - 1)",
        "-5x^4 + 2/x^3",
        "x ln x - x",
        "tan x + sec x - cot x - csc x",
        "sin(2x)",
    ],
)
def test_step_by_step_derivative_is_correct(text: str) -> None:
    f = parse_math(text)
    # Rewriting in cosines lets SymPy prove identities such as sec^2 x = tan^2 x + 1.
    assert sp.simplify((_differentiate(f, []) - sp.diff(f, x)).rewrite(sp.cos)) == 0


def rules_for(text: str) -> list[str]:
    return [step.rule for step in derivative_steps(parse_math(text)).steps]


def test_names_the_rules_in_order() -> None:
    assert rules_for("x^2 sin x") == ["Product rule", "Power rule", "Derivative of sine"]
    assert rules_for("e^x / x") == ["Quotient rule", "Derivative of eˣ", "Power rule"]
    assert rules_for("4x^3 - 2") == [
        "Sum and difference rules",
        "Constant multiple rule",
        "Power rule",
        "Constant rule",
    ]
    assert rules_for("sin(2x)") == ["Chain rule (Unit 3)"]


def test_uses_ap_notation() -> None:
    result = derivative_steps(parse_math("tan x + ln x"))
    assert result.derivative_latex == r"\sec^{2}{\left(x \right)} + \frac{1}{x}"
    assert all(r"\log" not in step.latex for step in result.steps)


def test_power_rule_shows_the_rewrite_for_negative_exponents() -> None:
    (step,) = derivative_steps(parse_math("1/x^3")).steps
    assert step.latex.endswith(r"= \frac{d}{dx}\left[x^{-3}\right] = -3 x^{-4} = - \frac{3}{x^{4}}")


def test_derivative_steps_endpoint() -> None:
    response = client.post("/api/math/derivative-steps", json={"expression": "x^2 sin x"})
    assert response.status_code == 200
    body = response.json()
    assert [s["rule"] for s in body["steps"]] == ["Product rule", "Power rule", "Derivative of sine"]
    assert body["derivativeLatex"] == r"x^{2} \cos{\left(x \right)} + 2 x \sin{\left(x \right)}"
