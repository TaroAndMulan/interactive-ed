import { Tex } from '@/components/math/Tex'
import { numericAnswer } from '@/components/quiz/checks'
import type { QuizQuestion } from '@/components/quiz/types'
import { expressionAnswer } from '@/curriculum/math/shared/expressionAnswer'

const coffee = [
  [0, 92.0],
  [3, 84.5],
  [7, 76.1],
  [12, 67.8],
  [18, 60.2],
]

export const questions: QuizQuestion[] = [
  {
    id: 'avg-cubic',
    kind: 'input',
    prompt: (
      <>
        Find the average rate of change of <Tex>g(x) = x^3</Tex> on the interval <Tex>[1, 3]</Tex>.
      </>
    ),
    inputPrefix: <Tex>{String.raw`\frac{g(3)-g(1)}{3-1} =`}</Tex>,
    placeholder: 'a number',
    answer: <Tex>13</Tex>,
    check: numericAnswer(13),
    explanation: <Tex>{String.raw`\frac{g(3)-g(1)}{3-1} = \frac{27 - 1}{2} = 13`}</Tex>,
  },
  {
    id: 'tangent-picture',
    kind: 'choice',
    prompt: (
      <>
        Graphically, the <strong>instantaneous</strong> rate of change of <Tex>f</Tex> at <Tex>x = a</Tex> is…
      </>
    ),
    choices: [
      { id: 'secant', label: <>the slope of a secant line through <Tex>(a, f(a))</Tex> and <Tex>(b, f(b))</Tex></> },
      { id: 'tangent', label: <>the slope of the tangent line at <Tex>(a, f(a))</Tex></> },
      { id: 'value', label: <>the height of the graph, <Tex>f(a)</Tex></> },
      { id: 'mean', label: <>the average of <Tex>f(a)</Tex> and <Tex>f(b)</Tex></> },
    ],
    answer: 'tangent',
    explanation: (
      <>
        A secant slope is an <em>average</em> rate over an interval. The tangent slope is the limit of those
        secant slopes as the interval shrinks to the single point <Tex>x = a</Tex>.
      </>
    ),
  },
  {
    id: 'coffee-table',
    kind: 'input',
    prompt: (
      <div className="space-y-3">
        <p>
          The temperature <Tex>C(t)</Tex> of a cup of coffee, in °C, is measured at selected times <Tex>t</Tex>{' '}
          in minutes. Use the data to estimate <Tex>C'(9)</Tex>.
        </p>
        <div className="overflow-x-auto">
          <table className="text-center font-mono text-sm">
            <tbody>
              <tr>
                <th className="border border-slate-200 bg-slate-50 px-3 py-1 font-sans">t (min)</th>
                {coffee.map(([t]) => (
                  <td key={t} className="border border-slate-200 px-3 py-1">
                    {t}
                  </td>
                ))}
              </tr>
              <tr>
                <th className="border border-slate-200 bg-slate-50 px-3 py-1 font-sans">C(t) (°C)</th>
                {coffee.map(([t, c]) => (
                  <td key={t} className="border border-slate-200 px-3 py-1">
                    {c.toFixed(1)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
    inputPrefix: <Tex>{"C'(9) \\approx"}</Tex>,
    placeholder: '°C per minute',
    answer: <Tex>{String.raw`-1.66\ {}^\circ\text{C/min}`}</Tex>,
    check: numericAnswer(-1.66, 0.006),
    explanation: (
      <>
        <p>
          9 lies between the data points <Tex>t = 7</Tex> and <Tex>t = 12</Tex>, so use the average rate of change on
          that interval:
        </p>
        <Tex block>{String.raw`C'(9) \approx \frac{C(12) - C(7)}{12 - 7} = \frac{67.8 - 76.1}{5} = -1.66\ {}^\circ\text{C/min}`}</Tex>
        <p>The negative sign means the coffee is cooling at about 1.66 °C per minute around t = 9.</p>
      </>
    ),
  },
  {
    id: 'difference-quotient',
    kind: 'input',
    prompt: (
      <>
        Let <Tex>f(x) = x^2</Tex>. Simplify the difference quotient for <Tex>h \ne 0</Tex>. Any equivalent form is
        accepted.
      </>
    ),
    inputPrefix: <Tex>{String.raw`\frac{f(3+h) - f(3)}{h} =`}</Tex>,
    placeholder: 'an expression in h',
    answer: <Tex>6 + h</Tex>,
    check: expressionAnswer('6 + h'),
    explanation: (
      <>
        <Tex block>{String.raw`\frac{(3+h)^2 - 9}{h} = \frac{6h + h^2}{h} = 6 + h`}</Tex>
        <p>
          As <Tex>h \to 0</Tex> this approaches <Tex>6</Tex>, so <Tex>f'(3) = 6</Tex>.
        </p>
      </>
    ),
  },
  {
    id: 'recognize-limit',
    kind: 'choice',
    prompt: (
      <>
        What does <Tex>{String.raw`\displaystyle\lim_{h \to 0} \frac{(2+h)^3 - 8}{h}`}</Tex> represent?
      </>
    ),
    choices: [
      { id: 'avg-0-2', label: <>the average rate of change of <Tex>x^3</Tex> on <Tex>[0, 2]</Tex></> },
      { id: 'inst-2', label: <>the instantaneous rate of change of <Tex>x^3</Tex> at <Tex>x = 2</Tex></> },
      { id: 'value', label: <>the value of <Tex>(2+h)^3</Tex> when <Tex>h = 0</Tex></> },
      { id: 'avg-2-8', label: <>the average rate of change of <Tex>x^3</Tex> on <Tex>[2, 8]</Tex></> },
    ],
    answer: 'inst-2',
    explanation: (
      <>
        It matches <Tex>{String.raw`\lim_{h\to 0}\frac{f(a+h)-f(a)}{h}`}</Tex> with <Tex>f(x) = x^3</Tex> and{' '}
        <Tex>a = 2</Tex> (since <Tex>2^3 = 8</Tex>). Its value is <Tex>f'(2) = 12</Tex>.
      </>
    ),
  },
  {
    id: 'interpret-context',
    kind: 'choice',
    prompt: (
      <>
        A car&rsquo;s position is <Tex>s(t)</Tex> meters at time <Tex>t</Tex> seconds. Which statement correctly
        interprets <Tex>{String.raw`\frac{s(5) - s(2)}{5 - 2} = 4`}</Tex>?
      </>
    ),
    choices: [
      { id: 'speedo-5', label: 'At t = 5 seconds, the car is moving at 4 m/s.' },
      { id: 'avg', label: 'From t = 2 to t = 5 seconds, the car’s average velocity is 4 m/s.' },
      { id: 'distance', label: 'The car traveled 4 meters between t = 2 and t = 5 seconds.' },
      { id: 'speedo-2', label: 'At t = 2 seconds, the speedometer reads 4 m/s.' },
    ],
    answer: 'avg',
    explanation: (
      <>
        A difference quotient over an interval is an <em>average</em> rate. It says nothing exact about any single
        instant, and the car actually traveled <Tex>4 \times 3 = 12</Tex> meters.
      </>
    ),
  },
]
