import { fmt } from '@/lib/format'

export interface Term {
  coefficient: number
  power: number
  /** Optional color so a term and its derivative can be matched up. */
  color?: string
}

/** LaTeX for a sum of terms like 2x^3 - x + 4, skipping zero coefficients. */
export function polynomialTex(terms: Term[]): string {
  const parts = terms
    .filter((t) => t.coefficient !== 0)
    .map((t, i) => {
      const magnitude = Math.abs(t.coefficient)
      const sign = t.coefficient < 0 ? '-' : i === 0 ? '' : '+'
      const number = magnitude === 1 && t.power > 0 ? '' : fmt(magnitude, magnitude % 1 === 0 ? 0 : 1)
      const variable = t.power === 0 ? '' : t.power === 1 ? 'x' : `x^{${t.power}}`
      const body = `${number}${variable}`
      return `${sign} ${t.color ? `\\textcolor{${t.color}}{${body}}` : body}`
    })
  return parts.length ? parts.join(' ') : '0'
}

/** The same polynomial as plain text for the answer checker, e.g. "2*x^3 - 1*x + 4". */
export function polynomialExpression(terms: Term[]): string {
  const parts = terms.filter((t) => t.coefficient !== 0).map((t) => `${t.coefficient}*x^(${t.power})`)
  return parts.length ? parts.join(' + ') : '0'
}
