import { ValueTable } from '@/components/lesson/ValueTable'
import { Tex } from '@/components/math/Tex'
import { numericAnswer } from '@/components/quiz/checks'
import type { PracticeProblem } from '@/components/quiz/PracticeGenerator'
import { fmt, paren } from '@/lib/format'
import { randomInt } from '@/lib/random'

/** AP-style: given f, f′, g, g′ at one x, find the derivative of f·g or f/g there. */
export function generateTableProblem(mode: 'product' | 'quotient'): PracticeProblem {
  const a = randomInt(1, 4)
  const [f, df, dg] = [randomInt(-5, 6), randomInt(-5, 6), randomInt(-5, 6)]
  const g = randomInt(-4, 5, [0])
  const p = (v: number) => paren(String(v))

  const answer = mode === 'product' ? df * g + f * dg : (df * g - f * dg) / g ** 2
  const formula =
    mode === 'product'
      ? String.raw`h'(${a}) = f'(${a})g(${a}) + f(${a})g'(${a}) = ${p(df)}${p(g)} + ${p(f)}${p(dg)} = ${answer}`
      : String.raw`h'(${a}) = \frac{f'(${a})g(${a}) - f(${a})g'(${a})}{g(${a})^2} = \frac{${p(df)}${p(g)} - ${p(f)}${p(dg)}}{${p(g)}^2} = \frac{${df * g - f * dg}}{${g * g}}`

  return {
    prompt: (
      <>
        <p>
          Let <Tex>{mode === 'product' ? 'h(x) = f(x)\\,g(x)' : 'h(x) = \\frac{f(x)}{g(x)}'}</Tex>. Use the table to find{' '}
          <Tex>{`h'(${a})`}</Tex>.
        </p>
        <ValueTable
          rows={[
            { label: 'x', values: [a] },
            { label: 'f(x)', values: [f] },
            { label: "f′(x)", values: [df] },
            { label: 'g(x)', values: [g] },
            { label: "g′(x)", values: [dg] },
          ]}
        />
      </>
    ),
    inputPrefix: <Tex>{`h'(${a}) =`}</Tex>,
    placeholder: 'a number or fraction',
    answer: <Tex>{mode === 'product' ? String(answer) : `${fmt(answer, 4)}`}</Tex>,
    check: numericAnswer(answer, 0.005),
    explanation: <Tex block>{formula}</Tex>,
  }
}
