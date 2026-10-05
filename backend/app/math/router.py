from dataclasses import asdict

from fastapi import APIRouter, HTTPException

from .calculus import are_equivalent, difference_quotient
from .parsing import ExpressionError, parse_math
from .rules import derivative_steps
from .schemas import (
    DerivativeStep,
    DerivativeStepsResponse,
    DifferenceQuotientResponse,
    EquivalenceRequest,
    EquivalenceResponse,
    ExpressionRequest,
)

router = APIRouter(prefix="/math", tags=["math"])

ANSWER_VARIABLES = frozenset({"x", "h", "a", "t"})


# Plain `def` endpoints run in a worker thread, so slow SymPy work doesn't block the server.
@router.post("/difference-quotient", response_model=DifferenceQuotientResponse)
def post_difference_quotient(body: ExpressionRequest) -> DifferenceQuotientResponse:
    """Simplify (f(x+h) - f(x)) / h for f(x) and find f'(x)."""
    try:
        f = parse_math(body.expression)
    except ExpressionError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return DifferenceQuotientResponse(**asdict(difference_quotient(f)))


@router.post("/derivative-steps", response_model=DerivativeStepsResponse)
def post_derivative_steps(body: ExpressionRequest) -> DerivativeStepsResponse:
    """Differentiate f(x) one rule at a time, naming each rule."""
    try:
        f = parse_math(body.expression)
    except ExpressionError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    result = derivative_steps(f)
    return DerivativeStepsResponse(
        function_latex=result.function_latex,
        steps=[DerivativeStep(rule=s.rule, latex=s.latex) for s in result.steps],
        derivative_latex=result.derivative_latex,
        simplified_latex=result.simplified_latex,
    )


@router.post("/equivalence", response_model=EquivalenceResponse)
def post_equivalence(body: EquivalenceRequest) -> EquivalenceResponse:
    """Grade a typed answer: is it algebraically equivalent to the expected expression?"""
    try:
        expected = parse_math(body.expected, ANSWER_VARIABLES)
    except ExpressionError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid expected answer: {exc}") from exc
    try:
        answer = parse_math(body.answer, ANSWER_VARIABLES)
    except ExpressionError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return EquivalenceResponse(equivalent=are_equivalent(expected, answer))
