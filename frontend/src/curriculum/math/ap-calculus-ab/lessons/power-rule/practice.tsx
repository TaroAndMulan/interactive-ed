import { Tex } from '@/components/math/Tex'
import type { PracticeProblem } from '@/components/quiz/PracticeGenerator'
import { pick, randomInt } from '@/lib/random'
import { expressionAnswer } from '@/curriculum/math/shared/expressionAnswer'

interface Template {
  /** LaTeX of the function, its rewritten power form, and the derivative. */
  build: (k: number, n: number) => { tex: string; rewritten: string; derivativeTex: string; expected: string }
}

const coefficient = (k: number) => (k === 1 ? '' : k === -1 ? '-' : `${k}`)

const templates: Template[] = [
  {
    build: (k, n) => ({
      tex: `${coefficient(k)}x^{${n}}`,
      rewritten: `${coefficient(k)}x^{${n}}`,
      derivativeTex: `${k * n}x${n - 1 === 1 ? '' : `^{${n - 1}}`}`,
      expected: `${k * n}*x^(${n - 1})`,
    }),
  },
  {
    build: (k, n) => ({
      tex: String.raw`\frac{${k}}{x^{${n}}}`,
      rewritten: `${k}x^{-${n}}`,
      derivativeTex: String.raw`${-k * n}x^{-${n + 1}} = ${-k * n < 0 ? '-' : ''}\frac{${Math.abs(k * n)}}{x^{${n + 1}}}`,
      expected: `${-k * n}*x^(-${n + 1})`,
    }),
  },
  {
    build: (k) => ({
      tex: `${coefficient(k)}\\sqrt{x}`,
      rewritten: `${coefficient(k)}x^{1/2}`,
      derivativeTex: String.raw`\frac{${k}}{2}x^{-1/2} = \frac{${k}}{2\sqrt{x}}`,
      expected: `${k}/(2*sqrt(x))`,
    }),
  },
  {
    build: (k) => ({
      tex: `${coefficient(k)}\\sqrt[3]{x^2}`,
      rewritten: `${coefficient(k)}x^{2/3}`,
      derivativeTex: String.raw`\frac{${2 * k}}{3}x^{-1/3}`,
      expected: `(${2 * k}/3)*x^(-1/3)`,
    }),
  },
]

/** d/dx of k·xⁿ in its many disguises: roots, reciprocals, plain powers. */
export function generatePowerProblem(): PracticeProblem {
  const template = pick(templates)
  const { tex, rewritten, derivativeTex, expected } = template.build(randomInt(-6, 9, [0]), randomInt(2, 6))
  return {
    prompt: (
      <>
        Differentiate <Tex>{`f(x) = ${tex}`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{"f'(x) ="}</Tex>,
    placeholder: 'e.g. 3x^2 or -2/x^3',
    answer: <Tex>{derivativeTex}</Tex>,
    check: expressionAnswer(expected),
    explanation: (
      <>
        Rewrite as a power, then bring the exponent down and subtract 1:
        <Tex block>{`f(x) = ${rewritten} \\quad\\Rightarrow\\quad f'(x) = ${derivativeTex}`}</Tex>
      </>
    ),
  }
}
