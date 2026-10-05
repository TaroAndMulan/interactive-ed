import { Tex } from '@/components/math/Tex'
import { numericAnswer } from '@/components/quiz/checks'
import type { QuizQuestion } from '@/components/quiz/types'
import { expressionAnswer } from '@/curriculum/math/shared/expressionAnswer'

export const questions: QuizQuestion[] = [
  {
    id: 'polynomial',
    kind: 'input',
    prompt: (
      <>
        Find <Tex>{String.raw`\frac{d}{dx}\left[4x^3 - 5x^2 + 7x - 9\right]`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{'='}</Tex>,
    placeholder: 'an expression in x',
    answer: <Tex>{'12x^2 - 10x + 7'}</Tex>,
    check: expressionAnswer('12x^2 - 10x + 7'),
    explanation: <>Power rule on each term; the constant −9 has derivative 0.</>,
  },
  {
    id: 'pi-squared',
    kind: 'choice',
    prompt: (
      <>
        <Tex>{String.raw`\frac{d}{dx}\left[\pi^2\right] =`}</Tex>
      </>
    ),
    choices: [
      { id: '2pi', label: <Tex>{String.raw`2\pi`}</Tex> },
      { id: '0', label: <Tex>0</Tex> },
      { id: 'pi2', label: <Tex>{String.raw`\pi^2`}</Tex> },
      { id: '2pix', label: <Tex>{String.raw`2\pi x`}</Tex> },
    ],
    answer: '0',
    explanation: <>π² is a number (about 9.87), not a function of x. The derivative of any constant is 0.</>,
  },
  {
    id: 'evaluate',
    kind: 'input',
    prompt: (
      <>
        If <Tex>{'f(x) = 2x^4 - 3x + 1'}</Tex>, find <Tex>{"f'(1)"}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{"f'(1) ="}</Tex>,
    placeholder: 'a number',
    answer: <Tex>5</Tex>,
    check: numericAnswer(5, 0.001),
    explanation: <Tex block>{String.raw`f'(x) = 8x^3 - 3 \quad\Rightarrow\quad f'(1) = 8 - 3 = 5`}</Tex>,
  },
  {
    id: 'rules-abstract',
    kind: 'choice',
    prompt: (
      <>
        <Tex>{'g(x) = 5f(x) - 2'}</Tex> and <Tex>{"f'(3) = 4"}</Tex>. What is <Tex>{"g'(3)"}</Tex>?
      </>
    ),
    choices: [
      { id: '18', label: <Tex>18</Tex> },
      { id: '20', label: <Tex>20</Tex> },
      { id: '4', label: <Tex>4</Tex> },
      { id: '2', label: <Tex>2</Tex> },
    ],
    answer: '20',
    explanation: (
      <>
        <Tex>{"g'(x) = 5f'(x) - 0"}</Tex>, so <Tex>{"g'(3) = 5 \\cdot 4 = 20"}</Tex>.
      </>
    ),
  },
  {
    id: 'expand-first',
    kind: 'input',
    prompt: (
      <>
        Differentiate <Tex>{'y = x(x + 2)^2'}</Tex>. (Hint: expand first.)
      </>
    ),
    inputPrefix: <Tex>{String.raw`\frac{dy}{dx} =`}</Tex>,
    placeholder: 'an expression in x',
    answer: <Tex>{'3x^2 + 8x + 4'}</Tex>,
    check: expressionAnswer('3x^2 + 8x + 4'),
    explanation: (
      <>
        <Tex>{'x(x+2)^2 = x^3 + 4x^2 + 4x'}</Tex>, so the derivative is <Tex>{'3x^2 + 8x + 4'}</Tex>.
      </>
    ),
  },
  {
    id: 'horizontal-tangents',
    kind: 'choice',
    prompt: (
      <>
        Where does <Tex>{'f(x) = x^3 - 12x'}</Tex> have a horizontal tangent line?
      </>
    ),
    choices: [
      { id: '0', label: <Tex>{'x = 0'}</Tex> },
      { id: 'pm2', label: <Tex>{String.raw`x = \pm 2`}</Tex> },
      { id: 'pm12', label: <Tex>{String.raw`x = \pm\sqrt{12}`}</Tex> },
      { id: '4', label: <Tex>{'x = 4'}</Tex> },
    ],
    answer: 'pm2',
    explanation: (
      <>
        Horizontal tangent ⇔ slope 0: <Tex>{String.raw`f'(x) = 3x^2 - 12 = 0 \Rightarrow x = \pm 2`}</Tex>.
      </>
    ),
  },
]
