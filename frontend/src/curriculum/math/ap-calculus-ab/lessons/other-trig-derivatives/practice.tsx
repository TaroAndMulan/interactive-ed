import { Tex } from '@/components/math/Tex'
import type { PracticeProblem } from '@/components/quiz/PracticeGenerator'
import { randomInt } from '@/lib/random'
import { expressionAnswer } from '@/curriculum/math/shared/expressionAnswer'
import { coefficientTex, type SignedPart, signedSum } from '@/curriculum/math/shared/signedSum'

const trig = [
  { tex: '\\tan x', sign: 1, dtex: '\\sec^2 x', expr: 'sec(x)^2' },
  { tex: '\\sec x', sign: 1, dtex: '\\sec x\\tan x', expr: 'sec(x)*tan(x)' },
  { tex: '\\cot x', sign: -1, dtex: '\\csc^2 x', expr: 'csc(x)^2' },
  { tex: '\\csc x', sign: -1, dtex: '\\csc x\\cot x', expr: 'csc(x)*cot(x)' },
  { tex: '\\sin x', sign: 1, dtex: '\\cos x', expr: 'cos(x)' },
  { tex: '\\cos x', sign: -1, dtex: '\\sin x', expr: 'sin(x)' },
] as const

/** Two random trig terms with integer coefficients. */
export function generateTrigProblem(): PracticeProblem {
  const first = randomInt(0, 3)
  const second = randomInt(0, trig.length - 1, [first])
  const terms = [trig[first], trig[second]]
  const coefficients = terms.map(() => randomInt(-5, 5, [0]))

  const f: SignedPart[] = terms.map((t, i) => ({ coefficient: coefficients[i], render: (m) => `${coefficientTex(m)}${t.tex}` }))
  const df: SignedPart[] = terms.map((t, i) => ({
    coefficient: coefficients[i] * t.sign,
    render: (m) => `${coefficientTex(m)}${t.dtex}`,
  }))
  const expected = terms.map((t, i) => `(${coefficients[i] * t.sign})*${t.expr}`).join(' + ')

  return {
    prompt: (
      <>
        Differentiate <Tex>{`f(x) = ${signedSum(f)}`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{"f'(x) ="}</Tex>,
    placeholder: 'e.g. 2sec(x)^2 - csc(x)cot(x)',
    answer: <Tex>{signedSum(df)}</Tex>,
    check: expressionAnswer(expected),
    explanation: (
      <>
        Term by term. Remember the &ldquo;co-&rdquo; functions (cos, cot, csc) have negative derivatives.
        <Tex block>{`f'(x) = ${signedSum(df)}`}</Tex>
      </>
    ),
  }
}
