import { Tex } from '@/components/math/Tex'
import type { PracticeProblem } from '@/components/quiz/PracticeGenerator'
import { randomInt } from '@/lib/random'
import { expressionAnswer } from '@/curriculum/math/shared/expressionAnswer'
import { polynomialExpression, polynomialTex, type Term } from './polynomial'

/** A random polynomial of degree 2–5 to differentiate term by term. */
export function generatePolynomialProblem(): PracticeProblem {
  const degree = randomInt(2, 5)
  const terms: Term[] = []
  for (let power = degree; power >= 0; power--) {
    const keep = power === degree || Math.random() < 0.7
    terms.push({ coefficient: keep ? randomInt(-9, 9, [0]) : 0, power })
  }
  const derivative = terms.filter((t) => t.power > 0).map((t) => ({ coefficient: t.coefficient * t.power, power: t.power - 1 }))

  return {
    prompt: (
      <>
        Differentiate <Tex>{`f(x) = ${polynomialTex(terms)}`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{"f'(x) ="}</Tex>,
    placeholder: 'e.g. 6x^2 - 4x + 1',
    answer: <Tex>{polynomialTex(derivative)}</Tex>,
    check: expressionAnswer(polynomialExpression(derivative)),
    explanation: (
      <>
        Term by term: bring each exponent down, lower it by one, and the constant term disappears.
        <Tex block>{`f'(x) = ${polynomialTex(derivative)}`}</Tex>
      </>
    ),
  }
}
