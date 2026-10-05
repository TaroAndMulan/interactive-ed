import { ValueTable } from '@/components/lesson/ValueTable'
import { Tex } from '@/components/math/Tex'
import { numericAnswer } from '@/components/quiz/checks'
import type { QuizQuestion } from '@/components/quiz/types'

export const questions: QuizQuestion[] = [
  {
    id: 'closest-points',
    kind: 'choice',
    prompt: (
      <>
        Using the table, what is the best estimate of <Tex>{"f'(3.5)"}</Tex>?
        <ValueTable rows={[{ label: 'x', values: [1, 3, 4, 7] }, { label: 'f(x)', values: [2, 8, 9, 15] }]} />
      </>
    ),
    choices: [
      { id: '1', label: <Tex>1</Tex> },
      { id: '2', label: <Tex>2</Tex> },
      { id: '3', label: <Tex>3</Tex> },
      { id: '8.5', label: <Tex>8.5</Tex> },
    ],
    answer: '1',
    explanation: (
      <>
        Use the closest points around 3.5: <Tex>{String.raw`\frac{f(4) - f(3)}{4 - 3} = \frac{9 - 8}{1} = 1`}</Tex>. The
        value 8.5 is an estimate of <Tex>f(3.5)</Tex>, not of the slope.
      </>
    ),
  },
  {
    id: 'symmetric',
    kind: 'input',
    prompt: (
      <>
        Use a symmetric difference quotient to estimate <Tex>{"g'(2)"}</Tex>.
        <ValueTable rows={[{ label: 'x', values: [1.9, 2, 2.1] }, { label: 'g(x)', values: [3.61, 4, 4.41] }]} />
      </>
    ),
    inputPrefix: <Tex>{"g'(2) \\approx"}</Tex>,
    placeholder: 'a number',
    answer: <Tex>4</Tex>,
    check: numericAnswer(4, 0.01),
    explanation: <Tex block>{String.raw`\frac{g(2.1) - g(1.9)}{2.1 - 1.9} = \frac{4.41 - 3.61}{0.2} = 4`}</Tex>,
  },
  {
    id: 'graph-estimate',
    kind: 'input',
    prompt: (
      <>
        The line tangent to the graph of <Tex>f</Tex> at <Tex>x = 2</Tex> passes through the points <Tex>(0, 1)</Tex>{' '}
        and <Tex>(4, 7)</Tex>. Find <Tex>{"f'(2)"}</Tex>.
      </>
    ),
    inputPrefix: <Tex>{"f'(2) ="}</Tex>,
    placeholder: 'a number',
    answer: <Tex>1.5</Tex>,
    check: numericAnswer(1.5, 0.001),
    explanation: (
      <>
        <Tex>{"f'(2)"}</Tex> is the slope of the tangent line: <Tex>{String.raw`\frac{7 - 1}{4 - 0} = 1.5`}</Tex>.
      </>
    ),
  },
  {
    id: 'units',
    kind: 'choice',
    prompt: (
      <>
        <Tex>R(t)</Tex> is the amount of rain that has fallen, in inches, <Tex>t</Tex> hours after midnight. A student
        estimates <Tex>{"R'(4) \\approx 0.3"}</Tex>. What are the units of <Tex>{"R'(4)"}</Tex>?
      </>
    ),
    choices: [
      { id: 'in', label: 'inches' },
      { id: 'hr', label: 'hours' },
      { id: 'in-hr', label: 'inches per hour' },
      { id: 'hr-in', label: 'hours per inch' },
    ],
    answer: 'in-hr',
    explanation: <>A derivative has units of output per input: inches of rain per hour.</>,
  },
  {
    id: 'sign',
    kind: 'choice',
    prompt: (
      <>
        Based on the table, which statement is best supported?
        <ValueTable rows={[{ label: 't', values: [0, 3, 5, 8] }, { label: 'P(t)', values: [40, 37, 31, 30] }]} />
      </>
    ),
    choices: [
      { id: 'pos', label: <><Tex>{"P'(4) > 0"}</Tex></> },
      { id: 'neg', label: <><Tex>{"P'(4) < 0"}</Tex></> },
      { id: 'zero', label: <><Tex>{"P'(4) = 0"}</Tex></> },
      { id: 'value', label: <><Tex>{"P'(4) = 34"}</Tex></> },
    ],
    answer: 'neg',
    explanation: (
      <>
        <Tex>{String.raw`P'(4) \approx \frac{P(5) - P(3)}{5 - 3} = \frac{31 - 37}{2} = -3`}</Tex>, so P is decreasing near
        t = 4.
      </>
    ),
  },
]
