import { describe, expect, it } from 'vitest'
import { numericAnswer, parseNumber } from './checks'

describe('parseNumber', () => {
  it('reads decimals and fractions', () => {
    expect(parseNumber('2.5')).toBe(2.5)
    expect(parseNumber(' -3 ')).toBe(-3)
    expect(parseNumber('.5')).toBe(0.5)
    expect(parseNumber('5 / 2')).toBe(2.5)
  })

  it('rejects anything else', () => {
    expect(parseNumber('')).toBeUndefined()
    expect(parseNumber('abc')).toBeUndefined()
    expect(parseNumber('1/0')).toBeUndefined()
  })
})

describe('numericAnswer', () => {
  it('accepts answers within tolerance', () => {
    const check = numericAnswer(4 / 3, 0.01)
    expect(check('4/3').correct).toBe(true)
    expect(check('1.33').correct).toBe(true)
    expect(check('1.3').correct).toBe(false)
    expect(check('four').note).toBeDefined()
  })
})
