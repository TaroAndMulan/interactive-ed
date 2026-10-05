import { Tex } from '@/components/math/Tex'
import { numericAnswer } from '@/components/quiz/checks'
import type { QuizQuestion } from '@/components/quiz/types'
import { expressionAnswer } from '@/curriculum/math/shared/expressionAnswer'

export const questions: QuizQuestion[] = [
  {
    id: 'x2sin',
    kind: 'input',
    prompt: (
      <>
        Find <Tex>{String.raw`\frac{d}{dx}\left[x^2\sin x\right]`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{'='}</Tex>,
    placeholder: 'e.g. 2x sin(x) + ...',
    answer: <Tex>{String.raw`2x\sin x + x^2\cos x`}</Tex>,
    check: expressionAnswer('2x sin(x) + x^2 cos(x)'),
    explanation: <Tex block>{String.raw`(x^2)'\sin x + x^2(\sin x)' = 2x\sin x + x^2\cos x`}</Tex>,
  },
  {
    id: 'xex',
    kind: 'input',
    prompt: (
      <>
        Find <Tex>{String.raw`\frac{d}{dx}\left[x e^x\right]`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{'='}</Tex>,
    placeholder: 'an expression in x',
    answer: <Tex>{String.raw`e^x + xe^x`}</Tex>,
    check: expressionAnswer('e^x + x e^x'),
    explanation: <Tex block>{String.raw`1 \cdot e^x + x \cdot e^x = e^x(1 + x)`}</Tex>,
  },
  {
    id: 'table',
    kind: 'input',
    prompt: (
      <>
        <Tex>{"f(2) = 3,\\ f'(2) = -1,\\ g(2) = 4,\\ g'(2) = 5"}</Tex>. If <Tex>{'h(x) = f(x)g(x)'}</Tex>, find{' '}
        <Tex>{"h'(2)"}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{"h'(2) ="}</Tex>,
    placeholder: 'a number',
    answer: <Tex>11</Tex>,
    check: numericAnswer(11, 0.001),
    explanation: <Tex block>{String.raw`h'(2) = f'(2)g(2) + f(2)g'(2) = (-1)(4) + (3)(5) = 11`}</Tex>,
  },
  {
    id: 'misconception',
    kind: 'choice',
    prompt: (
      <>
        A student claims <Tex>{"(fg)' = f'g'"}</Tex>. Which example shows the claim is false?
      </>
    ),
    choices: [
      { id: 'xx', label: <><Tex>{'f = g = x'}</Tex>: <Tex>{"(x^2)' = 2x"}</Tex> but <Tex>{"f'g' = 1"}</Tex></> },
      { id: 'const', label: <><Tex>{'f = g = 3'}</Tex>: both sides are 0</> },
      { id: 'xone', label: <><Tex>{'f = x,\\ g = 1'}</Tex>: both sides are 0</> },
      { id: 'none', label: 'The claim is true' },
    ],
    answer: 'xx',
    explanation: <>One counterexample is enough. With f = g = x the product is x², whose derivative 2x is not 1.</>,
  },
  {
    id: 'at-zero',
    kind: 'input',
    prompt: (
      <>
        If <Tex>{String.raw`y = e^x\cos x`}</Tex>, find <Tex>{String.raw`\left.\frac{dy}{dx}\right|_{x=0}`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{"y'(0) ="}</Tex>,
    placeholder: 'a number',
    answer: <Tex>1</Tex>,
    check: numericAnswer(1, 0.001),
    explanation: <Tex block>{String.raw`y' = e^x\cos x - e^x\sin x \;\Rightarrow\; y'(0) = 1\cdot 1 - 1 \cdot 0 = 1`}</Tex>,
  },
  {
    id: 'xlnx',
    kind: 'choice',
    prompt: (
      <>
        <Tex>{String.raw`\frac{d}{dx}\left[x\ln x\right] =`}</Tex>
      </>
    ),
    choices: [
      { id: 'a', label: <Tex>{String.raw`\frac{1}{x}`}</Tex> },
      { id: 'b', label: <Tex>{String.raw`\ln x + 1`}</Tex> },
      { id: 'c', label: <Tex>{String.raw`\ln x`}</Tex> },
      { id: 'd', label: <Tex>{String.raw`x + \ln x`}</Tex> },
    ],
    answer: 'b',
    explanation: <Tex block>{String.raw`1\cdot\ln x + x \cdot \frac{1}{x} = \ln x + 1`}</Tex>,
  },
]
