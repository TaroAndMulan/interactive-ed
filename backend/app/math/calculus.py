"""Symbolic calculus used by lessons: difference quotients and answer equivalence."""

import random
from dataclasses import dataclass

import sympy as sp

from .latex import tex
from .parsing import h, x


@dataclass(frozen=True)
class DifferenceQuotient:
    function_latex: str
    quotient_latex: str
    simplified_latex: str
    h_cancels: bool
    derivative_latex: str


def difference_quotient(f: sp.Expr) -> DifferenceQuotient:
    """Work through (f(x+h) - f(x)) / h the way a student would, then take the derivative."""
    shifted = f.subs(x, x + h)
    simplified = sp.cancel(sp.expand((shifted - f) / h))
    # h "cancels" when the simplified denominator no longer vanishes at h = 0.
    h_cancels = sp.simplify(sp.denom(sp.together(simplified)).subs(h, 0)) != 0

    return DifferenceQuotient(
        function_latex=tex(f),
        quotient_latex=rf"\frac{{{_latex_shifted(f)} - {_parenthesize(f)}}}{{h}}",
        simplified_latex=_latex_by_powers_of_h(simplified),
        h_cancels=bool(h_cancels),
        derivative_latex=tex(sp.simplify(sp.diff(f, x))),
    )


def are_equivalent(expected: sp.Expr, answer: sp.Expr, samples: int = 8) -> bool:
    """True when the two expressions agree for all values of their variables."""
    difference = sp.simplify(expected - answer)
    if difference == 0:
        return True
    # simplify() can miss identities, so confirm numerically at random points.
    rng = random.Random(0)
    symbols = sorted(difference.free_symbols, key=str)
    checked = 0
    for _ in range(samples):
        point = {s: sp.Float(rng.uniform(0.5, 3.5)) for s in symbols}
        value = difference.evalf(subs=point)
        if not value.is_number or value.has(sp.nan, sp.zoo):
            continue
        if abs(complex(value)) > 1e-9:
            return False
        checked += 1
    return checked > 0


# Stands in for (x + h) so SymPy keeps it as one unit instead of expanding 3(x + h) into 3x + 3h.
_X_PLUS_H = sp.Symbol("XH")


def _latex_shifted(f: sp.Expr) -> str:
    """LaTeX for f(x + h) written the way students write it, e.g. (x + h)^3 - 3(x + h)."""
    latex = tex(f.subs(x, _X_PLUS_H))
    # Already delimited (fraction, root, exponent, function argument): no extra parentheses.
    latex = latex.replace("{XH}", "{x + h}").replace(r"\left(XH \right)", r"\left(x + h \right)")
    return latex.replace("XH", r"\left(x + h\right)")


def _parenthesize(expr: sp.Expr) -> str:
    latex = tex(expr)
    return rf"\left({latex}\right)" if isinstance(expr, sp.Add) or latex.startswith("-") else latex


def _latex_by_powers_of_h(expr: sp.Expr) -> str:
    """Polynomials in h print as (h-free part) + (h terms), e.g. "2x + h", so h -> 0 is easy to see."""
    if not expr.is_polynomial(h):
        return tex(expr)
    latex = ""
    for (power,), coefficient in sorted(sp.Poly(expr, h).terms()):
        part = tex(sp.expand(coefficient * h**power))
        if not latex:
            latex = part
        elif part.startswith("-"):
            latex += f" - {part[1:].lstrip()}"
        else:
            latex += f" + {part}"
    return latex
