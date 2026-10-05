export type RealFunction = (x: number) => number

/** Slope of the secant line through (a, f(a)) and (b, f(b)). NaN when a === b. */
export function averageRateOfChange(f: RealFunction, a: number, b: number): number {
  if (a === b) return NaN
  return (f(b) - f(a)) / (b - a)
}

/** The difference quotient (f(a + h) − f(a)) / h. */
export function differenceQuotient(f: RealFunction, a: number, h: number): number {
  return averageRateOfChange(f, a, a + h)
}

/** Central-difference estimate of f'(x); used when no exact derivative is known. */
export function numericDerivative(f: RealFunction, x: number, h = 1e-5): number {
  return (f(x + h) - f(x - h)) / (2 * h)
}

/** A "nice" grid spacing (1, 2 or 5 × 10^k) that puts roughly `target` lines across `span`. */
export function niceStep(span: number, target = 8): number {
  const raw = span / target
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const residual = raw / magnitude
  const nice = residual < 1.5 ? 1 : residual < 3.5 ? 2 : residual < 7.5 ? 5 : 10
  return nice * magnitude
}
