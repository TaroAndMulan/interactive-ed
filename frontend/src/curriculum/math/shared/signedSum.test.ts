import { describe, expect, it } from 'vitest'
import { coefficientTex, signedSum } from './signedSum'

describe('signedSum', () => {
  it('joins terms with signs and hides unit coefficients', () => {
    const sin = (m: number) => `${coefficientTex(m)}\\sin x`
    const recip = (m: number) => `\\frac{${m}}{x}`
    expect(signedSum([{ coefficient: 3, render: sin }, { coefficient: -2, render: recip }])).toBe('3\\sin x - \\frac{2}{x}')
    expect(signedSum([{ coefficient: -1, render: sin }])).toBe('- \\sin x')
    expect(signedSum([{ coefficient: 0, render: sin }])).toBe('0')
  })
})
