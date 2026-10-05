"""Step-by-step differentiation that names the AP Calculus Unit 2 rule used at each step.

Steps are listed top-down: first the rule applied to the whole expression (with the
derivatives it still needs written as d/dx[...]), then each of those smaller derivatives.
Anything outside Unit 2 (e.g. sin(2x)) is answered by SymPy and labelled accordingly.
"""

from collections.abc import Callable
from dataclasses import dataclass

import sympy as sp

from .latex import tex
from .parsing import x


@dataclass(frozen=True)
class Step:
    rule: str
    latex: str


@dataclass(frozen=True)
class DerivativeSteps:
    function_latex: str
    steps: list[Step]
    derivative_latex: str
    simplified_latex: str | None


# Derivatives written the way the AP course states them (SymPy would give tan(x)**2 + 1).
_BASIC: dict[type, tuple[str, Callable[[sp.Expr], sp.Expr]]] = {
    sp.sin: ("Derivative of sine", lambda u: sp.cos(u)),
    sp.cos: ("Derivative of cosine", lambda u: -sp.sin(u)),
    sp.tan: ("Derivative of tangent", lambda u: sp.sec(u) ** 2),
    sp.cot: ("Derivative of cotangent", lambda u: -(sp.csc(u) ** 2)),
    sp.sec: ("Derivative of secant", lambda u: sp.sec(u) * sp.tan(u)),
    sp.csc: ("Derivative of cosecant", lambda u: -sp.csc(u) * sp.cot(u)),
    sp.exp: ("Derivative of eˣ", lambda u: sp.exp(u)),
    sp.log: ("Derivative of ln x", lambda u: 1 / u),
}


def derivative_steps(f: sp.Expr) -> DerivativeSteps:
    steps: list[Step] = []
    result = _differentiate(f, steps)
    return DerivativeSteps(
        function_latex=tex(f),
        steps=steps,
        derivative_latex=tex(result),
        simplified_latex=_simpler_form(result),
    )


def _simpler_form(expr: sp.Expr) -> str | None:
    """A noticeably shorter equivalent form, if SymPy can find one."""
    best = min((sp.factor(expr), sp.simplify(expr)), key=sp.count_ops)
    return tex(best) if sp.count_ops(best) < sp.count_ops(expr) else None


def _d(expr: sp.Expr) -> str:
    return rf"\frac{{d}}{{dx}}\left[{tex(expr)}\right]"


def _wrap(expr: sp.Expr) -> str:
    latex = tex(expr)
    return rf"\left({latex}\right)" if isinstance(expr, sp.Add) else latex


def _differentiate(expr: sp.Expr, steps: list[Step]) -> sp.Expr:
    def add(rule: str, rhs: str) -> None:
        steps.append(Step(rule, f"{_d(expr)} = {rhs}"))

    if not expr.has(x):
        add("Constant rule", "0")
        return sp.Integer(0)

    if expr == x:
        add("Power rule", "1")
        return sp.Integer(1)

    if isinstance(expr, sp.Add):
        terms = expr.as_ordered_terms()
        parts = []
        for i, term in enumerate(terms):
            negative = term.could_extract_minus_sign()
            sign = "-" if negative else ("+" if i else "")
            parts.append(f"{sign} {_d(-term if negative else term)}".strip())
        add("Sum and difference rules", " ".join(parts))
        return sp.Add(
            *(
                -_differentiate(-term, steps)
                if term.could_extract_minus_sign()
                else _differentiate(term, steps)
                for term in terms
            )
        )

    if isinstance(expr, sp.Mul):
        constant, rest = expr.as_independent(x, as_Add=False)
        if constant != 1:
            prefix = "-" if constant == -1 else rf"{_wrap(constant)} \cdot "
            add("Constant multiple rule", f"{prefix}{_d(rest)}")
            return constant * _differentiate(rest, steps)

        numerator, denominator = sp.fraction(expr)
        if denominator.has(x):
            return _quotient(expr, numerator, denominator, steps)

        first, *others = expr.as_ordered_factors()
        second = sp.Mul(*others)
        add("Product rule", rf"{_d(first)} \cdot {_wrap(second)} + {_wrap(first)} \cdot {_d(second)}")
        d_first = _differentiate(first, steps)
        d_second = _differentiate(second, steps)
        return d_first * second + first * d_second

    if isinstance(expr, sp.Pow):
        base, n = expr.as_base_exp()
        if base == x and not n.has(x):
            result = n * x ** (n - 1)
            if n.is_Integer and n > 0:
                add("Power rule", tex(result))
            else:
                # Show the rewrite students should do first: 1/x^3 = x^{-3}, sqrt(x) = x^{1/2}.
                rewritten = rf"\frac{{d}}{{dx}}\left[x^{{{tex(n)}}}\right]"
                add("Power rule", rf"{rewritten} = {tex(n)} x^{{{tex(n - 1)}}} = {tex(result)}")
            return result
        if n == -1:
            return _quotient(expr, sp.Integer(1), base, steps)

    if isinstance(expr, sp.Function) and expr.func in _BASIC and expr.args == (x,):
        rule, derivative_of = _BASIC[expr.func]
        result = derivative_of(x)
        add(rule, tex(result))
        return result

    result = sp.diff(expr, x)
    composite = isinstance(expr, (sp.Function, sp.Pow)) and any(arg.has(x) and arg != x for arg in expr.args)
    add("Chain rule (Unit 3)" if composite else "Computed by SymPy", tex(result))
    return result


def _quotient(expr: sp.Expr, numerator: sp.Expr, denominator: sp.Expr, steps: list[Step]) -> sp.Expr:
    squared = tex(sp.Pow(denominator, 2, evaluate=False))
    steps.append(
        Step(
            "Quotient rule",
            rf"{_d(expr)} = \frac{{{_d(numerator)} \cdot {_wrap(denominator)} - "
            rf"{_wrap(numerator)} \cdot {_d(denominator)}}}{{{squared}}}",
        )
    )
    d_numerator = _differentiate(numerator, steps)
    d_denominator = _differentiate(denominator, steps)
    return (d_numerator * denominator - numerator * d_denominator) / denominator**2
