import { numericDerivative, type RealFunction } from '@/lib/calculus'
import { parseMath } from './mathjs'

export type Vector2 = [number, number]

export interface MathFunction {
  /** Unique per function; use it as a React key to reset widgets when the function changes. */
  id: string
  /** LaTeX for the right-hand side of f(x) = … */
  tex: string
  /** Plain-text form the backend (SymPy) understands, e.g. "x^3 - 3x". */
  expression: string
  f: RealFunction
  df: RealFunction
  /** LaTeX for f′(x), shown once students have discovered it. */
  derivativeTex?: string
  viewBox: { x: Vector2; y: Vector2 }
  /** A good starting x-value for the point of interest. */
  defaultA: number
  /** Where f is defined, if not everywhere (e.g. (0, ∞) for ln x). */
  domain?: Vector2
  /** x-values of vertical asymptotes/jumps, so plots don't draw lines across them. */
  breaks?: number[]
}

export const presetFunctions: MathFunction[] = [
  {
    id: 'square',
    tex: 'x^2',
    expression: 'x^2',
    f: (x) => x * x,
    df: (x) => 2 * x,
    derivativeTex: '2x',
    viewBox: { x: [-1.5, 3], y: [-0.5, 6.5] },
    defaultA: 1,
  },
  {
    id: 'cubic',
    tex: 'x^3 - 3x',
    expression: 'x^3 - 3x',
    f: (x) => x ** 3 - 3 * x,
    df: (x) => 3 * x ** 2 - 3,
    derivativeTex: '3x^2 - 3',
    viewBox: { x: [-2.5, 2.5], y: [-3, 3] },
    defaultA: -1.5,
  },
  {
    id: 'sine',
    tex: '\\sin x',
    expression: 'sin(x)',
    f: Math.sin,
    df: Math.cos,
    derivativeTex: '\\cos x',
    viewBox: { x: [-0.5, 6.8], y: [-1.6, 1.6] },
    defaultA: 1,
  },
  {
    id: 'exp',
    tex: 'e^{x}',
    expression: 'e^x',
    f: Math.exp,
    df: Math.exp,
    derivativeTex: 'e^{x}',
    viewBox: { x: [-3, 2.2], y: [-0.5, 6] },
    defaultA: 0.5,
  },
]

/** x-values of k·period + offset that fall inside [-limit, limit]. */
export function periodicBreaks(offset: number, period: number, limit = 30): number[] {
  const breaks: number[] = []
  for (let x = offset - Math.ceil((offset + limit) / period) * period; x <= limit; x += period) {
    if (x >= -limit) breaks.push(x)
  }
  return breaks
}

/** MovablePoint constraint keeping a point on y = f(x), with x snapped to multiples of `step`. */
export function onCurve(f: RealFunction, step: number, current: Vector2) {
  return ([x]: Vector2): Vector2 => {
    const snapped = Number((Math.round(x / step) * step).toFixed(10))
    const y = f(snapped)
    return Number.isFinite(y) ? [snapped, y] : current
  }
}

/**
 * Builds a MathFunction from text a teacher or student types, e.g. "x^3/3 - x" or "x^2 sin x".
 * mathjs is loaded on demand so lessons that never use it don't pay for it.
 */
export async function compileCustomFunction(input: string): Promise<MathFunction> {
  const { derivative } = await import('mathjs')

  const node = await parseMath(input)
  const compiled = node.compile()
  const f: RealFunction = (x) => {
    try {
      const y = compiled.evaluate({ x })
      return typeof y === 'number' ? y : NaN
    } catch {
      return NaN
    }
  }
  // Surface unknown variables ("y", "t", …) now rather than as an empty graph.
  compiled.evaluate({ x: 0.5 })

  let df: RealFunction
  let derivativeTex: string | undefined
  try {
    const dNode = derivative(node, 'x')
    const dCompiled = dNode.compile()
    df = (x) => {
      const y = dCompiled.evaluate({ x })
      return typeof y === 'number' ? y : NaN
    }
    derivativeTex = dNode.toTex({ parenthesis: 'auto', implicit: 'hide' })
  } catch {
    df = (x) => numericDerivative(f, x)
  }

  return {
    id: `custom:${input}`,
    tex: node.toTex({ parenthesis: 'auto', implicit: 'hide' }),
    expression: input,
    f,
    df,
    derivativeTex,
    viewBox: { x: [-5, 5], y: sampleRange(f, -5, 5) },
    defaultA: 1,
    breaks: detectBreaks(f, -5, 5),
  }
}

/** Where f jumps between large values of opposite sign (vertical asymptotes like tan x or 1/x). */
export function detectBreaks(f: RealFunction, xMin: number, xMax: number, samples = 800): number[] {
  const breaks: number[] = []
  let previous: Vector2 | undefined
  for (let i = 0; i <= samples; i++) {
    const x = xMin + ((xMax - xMin) * i) / samples
    const y = f(x)
    if (!Number.isFinite(y)) continue // e.g. 1/0: compare the finite values on either side instead
    if (previous && Math.sign(previous[1]) !== Math.sign(y) && Math.abs(y - previous[1]) > 20) {
      breaks.push((previous[0] + x) / 2)
    }
    previous = [x, y]
  }
  return breaks
}

/** A y-range that frames f on [xMin, xMax], ignoring values beyond ±limit (asymptotes). */
export function sampleRange(f: RealFunction, xMin: number, xMax: number, limit = 10): Vector2 {
  const ys: number[] = []
  for (let i = 0; i <= 200; i++) {
    const y = f(xMin + ((xMax - xMin) * i) / 200)
    if (Number.isFinite(y)) ys.push(Math.max(-limit, Math.min(limit, y)))
  }
  if (ys.length === 0) return [-5, 5]
  const lo = Math.min(...ys)
  const hi = Math.max(...ys)
  return hi - lo < 1 ? [lo - 1, hi + 1] : [lo, hi]
}
