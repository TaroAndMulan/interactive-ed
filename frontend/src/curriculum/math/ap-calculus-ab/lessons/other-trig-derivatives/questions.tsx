import { Tex } from '@/components/math/Tex'
import { numericAnswer } from '@/components/quiz/checks'
import type { QuizQuestion } from '@/components/quiz/types'
import { expressionAnswer } from '@/curriculum/math/shared/expressionAnswer'

export const questions: QuizQuestion[] = [
  {
    id: 'combo',
    kind: 'input',
    prompt: (
      <>
        Find <Tex>{String.raw`\frac{d}{dx}\left[\tan x - 4\sec x\right]`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{'='}</Tex>,
    placeholder: 'e.g. sec(x)^2 - ...',
    answer: <Tex>{String.raw`\sec^2 x - 4\sec x\tan x`}</Tex>,
    check: expressionAnswer('sec(x)^2 - 4 sec(x) tan(x)'),
    explanation: <>Use the table: <Tex>{String.raw`(\tan x)' = \sec^2 x`}</Tex> and <Tex>{String.raw`(\sec x)' = \sec x\tan x`}</Tex>.</>,
  },
  {
    id: 'tan-pi4',
    kind: 'input',
    prompt: (
      <>
        If <Tex>{String.raw`f(x) = \tan x`}</Tex>, find <Tex>{String.raw`f'\!\left(\tfrac{\pi}{4}\right)`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{String.raw`f'\!\left(\tfrac{\pi}{4}\right) =`}</Tex>,
    placeholder: 'a number',
    answer: <Tex>2</Tex>,
    check: numericAnswer(2, 0.001),
    explanation: <Tex block>{String.raw`\sec^2\tfrac{\pi}{4} = \frac{1}{\cos^2\tfrac{\pi}{4}} = \frac{1}{1/2} = 2`}</Tex>,
  },
  {
    id: 'always-negative',
    kind: 'choice',
    prompt: <>Which function has a negative derivative everywhere it is defined?</>,
    choices: [
      { id: 'tan', label: <Tex>{String.raw`\tan x`}</Tex> },
      { id: 'sec', label: <Tex>{String.raw`\sec x`}</Tex> },
      { id: 'cot', label: <Tex>{String.raw`\cot x`}</Tex> },
      { id: 'sin', label: <Tex>{String.raw`\sin x`}</Tex> },
    ],
    answer: 'cot',
    explanation: (
      <>
        <Tex>{String.raw`(\cot x)' = -\csc^2 x`}</Tex>, and a square is never negative, so the derivative is always
        negative. (By the same reasoning, <Tex>\tan x</Tex> is always increasing.)
      </>
    ),
  },
  {
    id: 'product',
    kind: 'input',
    prompt: (
      <>
        Find <Tex>{String.raw`\frac{d}{dx}\left[x\tan x\right]`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{'='}</Tex>,
    placeholder: 'an expression in x',
    answer: <Tex>{String.raw`\tan x + x\sec^2 x`}</Tex>,
    check: expressionAnswer('tan(x) + x sec(x)^2'),
    explanation: <>Product rule: <Tex>{String.raw`1\cdot\tan x + x\cdot\sec^2 x`}</Tex>.</>,
  },
  {
    id: 'sec-at-0',
    kind: 'choice',
    prompt: (
      <>
        What is the slope of <Tex>{String.raw`y = \sec x`}</Tex> at <Tex>x = 0</Tex>?
      </>
    ),
    choices: [
      { id: '0', label: <Tex>0</Tex> },
      { id: '1', label: <Tex>1</Tex> },
      { id: '-1', label: <Tex>-1</Tex> },
      { id: 'undef', label: 'Undefined' },
    ],
    answer: '0',
    explanation: <Tex block>{String.raw`\sec 0 \cdot \tan 0 = 1 \cdot 0 = 0`}</Tex>,
  },
  {
    id: 'csc',
    kind: 'choice',
    prompt: (
      <>
        <Tex>{String.raw`\frac{d}{dx}\left[\csc x\right] =`}</Tex>
      </>
    ),
    choices: [
      { id: 'a', label: <Tex>{String.raw`\csc x\cot x`}</Tex> },
      { id: 'b', label: <Tex>{String.raw`-\csc x\cot x`}</Tex> },
      { id: 'c', label: <Tex>{String.raw`-\csc^2 x`}</Tex> },
      { id: 'd', label: <Tex>{String.raw`\sec x\tan x`}</Tex> },
    ],
    answer: 'b',
    explanation: (
      <>
        <Tex>{String.raw`\csc x = \frac{1}{\sin x}`}</Tex>; the quotient rule gives{' '}
        <Tex>{String.raw`\frac{0 - \cos x}{\sin^2 x} = -\csc x\cot x`}</Tex>.
      </>
    ),
  },
]
