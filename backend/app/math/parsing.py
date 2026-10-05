"""Safe parsing of typed math such as ``3x^2 + sin(x)`` into SymPy expressions.

``sympy.parse_expr`` is built on ``eval``, so input is tokenized and checked against an
allowlist *before* it reaches SymPy: only numbers, operators, parentheses, the allowed
variables, and known functions/constants get through.
"""

import re

import sympy as sp
from sympy.parsing.sympy_parser import (
    convert_xor,
    implicit_multiplication_application,
    parse_expr,
    standard_transformations,
)

MAX_LENGTH = 120
# Caps symbol-free exponents so inputs like 9^9^9 can't make SymPy compute huge numbers.
MAX_EXPONENT = 20

# Real-valued symbols give friendlier results, e.g. d/dx |x| = sign(x).
x, h, a, t = sp.symbols("x h a t", real=True)
VARIABLES: dict[str, sp.Symbol] = {"x": x, "h": h, "a": a, "t": t}

CONSTANTS = {"pi": sp.pi, "e": sp.E}
FUNCTIONS = {
    "sin": sp.sin,
    "cos": sp.cos,
    "tan": sp.tan,
    "sec": sp.sec,
    "csc": sp.csc,
    "cot": sp.cot,
    "asin": sp.asin,
    "acos": sp.acos,
    "atan": sp.atan,
    "arcsin": sp.asin,
    "arccos": sp.acos,
    "arctan": sp.atan,
    "exp": sp.exp,
    "log": sp.log,
    "ln": sp.log,
    "sqrt": sp.sqrt,
    "abs": sp.Abs,
}

_TOKEN = re.compile(r"\s*(?:(\d+\.?\d*|\.\d+)|([A-Za-z]+)|(\*\*|[-+*/^(),]))")
# convert_xor must run first so "sec^2(x)" and "sin^2 x" become sec(x)**2 and sin(x)**2.
_TRANSFORMS = (*standard_transformations, convert_xor, implicit_multiplication_application)


class ExpressionError(ValueError):
    """Raised with a student-friendly message when input can't be used."""


def parse_math(text: str, variables: frozenset[str] = frozenset({"x"})) -> sp.Expr:
    """Parse ``text`` using only the given variable names (a subset of ``VARIABLES``)."""
    text = text.strip()
    if not text:
        raise ExpressionError("Enter an expression.")
    if len(text) > MAX_LENGTH:
        raise ExpressionError(f"Keep expressions under {MAX_LENGTH} characters.")
    _check_tokens(text, variables)

    names = {**CONSTANTS, **FUNCTIONS, **{v: VARIABLES[v] for v in variables}}
    try:
        unevaluated = parse_expr(text, local_dict=dict(names), transformations=_TRANSFORMS, evaluate=False)
        _check_exponents(unevaluated)
        expr = parse_expr(text, local_dict=dict(names), transformations=_TRANSFORMS)
    except ExpressionError:
        raise
    except Exception as exc:  # SymPy raises many types (SyntaxError, TypeError, TokenError, ...)
        raise ExpressionError("Couldn't read that expression. Check the parentheses and operators.") from exc

    if not isinstance(expr, sp.Expr):
        raise ExpressionError("Couldn't read that expression.")
    # Implicit multiplication ("xh") creates plain symbols; map them onto our real ones.
    return expr.xreplace({sp.Symbol(name): VARIABLES[name] for name in variables})


def _check_tokens(text: str, variables: frozenset[str]) -> None:
    allowed = CONSTANTS.keys() | FUNCTIONS.keys() | variables
    pos = 0
    while pos < len(text):
        match = _TOKEN.match(text, pos)
        if not match:
            raise ExpressionError(f"Unexpected character {text[pos].strip() or 'space'!r}.")
        name = match.group(2)
        # Allow known names and runs of single-letter variables such as "xh" (= x·h).
        if name and name not in allowed and not set(name) <= variables:
            raise ExpressionError(f"Unknown name '{name}'. Use {', '.join(sorted(variables))} as variables.")
        pos = match.end()


def _check_exponents(expr: sp.Basic) -> None:
    for node in sp.preorder_traversal(expr):
        if isinstance(node, sp.Pow) and not node.exp.free_symbols:
            value = sp.N(node.exp)
            if value.is_real and abs(value) > MAX_EXPONENT:
                raise ExpressionError(f"Exponents larger than {MAX_EXPONENT} aren't supported.")
