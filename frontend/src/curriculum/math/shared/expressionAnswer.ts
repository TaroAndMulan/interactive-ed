import type { CheckResult } from '@/components/quiz/types'
import { ApiError } from '@/lib/api'
import { checkEquivalence } from './api'
import { parseMath } from './mathjs'

/**
 * Grades algebraic answers so that "h + 6", "6+h" and "(12 + 2h)/2" are all accepted.
 * SymPy on the backend decides; if the server is offline we fall back to comparing
 * both expressions numerically at random points in the browser.
 */
export function expressionAnswer(expected: string) {
  return async (response: string): Promise<CheckResult> => {
    try {
      const { equivalent } = await checkEquivalence(expected, response)
      return { correct: equivalent }
    } catch (error) {
      if (error instanceof ApiError && !error.unavailable) return { correct: false, note: error.message }
      return checkLocally(expected, response)
    }
  }
}

async function checkLocally(expected: string, response: string): Promise<CheckResult> {
  try {
    const a = (await parseMath(expected)).compile()
    const b = (await parseMath(response)).compile()
    for (let i = 0; i < 8; i++) {
      const scope = { x: random(), h: random(), a: random(), t: random() }
      const va = a.evaluate(scope)
      const vb = b.evaluate(scope)
      if (typeof va !== 'number' || typeof vb !== 'number') return { correct: false }
      if (Math.abs(va - vb) > 1e-6 * Math.max(1, Math.abs(va))) return { correct: false, note: 'Checked offline.' }
    }
    return { correct: true, note: 'Checked offline.' }
  } catch {
    return { correct: false, note: "Couldn't read that expression." }
  }
}

const random = () => Math.random() * 4 + 0.5
