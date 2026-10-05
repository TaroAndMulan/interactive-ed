import type { RealFunction } from '@/lib/calculus'

/** A building-block function for product/quotient explorations. */
export interface Factor {
  id: string
  tex: string
  f: RealFunction
  df: RealFunction
  /** Lower bound of the domain (ln x needs x > 0). */
  min?: number
}

const all: Record<string, Factor> = {
  x: { id: 'x', tex: 'x', f: (x) => x, df: () => 1 },
  x2: { id: 'x2', tex: 'x^2', f: (x) => x * x, df: (x) => 2 * x },
  sin: { id: 'sin', tex: '\\sin x', f: Math.sin, df: Math.cos },
  cos: { id: 'cos', tex: '\\cos x', f: Math.cos, df: (x) => -Math.sin(x) },
  exp: { id: 'exp', tex: 'e^{x}', f: Math.exp, df: Math.exp },
  ln: { id: 'ln', tex: '\\ln x', f: Math.log, df: (x) => 1 / x, min: 0 },
  x2p1: { id: 'x2p1', tex: 'x^2 + 1', f: (x) => x * x + 1, df: (x) => 2 * x },
  twoPlusCos: { id: 'twoPlusCos', tex: '2 + \\cos x', f: (x) => 2 + Math.cos(x), df: (x) => -Math.sin(x) },
}

export const productFactors = { f: [all.x2, all.x, all.exp], g: [all.sin, all.exp, all.ln, all.cos] }
// Denominators never vanish on the visible window, so f/g has no asymptotes.
export const quotientFactors = { f: [all.x2, all.sin, all.x, all.exp], g: [all.x2p1, all.exp, all.twoPlusCos] }
