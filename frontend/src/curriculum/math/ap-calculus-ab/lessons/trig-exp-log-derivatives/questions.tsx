import { Tex } from '@/components/math/Tex'
import { numericAnswer } from '@/components/quiz/checks'
import type { QuizQuestion } from '@/components/quiz/types'
import { expressionAnswer } from '@/curriculum/math/shared/expressionAnswer'

export const questions: QuizQuestion[] = [
  {
    id: 'trig',
    kind: 'input',
    prompt: (
      <>
        Find <Tex>{String.raw`\frac{d}{dx}\left[3\sin x - 2\cos x\right]`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{'='}</Tex>,
    placeholder: 'e.g. cos(x) + sin(x)',
    answer: <Tex>{String.raw`3\cos x + 2\sin x`}</Tex>,
    check: expressionAnswer('3cos(x) + 2sin(x)'),
    explanation: (
      <>
        <Tex>{String.raw`\frac{d}{dx}(-2\cos x) = -2(-\sin x) = 2\sin x`}</Tex>. The two minus signs cancel.
      </>
    ),
  },
  {
    id: 'exp-ln',
    kind: 'input',
    prompt: (
      <>
        Find <Tex>{String.raw`\frac{d}{dx}\left[e^x + \ln x\right]`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{'='}</Tex>,
    placeholder: 'an expression in x',
    answer: <Tex>{String.raw`e^x + \frac{1}{x}`}</Tex>,
    check: expressionAnswer('e^x + 1/x'),
    explanation: <>Each one comes straight from the table of basic derivatives.</>,
  },
  {
    id: 'evaluate',
    kind: 'input',
    prompt: (
      <>
        If <Tex>{String.raw`f(x) = 4\sin x`}</Tex>, find <Tex>{String.raw`f'\!\left(\tfrac{\pi}{3}\right)`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{String.raw`f'\!\left(\tfrac{\pi}{3}\right) =`}</Tex>,
    placeholder: 'a number',
    answer: <Tex>2</Tex>,
    check: numericAnswer(2, 0.001),
    explanation: <Tex block>{String.raw`f'(x) = 4\cos x \quad\Rightarrow\quad f'\!\left(\tfrac{\pi}{3}\right) = 4 \cdot \tfrac12 = 2`}</Tex>,
  },
  {
    id: 'own-derivative',
    kind: 'choice',
    prompt: <>Which function is equal to its own derivative?</>,
    choices: [
      { id: '2x', label: <Tex>{'2^x'}</Tex> },
      { id: 'ex', label: <Tex>{'e^x'}</Tex> },
      { id: 'xe', label: <Tex>{'x^e'}</Tex> },
      { id: 'ln', label: <Tex>{String.raw`\ln x`}</Tex> },
    ],
    answer: 'ex',
    explanation: (
      <>
        <Tex>{'2^x'}</Tex> has slope <Tex>{String.raw`(\ln 2)\,2^x \approx 0.69 \cdot 2^x`}</Tex>. Only base{' '}
        <Tex>e</Tex> makes the factor exactly 1.
      </>
    ),
  },
  {
    id: 'tangent-ln',
    kind: 'choice',
    prompt: (
      <>
        Which is the line tangent to <Tex>{String.raw`y = \ln x`}</Tex> at <Tex>x = 1</Tex>?
      </>
    ),
    choices: [
      { id: 'a', label: <Tex>{'y = x'}</Tex> },
      { id: 'b', label: <Tex>{'y = x - 1'}</Tex> },
      { id: 'c', label: <Tex>{'y = x + 1'}</Tex> },
      { id: 'd', label: <Tex>{'y = 0'}</Tex> },
    ],
    answer: 'b',
    explanation: (
      <>
        Point <Tex>(1, \ln 1) = (1, 0)</Tex>; slope <Tex>{String.raw`\frac{1}{1} = 1`}</Tex>. So <Tex>y = x - 1</Tex>.
      </>
    ),
  },
  {
    id: 'limit',
    kind: 'choice',
    prompt: (
      <>
        Evaluate <Tex>{String.raw`\displaystyle\lim_{h \to 0}\frac{\sin(\pi + h) - \sin \pi}{h}`}</Tex>.
      </>
    ),
    choices: [
      { id: '0', label: <Tex>0</Tex> },
      { id: '1', label: <Tex>1</Tex> },
      { id: '-1', label: <Tex>-1</Tex> },
      { id: 'dne', label: 'Does not exist' },
    ],
    answer: '-1',
    explanation: (
      <>
        It is the derivative of <Tex>\sin x</Tex> at <Tex>\pi</Tex>: <Tex>{String.raw`\cos\pi = -1`}</Tex>.
      </>
    ),
  },
]
