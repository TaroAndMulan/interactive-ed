import { Tex } from '@/components/math/Tex'
import { numericAnswer } from '@/components/quiz/checks'
import type { QuizQuestion } from '@/components/quiz/types'

export const questions: QuizQuestion[] = [
  {
    id: 'abs',
    kind: 'choice',
    prompt: (
      <>
        At <Tex>x = 3</Tex>, the function <Tex>f(x) = |x - 3|</Tex> is…
      </>
    ),
    choices: [
      { id: 'both', label: 'continuous and differentiable' },
      { id: 'cont', label: 'continuous but not differentiable' },
      { id: 'diff', label: 'differentiable but not continuous' },
      { id: 'neither', label: 'neither continuous nor differentiable' },
    ],
    answer: 'cont',
    explanation: (
      <>
        The graph has no break at 3, but it has a corner there: the slope is −1 from the left and +1 from the right.
        (&ldquo;Differentiable but not continuous&rdquo; can never happen.)
      </>
    ),
  },
  {
    id: 'must-be-true',
    kind: 'choice',
    prompt: (
      <>
        If <Tex>f</Tex> is differentiable at <Tex>x = 2</Tex>, which statement <strong>must</strong> be true?
      </>
    ),
    choices: [
      { id: 'zero', label: <Tex>{"f'(2) = 0"}</Tex> },
      { id: 'cont', label: <><Tex>f</Tex> is continuous at <Tex>x = 2</Tex></> },
      { id: 'value', label: <Tex>f(2) = 0</Tex> },
      { id: 'everywhere', label: <><Tex>f</Tex> is differentiable everywhere</> },
    ],
    answer: 'cont',
    explanation: <>Differentiability at a point implies continuity at that point. Nothing forces any particular value.</>,
  },
  {
    id: 'converse',
    kind: 'choice',
    prompt: (
      <>
        True or false: if <Tex>f</Tex> is continuous at <Tex>x = c</Tex>, then <Tex>f</Tex> is differentiable at{' '}
        <Tex>x = c</Tex>.
      </>
    ),
    choices: [
      { id: 'true', label: 'True' },
      { id: 'false', label: 'False' },
    ],
    answer: 'false',
    explanation: (
      <>
        False. <Tex>|x|</Tex> is continuous at 0 but has a corner there. Continuity is necessary for differentiability,
        but not sufficient.
      </>
    ),
  },
  {
    id: 'which-fails',
    kind: 'choice',
    prompt: (
      <>
        Which function is <strong>not</strong> differentiable at <Tex>x = 0</Tex>?
      </>
    ),
    choices: [
      { id: 'cube', label: <Tex>{'x^3'}</Tex> },
      { id: 'cbrt', label: <Tex>{String.raw`\sqrt[3]{x}`}</Tex> },
      { id: 'sin', label: <Tex>{String.raw`\sin x`}</Tex> },
      { id: 'exp', label: <Tex>{'e^x'}</Tex> },
    ],
    answer: 'cbrt',
    explanation: (
      <>
        <Tex>{String.raw`\sqrt[3]{x}`}</Tex> has a vertical tangent at 0: its slope{' '}
        <Tex>{String.raw`\frac{1}{3x^{2/3}}`}</Tex> grows without bound.
      </>
    ),
  },
  {
    id: 'piecewise',
    kind: 'input',
    prompt: (
      <>
        <Tex>{String.raw`g(x) = \begin{cases} kx^2 & x \le 2 \\ 8x + m & x > 2 \end{cases}`}</Tex> is differentiable at{' '}
        <Tex>x = 2</Tex>. Find <Tex>m</Tex>.
      </>
    ),
    inputPrefix: <Tex>{'m ='}</Tex>,
    placeholder: 'a number',
    answer: <Tex>-8</Tex>,
    check: numericAnswer(-8, 0.001),
    explanation: (
      <>
        Matching slopes: <Tex>{String.raw`2k(2) = 8 \Rightarrow k = 2`}</Tex>. Continuity:{' '}
        <Tex>{String.raw`k(2)^2 = 8(2) + m \Rightarrow 8 = 16 + m \Rightarrow m = -8`}</Tex>.
      </>
    ),
  },
]
