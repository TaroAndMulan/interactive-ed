import { Tex } from '@/components/math/Tex'
import { numericAnswer } from '@/components/quiz/checks'
import type { QuizQuestion } from '@/components/quiz/types'
import { expressionAnswer } from '@/curriculum/math/shared/expressionAnswer'

export const questions: QuizQuestion[] = [
  {
    id: 'limit-tan',
    kind: 'input',
    prompt: (
      <>
        Evaluate <Tex>{String.raw`\displaystyle\lim_{x \to \pi/3}\frac{\tan x - \sqrt{3}}{x - \pi/3}`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{'='}</Tex>,
    placeholder: 'a number',
    answer: <Tex>4</Tex>,
    check: numericAnswer(4, 0.001),
    explanation: (
      <>
        This is <Tex>{"f'(\\pi/3)"}</Tex> for <Tex>f(x) = \tan x</Tex>:{' '}
        <Tex>{String.raw`\sec^2\tfrac{\pi}{3} = \frac{1}{(1/2)^2} = 4`}</Tex>.
      </>
    ),
  },
  {
    id: 'product-value',
    kind: 'input',
    prompt: (
      <>
        If <Tex>{'f(x) = (x^2 + 1)(x^3 - 2)'}</Tex>, find <Tex>{"f'(1)"}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{"f'(1) ="}</Tex>,
    placeholder: 'a number',
    answer: <Tex>4</Tex>,
    check: numericAnswer(4, 0.001),
    explanation: <Tex block>{String.raw`f'(x) = 2x(x^3 - 2) + (x^2 + 1)(3x^2) \;\Rightarrow\; f'(1) = 2(-1) + 2(3) = 4`}</Tex>,
  },
  {
    id: 'tangent',
    kind: 'input',
    prompt: (
      <>
        Write the equation of the line tangent to <Tex>{'y = x e^x'}</Tex> at <Tex>x = 0</Tex>.
      </>
    ),
    inputPrefix: <Tex>{'y ='}</Tex>,
    placeholder: 'e.g. 2x + 1',
    answer: <Tex>{'x'}</Tex>,
    check: expressionAnswer('x'),
    explanation: (
      <>
        Point <Tex>(0, 0)</Tex>; slope <Tex>{"y' = e^x + xe^x = 1"}</Tex> at 0. So <Tex>y = x</Tex>.
      </>
    ),
  },
  {
    id: 'differentiable',
    kind: 'choice',
    prompt: (
      <>
        Is <Tex>{'g(x) = |x - 2| + x^2'}</Tex> differentiable at <Tex>x = 2</Tex>?
      </>
    ),
    choices: [
      { id: 'yes', label: 'Yes, because it is continuous at 2' },
      { id: 'no', label: 'No: the slopes from the left (3) and right (5) differ' },
      { id: 'yes2', label: <>Yes, because <Tex>{'x^2'}</Tex> is differentiable everywhere</> },
      { id: 'no2', label: 'No, because g is not continuous at 2' },
    ],
    answer: 'no',
    explanation: (
      <>
        Near 2, <Tex>{'x^2'}</Tex> contributes slope 4, while <Tex>{'|x - 2|'}</Tex> contributes −1 from the left and +1
        from the right. So the one-sided slopes are 3 and 5: a corner.
      </>
    ),
  },
  {
    id: 'quotient-value',
    kind: 'input',
    prompt: (
      <>
        If <Tex>{String.raw`f(x) = \frac{\sin x}{1 + \cos x}`}</Tex>, find <Tex>{"f'(0)"}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{"f'(0) ="}</Tex>,
    placeholder: 'a number or fraction',
    answer: <Tex>{String.raw`\frac12`}</Tex>,
    check: numericAnswer(0.5, 0.001),
    explanation: (
      <Tex block>{String.raw`f'(x) = \frac{\cos x(1 + \cos x) - \sin x(-\sin x)}{(1+\cos x)^2} = \frac{1}{1 + \cos x} \;\Rightarrow\; f'(0) = \frac12`}</Tex>
    ),
  },
]
