import { Tex } from '@/components/math/Tex'
import type { PracticeProblem } from '@/components/quiz/PracticeGenerator'
import { randomInt } from '@/lib/random'
import { expressionAnswer } from '@/curriculum/math/shared/expressionAnswer'
import { coefficientTex, type SignedPart, signedSum } from '@/curriculum/math/shared/signedSum'

interface Basic {
  render: (m: number) => string
  /** Derivative as (sign factor, LaTeX renderer, plain-text expression). */
  sign: 1 | -1
  renderDerivative: (m: number) => string
  derivative: string
}

const basics: Basic[] = [
  { render: (m) => `${coefficientTex(m)}\\sin x`, sign: 1, renderDerivative: (m) => `${coefficientTex(m)}\\cos x`, derivative: 'cos(x)' },
  { render: (m) => `${coefficientTex(m)}\\cos x`, sign: -1, renderDerivative: (m) => `${coefficientTex(m)}\\sin x`, derivative: 'sin(x)' },
  { render: (m) => `${coefficientTex(m)}e^{x}`, sign: 1, renderDerivative: (m) => `${coefficientTex(m)}e^{x}`, derivative: 'e^x' },
  { render: (m) => `${coefficientTex(m)}\\ln x`, sign: 1, renderDerivative: (m) => `\\frac{${m}}{x}`, derivative: '1/x' },
]

/** A random combination of sin x, cos x, eˣ and ln x. */
export function generateBasicFunctionProblem(): PracticeProblem {
  const chosen = [...basics].sort(() => Math.random() - 0.5).slice(0, randomInt(2, 3))
  const coefficients = chosen.map(() => randomInt(-6, 6, [0]))

  const f: SignedPart[] = chosen.map((b, i) => ({ coefficient: coefficients[i], render: b.render }))
  const df: SignedPart[] = chosen.map((b, i) => ({ coefficient: coefficients[i] * b.sign, render: b.renderDerivative }))
  const expected = chosen.map((b, i) => `(${coefficients[i] * b.sign})*${b.derivative}`).join(' + ')

  return {
    prompt: (
      <>
        Differentiate <Tex>{`f(x) = ${signedSum(f)}`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{"f'(x) ="}</Tex>,
    placeholder: 'e.g. 3cos(x) + 2/x',
    answer: <Tex>{signedSum(df)}</Tex>,
    check: expressionAnswer(expected),
    explanation: (
      <>
        Differentiate term by term. Watch the sign: <Tex>{String.raw`\frac{d}{dx}\cos x = -\sin x`}</Tex>.
        <Tex block>{`f'(x) = ${signedSum(df)}`}</Tex>
      </>
    ),
  }
}
