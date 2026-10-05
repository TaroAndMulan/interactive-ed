import sympy as sp


def tex(expr: sp.Basic, **settings: object) -> str:
    """LaTeX in classroom notation: ln x rather than SymPy's default log(x)."""
    return sp.latex(expr, ln_notation=True, **settings)
