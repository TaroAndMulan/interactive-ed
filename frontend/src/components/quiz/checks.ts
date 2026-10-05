import type { CheckResult } from './types'

/** Parses "2.5", "-3", ".5" or a simple fraction like "5/2". */
export function parseNumber(text: string): number | undefined {
  const match = text.replace(/\s+/g, '').match(/^(-?\d*\.?\d+)(?:\/(-?\d*\.?\d+))?$/)
  if (!match) return undefined
  const value = match[2] === undefined ? Number(match[1]) : Number(match[1]) / Number(match[2])
  return Number.isFinite(value) ? value : undefined
}

/** Grades a numeric answer within an absolute tolerance. */
export function numericAnswer(expected: number, tolerance = 0.01) {
  return (response: string): CheckResult => {
    const value = parseNumber(response)
    if (value === undefined) return { correct: false, note: 'Enter a number, like 2.5 or 5/2.' }
    return { correct: Math.abs(value - expected) <= tolerance }
  }
}
