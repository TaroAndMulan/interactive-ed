import { Tex } from '@/components/math/Tex'
import { numericAnswer } from '@/components/quiz/checks'
import type { QuizQuestion } from '@/components/quiz/types'
import { expressionAnswer } from '@/curriculum/math/shared/expressionAnswer'

export const questions: QuizQuestion[] = [
  {
    id: 'sinx-over-x',
    kind: 'input',
    prompt: (
      <>
        Find <Tex>{String.raw`\frac{d}{dx}\left[\frac{\sin x}{x}\right]`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{'='}</Tex>,
    placeholder: 'e.g. (x cos(x) - sin(x))/x^2',
    answer: <Tex>{String.raw`\frac{x\cos x - \sin x}{x^2}`}</Tex>,
    check: expressionAnswer('(x cos(x) - sin(x))/x^2'),
    explanation: <Tex block>{String.raw`\frac{(\cos x)(x) - (\sin x)(1)}{x^2}`}</Tex>,
  },
  {
    id: 'rational',
    kind: 'input',
    prompt: (
      <>
        Find <Tex>{String.raw`\frac{d}{dx}\left[\frac{x^2 + 1}{x - 1}\right]`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{'='}</Tex>,
    placeholder: 'any equivalent form',
    answer: <Tex>{String.raw`\frac{x^2 - 2x - 1}{(x-1)^2}`}</Tex>,
    check: expressionAnswer('(x^2 - 2x - 1)/(x - 1)^2'),
    explanation: <Tex block>{String.raw`\frac{2x(x-1) - (x^2+1)(1)}{(x-1)^2} = \frac{x^2 - 2x - 1}{(x-1)^2}`}</Tex>,
  },
  {
    id: 'table',
    kind: 'input',
    prompt: (
      <>
        <Tex>{"f(1) = 2,\\ f'(1) = 3,\\ g(1) = 4,\\ g'(1) = -1"}</Tex>. If <Tex>{String.raw`h(x) = \frac{f(x)}{g(x)}`}</Tex>,
        find <Tex>{"h'(1)"}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{"h'(1) ="}</Tex>,
    placeholder: 'a number or fraction',
    answer: <Tex>{String.raw`\frac{7}{8}`}</Tex>,
    check: numericAnswer(7 / 8, 0.001),
    explanation: <Tex block>{String.raw`\frac{f'(1)g(1) - f(1)g'(1)}{g(1)^2} = \frac{(3)(4) - (2)(-1)}{16} = \frac{14}{16} = \frac78`}</Tex>,
  },
  {
    id: 'which-rule',
    kind: 'choice',
    prompt: (
      <>
        Which is the correct quotient rule for <Tex>{String.raw`\left(\frac{f}{g}\right)'`}</Tex>?
      </>
    ),
    choices: [
      { id: 'right', label: <Tex>{String.raw`\frac{f'g - fg'}{g^2}`}</Tex> },
      { id: 'flipped', label: <Tex>{String.raw`\frac{fg' - f'g}{g^2}`}</Tex> },
      { id: 'naive', label: <Tex>{String.raw`\frac{f'}{g'}`}</Tex> },
      { id: 'nosquare', label: <Tex>{String.raw`\frac{f'g - fg'}{g}`}</Tex> },
    ],
    answer: 'right',
    explanation: <>&ldquo;Low d-high minus high d-low, over the square of what&rsquo;s below.&rdquo; Order matters because of the minus sign.</>,
  },
  {
    id: 'simplify-first',
    kind: 'choice',
    prompt: (
      <>
        What is the most efficient way to differentiate <Tex>{String.raw`\frac{x^3 + 2x}{x}`}</Tex>?
      </>
    ),
    choices: [
      { id: 'quotient', label: 'Use the quotient rule' },
      { id: 'simplify', label: <>Simplify to <Tex>{'x^2 + 2'}</Tex> first, then use the power rule</> },
      { id: 'product', label: 'Use the product rule' },
      { id: 'limit', label: 'Use the limit definition' },
    ],
    answer: 'simplify',
    explanation: (
      <>
        Dividing first gives <Tex>{'x^2 + 2'}</Tex> (for <Tex>{String.raw`x \ne 0`}</Tex>), whose derivative is{' '}
        <Tex>2x</Tex>. The quotient rule gives the same answer with much more work.
      </>
    ),
  },
  {
    id: 'ex-over-x',
    kind: 'input',
    prompt: (
      <>
        If <Tex>{String.raw`f(x) = \frac{e^x}{x}`}</Tex>, find <Tex>{"f'(1)"}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{"f'(1) ="}</Tex>,
    placeholder: 'a number',
    answer: <Tex>0</Tex>,
    check: numericAnswer(0, 0.001),
    explanation: <Tex block>{String.raw`f'(x) = \frac{e^x \cdot x - e^x \cdot 1}{x^2} \;\Rightarrow\; f'(1) = \frac{e - e}{1} = 0`}</Tex>,
  },
]
