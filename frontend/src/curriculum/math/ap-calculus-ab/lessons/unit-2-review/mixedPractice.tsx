import { Tex } from '@/components/math/Tex'
import type { PracticeProblem } from '@/components/quiz/PracticeGenerator'
import { pick, randomInt } from '@/lib/random'
import { expressionAnswer } from '@/curriculum/math/shared/expressionAnswer'
// The review reuses each lesson's own practice generator.
import { generatePolynomialProblem } from '../basic-derivative-rules/practice'
import { generateTrigProblem } from '../other-trig-derivatives/practice'
import { generatePowerProblem } from '../power-rule/practice'
import { generateBasicFunctionProblem } from '../trig-exp-log-derivatives/practice'

/** dtex is the derivative written to follow a factor, e.g. x^2 \cos x or x^2 (-\sin x). */
const basics = [
  { tex: '\\sin x', expr: 'sin(x)', dexpr: 'cos(x)', dtex: '\\cos x' },
  { tex: '\\cos x', expr: 'cos(x)', dexpr: '-sin(x)', dtex: '(-\\sin x)' },
  { tex: 'e^{x}', expr: 'e^x', dexpr: 'e^x', dtex: 'e^{x}' },
  { tex: '\\ln x', expr: 'ln(x)', dexpr: '1/x', dtex: '\\cdot\\frac{1}{x}' },
]

const power = (n: number) => (n === 0 ? '' : n === 1 ? 'x' : `x^{${n}}`)
/** d/dx xⁿ written as a coefficient in front of the other factor: "3x^{2}", "2x", "". */
const powerDerivative = (n: number) => (n === 1 ? '' : `${n}${power(n - 1)}`)

function generateProductProblem(): PracticeProblem {
  const n = randomInt(1, 4)
  const b = pick(basics)
  return {
    prompt: (
      <>
        Differentiate <Tex>{`f(x) = ${power(n)}\\,${b.tex}`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{"f'(x) ="}</Tex>,
    placeholder: 'product rule',
    answer: <Tex>{`${powerDerivative(n)}${b.tex} + ${power(n)}${b.dtex}`}</Tex>,
    check: expressionAnswer(`${n}*x^(${n - 1})*${b.expr} + x^${n}*(${b.dexpr})`),
    explanation: <>Product rule: derivative of the first times the second, plus the first times the derivative of the second.</>,
  }
}

function generateQuotientProblem(): PracticeProblem {
  const n = randomInt(1, 3)
  const b = pick(basics)
  return {
    prompt: (
      <>
        Differentiate <Tex>{`f(x) = \\frac{${b.tex}}{${power(n)}}`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{"f'(x) ="}</Tex>,
    placeholder: 'quotient rule',
    answer: <Tex>{`\\frac{${power(n)}${b.dtex} - ${powerDerivative(n)}${b.tex}}{${power(2 * n)}}`}</Tex>,
    check: expressionAnswer(`((${b.dexpr})*x^${n} - ${b.expr}*${n}*x^(${n - 1}))/x^(${2 * n})`),
    explanation: <>Quotient rule: low d-high minus high d-low, over low squared. Any equivalent simplified form is accepted.</>,
  }
}

const generators = [
  generatePowerProblem,
  generatePolynomialProblem,
  generateBasicFunctionProblem,
  generateTrigProblem,
  generateProductProblem,
  generateQuotientProblem,
]

/** A random problem from anywhere in Unit 2. */
export function generateMixedProblem(): PracticeProblem {
  return pick(generators)()
}
