import { postJson } from '@/lib/api'

/** Symbolic work done by SymPy on the backend (see backend/app/math). */

export interface DifferenceQuotient {
  functionLatex: string
  /** (f(x+h) - f(x)) / h with f substituted, before simplifying. */
  quotientLatex: string
  simplifiedLatex: string
  /** True when algebra removes h from the denominator, so h = 0 can be substituted. */
  hCancels: boolean
  derivativeLatex: string
}

export function fetchDifferenceQuotient(expression: string, signal?: AbortSignal) {
  return postJson<DifferenceQuotient>('/api/math/difference-quotient', { expression }, signal)
}

export interface Equivalence {
  equivalent: boolean
}

export function checkEquivalence(expected: string, answer: string) {
  return postJson<Equivalence>('/api/math/equivalence', { expected, answer })
}

export interface DerivativeSteps {
  functionLatex: string
  steps: { rule: string; latex: string }[]
  derivativeLatex: string
  /** A shorter equivalent form, when SymPy finds one. */
  simplifiedLatex: string | null
}

export function fetchDerivativeSteps(expression: string, signal?: AbortSignal) {
  return postJson<DerivativeSteps>('/api/math/derivative-steps', { expression }, signal)
}
