import { Tex } from '@/components/math/Tex'
import { numericAnswer } from '@/components/quiz/checks'
import type { QuizQuestion } from '@/components/quiz/types'
import { expressionAnswer } from '@/curriculum/math/shared/expressionAnswer'

export const questions: QuizQuestion[] = [
  {
    id: 'x7',
    kind: 'input',
    prompt: (
      <>
        Find <Tex>{String.raw`\frac{d}{dx}\left[x^7\right]`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{'='}</Tex>,
    placeholder: 'an expression in x',
    answer: <Tex>{'7x^6'}</Tex>,
    check: expressionAnswer('7x^6'),
    explanation: <>Bring the 7 down and lower the exponent by one.</>,
  },
  {
    id: 'reciprocal',
    kind: 'input',
    prompt: (
      <>
        Find <Tex>{String.raw`\frac{d}{dx}\left[\frac{1}{x^4}\right]`}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{'='}</Tex>,
    placeholder: 'e.g. -2/x^3',
    answer: <Tex>{String.raw`-4x^{-5} = -\frac{4}{x^5}`}</Tex>,
    check: expressionAnswer('-4x^(-5)'),
    explanation: (
      <>
        <Tex>{String.raw`\frac{1}{x^4} = x^{-4}`}</Tex>, and <Tex>{'-4 - 1 = -5'}</Tex>.
      </>
    ),
  },
  {
    id: 'sqrt-at-9',
    kind: 'input',
    prompt: (
      <>
        If <Tex>{String.raw`f(x) = \sqrt{x}`}</Tex>, find <Tex>{"f'(9)"}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{"f'(9) ="}</Tex>,
    placeholder: 'a number or fraction',
    answer: <Tex>{String.raw`\frac{1}{6}`}</Tex>,
    check: numericAnswer(1 / 6, 0.002),
    explanation: (
      <Tex block>{String.raw`f'(x) = \tfrac12 x^{-1/2} = \frac{1}{2\sqrt{x}} \quad\Rightarrow\quad f'(9) = \frac{1}{2 \cdot 3} = \frac16`}</Tex>
    ),
  },
  {
    id: 'first-step',
    kind: 'choice',
    prompt: (
      <>
        What is the best first step to differentiate <Tex>{String.raw`\frac{1}{\sqrt[3]{x}}`}</Tex>?
      </>
    ),
    choices: [
      { id: 'rewrite', label: <>Rewrite it as <Tex>{'x^{-1/3}'}</Tex></> },
      { id: 'reciprocal', label: <>Differentiate the denominator and take the reciprocal</> },
      { id: 'cube', label: <>Rewrite it as <Tex>{'x^{-3}'}</Tex></> },
      { id: 'none', label: 'The power rule does not apply to roots' },
    ],
    answer: 'rewrite',
    explanation: (
      <>
        <Tex>{String.raw`\frac{1}{\sqrt[3]{x}} = x^{-1/3}`}</Tex>, so the derivative is{' '}
        <Tex>{String.raw`-\tfrac13 x^{-4/3}`}</Tex>. The power rule works for every real exponent.
      </>
    ),
  },
  {
    id: 'three-halves',
    kind: 'input',
    prompt: (
      <>
        If <Tex>{'f(x) = x^{3/2}'}</Tex>, find <Tex>{"f'(4)"}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{"f'(4) ="}</Tex>,
    placeholder: 'a number',
    answer: <Tex>3</Tex>,
    check: numericAnswer(3, 0.001),
    explanation: <Tex block>{String.raw`f'(x) = \tfrac32 x^{1/2} \quad\Rightarrow\quad f'(4) = \tfrac32 \cdot 2 = 3`}</Tex>,
  },
  {
    id: 'error',
    kind: 'choice',
    prompt: (
      <>
        A student writes <Tex>{String.raw`\frac{d}{dx}\left[x^{-2}\right] = -2x^{-1}`}</Tex>. What went wrong?
      </>
    ),
    choices: [
      { id: 'sign', label: 'The coefficient should be +2' },
      { id: 'exponent', label: <>Subtracting 1 from −2 gives −3, not −1</> },
      { id: 'nothing', label: 'Nothing; it is correct' },
      { id: 'rule', label: 'The power rule only works for positive exponents' },
    ],
    answer: 'exponent',
    explanation: (
      <>
        <Tex>{String.raw`\frac{d}{dx}\left[x^{-2}\right] = -2x^{-3}`}</Tex>. With negative exponents, &ldquo;subtract
        one&rdquo; moves further from zero.
      </>
    ),
  },
]
