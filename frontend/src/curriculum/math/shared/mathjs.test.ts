import { describe, expect, it } from 'vitest'
import { normalizeMathInput } from './mathjs'

describe('normalizeMathInput', () => {
  it.each([
    ['sin x', 'sin(x)'],
    ['x^2 sin x', 'x^2 sin(x)'],
    ['sec^2(x)', 'sec(x)^2'],
    ['sin^2 x + cos^2 x', 'sin(x)^2 + cos(x)^2'],
    ['ln x', 'log(x)'],
    ['ln(x)/x', 'log(x)/x'],
    ['e^x cos(x)', 'e^x cos(x)'],
  ])('%s → %s', (input, expected) => {
    expect(normalizeMathInput(input)).toBe(expected)
  })
})
