import { describe, expect, it } from 'vitest'
import { averageRateOfChange, differenceQuotient, niceStep, numericDerivative } from './calculus'
import { axisLabeler, fmt, fmtSig, piLabel } from './format'

const square = (x: number) => x * x

describe('rates of change', () => {
  it('computes the slope of a secant line', () => {
    expect(averageRateOfChange(square, 1, 3)).toBe(4)
    expect(averageRateOfChange(square, 3, 1)).toBe(4)
  })

  it('is undefined when both endpoints coincide', () => {
    expect(averageRateOfChange(square, 2, 2)).toBeNaN()
  })

  it('difference quotients approach the derivative as h shrinks', () => {
    expect(differenceQuotient(square, 3, 0.1)).toBeCloseTo(6.1, 10)
    expect(differenceQuotient(square, 3, -0.001)).toBeCloseTo(5.999, 10)
  })

  it('estimates derivatives numerically', () => {
    expect(numericDerivative(Math.sin, 0)).toBeCloseTo(1, 8)
    expect(numericDerivative(square, -2)).toBeCloseTo(-4, 8)
  })
})

describe('niceStep', () => {
  it('picks 1, 2 or 5 times a power of ten', () => {
    expect(niceStep(10)).toBe(1)
    expect(niceStep(100)).toBe(10)
    expect(niceStep(0.02)).toBeCloseTo(0.002, 12)
    expect(niceStep(40)).toBe(5)
  })
})

describe('formatting', () => {
  it('formats numbers for display', () => {
    expect(fmt(-0.0001)).toBe('0.00')
    expect(fmt(2.345, 1)).toBe('2.3')
    expect(fmt(NaN)).toBe('undefined')
    expect(fmtSig(0.001234)).toBe('0.0012')
    expect(axisLabeler(0.1)(0.30000000000000004)).toBe('0.3')
    expect([-Math.PI / 2, 0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI].map(piLabel)).toEqual([
      '-π/2',
      '0',
      'π/2',
      'π',
      '3π/2',
      '2π',
    ])
  })
})
