import { describe, expect, it } from 'vitest'
import { expressionAnswer } from './expressionAnswer'

// No API server in unit tests, so these exercise the in-browser (mathjs) fallback.
describe('expressionAnswer offline fallback', () => {
  it('accepts equivalent answers written in classroom notation', async () => {
    expect((await expressionAnswer('sec(x)^2')('sec^2 x')).correct).toBe(true)
    expect((await expressionAnswer('2x sin(x) + x^2 cos(x)')('x^2 cos x + 2x sin x')).correct).toBe(true)
    expect((await expressionAnswer('1/x')('x^(-1)')).correct).toBe(true)
  })

  it('rejects wrong answers and unreadable input', async () => {
    expect((await expressionAnswer('cos(x)')('-sin x')).correct).toBe(false)
    expect((await expressionAnswer('6 + h')('6 + * h')).note).toBe("Couldn't read that expression.")
  })
})
