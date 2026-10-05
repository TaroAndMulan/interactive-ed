export interface SignedPart {
  coefficient: number
  /** LaTeX for |coefficient| times this term, e.g. (3) => "3\\sin x" or (4) => "\\frac{4}{x}". */
  render: (magnitude: number) => string
}

/** Joins terms with proper signs: [3 sin x, -2 e^x] → "3\\sin x - 2e^{x}". */
export function signedSum(parts: SignedPart[]): string {
  const terms = parts.filter((p) => p.coefficient !== 0)
  if (terms.length === 0) return '0'
  return terms
    .map((p, i) => {
      const sign = p.coefficient < 0 ? '-' : i === 0 ? '' : '+'
      return `${sign} ${p.render(Math.abs(p.coefficient))}`.trim()
    })
    .join(' ')
}

/** "3" for 3, "" for 1: a coefficient written in front of a term. */
export const coefficientTex = (magnitude: number) => (magnitude === 1 ? '' : `${magnitude}`)
