import { Tex } from '@/components/math/Tex'
import type { QuizQuestion } from '@/components/quiz/types'
import { expressionAnswer } from '@/curriculum/math/shared/expressionAnswer'

export const questions: QuizQuestion[] = [
  {
    id: 'recognize-sqrt',
    kind: 'choice',
    prompt: (
      <>
        Which derivative does <Tex>{String.raw`\displaystyle\lim_{h \to 0} \frac{\sqrt{9 + h} - 3}{h}`}</Tex> represent?
      </>
    ),
    choices: [
      { id: 'sqrt-9', label: <><Tex>f'(9)</Tex> for <Tex>{String.raw`f(x) = \sqrt{x}`}</Tex></> },
      { id: 'sqrt-3', label: <><Tex>f'(3)</Tex> for <Tex>{String.raw`f(x) = \sqrt{x}`}</Tex></> },
      { id: 'sq-9', label: <><Tex>f'(9)</Tex> for <Tex>f(x) = x^2</Tex></> },
      { id: 'none', label: 'It is not a derivative' },
    ],
    answer: 'sqrt-9',
    explanation: (
      <>
        Match <Tex>{String.raw`\frac{f(a+h) - f(a)}{h}`}</Tex>: here <Tex>a = 9</Tex>, <Tex>{String.raw`f(x) = \sqrt{x}`}</Tex>, and{' '}
        <Tex>f(9) = 3</Tex>. Its value is <Tex>{String.raw`\frac{1}{2\sqrt{9}} = \frac{1}{6}`}</Tex>.
      </>
    ),
  },
  {
    id: 'x-form',
    kind: 'choice',
    prompt: (
      <>
        Evaluate <Tex>{String.raw`\displaystyle\lim_{x \to 2} \frac{x^3 - 8}{x - 2}`}</Tex>.
      </>
    ),
    choices: [
      { id: '0', label: <Tex>0</Tex> },
      { id: '4', label: <Tex>4</Tex> },
      { id: '12', label: <Tex>12</Tex> },
      { id: 'dne', label: 'Does not exist (0/0)' },
    ],
    answer: '12',
    explanation: (
      <>
        This is the x-form <Tex>{String.raw`\lim_{x\to a}\frac{f(x)-f(a)}{x-a}`}</Tex> with <Tex>f(x) = x^3</Tex> and{' '}
        <Tex>a = 2</Tex>, so it equals <Tex>f'(2) = 3(2)^2 = 12</Tex>. A 0/0 form means &ldquo;more work needed,&rdquo; not
        &ldquo;does not exist.&rdquo;
      </>
    ),
  },
  {
    id: 'definition-3x2',
    kind: 'input',
    prompt: (
      <>
        Use the limit definition with <Tex>f(x) = 3x^2</Tex>. Simplify{' '}
        <Tex>{String.raw`\frac{f(x+h) - f(x)}{h}`}</Tex>, then let <Tex>h \to 0</Tex>.
      </>
    ),
    inputPrefix: <Tex>{"f'(x) ="}</Tex>,
    placeholder: 'an expression in x',
    answer: <Tex>6x</Tex>,
    check: expressionAnswer('6x'),
    explanation: (
      <Tex block>{String.raw`\frac{3(x+h)^2 - 3x^2}{h} = \frac{6xh + 3h^2}{h} = 6x + 3h \;\xrightarrow{h \to 0}\; 6x`}</Tex>
    ),
  },
  {
    id: 'tangent-line',
    kind: 'input',
    prompt: (
      <>
        Write the equation of the line tangent to <Tex>f(x) = x^2</Tex> at <Tex>x = 3</Tex>.
      </>
    ),
    inputPrefix: <Tex>{'y ='}</Tex>,
    placeholder: 'e.g. 2x + 1',
    answer: <Tex>6x - 9</Tex>,
    check: expressionAnswer('6x - 9'),
    explanation: (
      <>
        Point <Tex>(3, 9)</Tex>, slope <Tex>f'(3) = 6</Tex>: <Tex>y - 9 = 6(x - 3)</Tex>, so <Tex>y = 6x - 9</Tex>.
      </>
    ),
  },
  {
    id: 'not-derivative',
    kind: 'choice',
    prompt: (
      <>
        If <Tex>y = f(x)</Tex>, which of these does <strong>not</strong> mean the derivative?
      </>
    ),
    choices: [
      { id: 'leibniz', label: <Tex>{String.raw`\frac{dy}{dx}`}</Tex> },
      { id: 'prime', label: <Tex>{"f'(x)"}</Tex> },
      { id: 'yprime', label: <Tex>{"y'"}</Tex> },
      { id: 'delta', label: <Tex>{String.raw`\frac{\Delta y}{\Delta x}`}</Tex> },
    ],
    answer: 'delta',
    explanation: (
      <>
        <Tex>{String.raw`\frac{\Delta y}{\Delta x}`}</Tex> is an <em>average</em> rate over an interval. The{' '}
        <Tex>d</Tex>&rsquo;s in <Tex>{String.raw`\frac{dy}{dx}`}</Tex> signal the limit as <Tex>\Delta x \to 0</Tex>.
      </>
    ),
  },
  {
    id: 'units',
    kind: 'choice',
    prompt: (
      <>
        <Tex>V(t)</Tex> is the volume of water in a tank, in liters, <Tex>t</Tex> minutes after it starts draining. What
        does <Tex>{"V'(5) = -3"}</Tex> mean?
      </>
    ),
    choices: [
      { id: 'volume', label: 'After 5 minutes the tank holds 3 fewer liters than at the start.' },
      { id: 'rate', label: 'At t = 5 minutes, the volume is decreasing at 3 liters per minute.' },
      { id: 'average', label: 'Over the first 5 minutes, the tank lost 3 liters per minute on average.' },
      { id: 'time', label: 'It takes 3 minutes for the volume to drop by 5 liters.' },
    ],
    answer: 'rate',
    explanation: (
      <>
        A derivative is an instantaneous rate at one moment, in output units per input unit (liters per minute). The
        negative sign means the volume is decreasing.
      </>
    ),
  },
]
