import { useState } from 'react'
import { Callout, Prose } from '@/components/lesson/Callout'
import { type LessonStep, LessonPlayer } from '@/components/lesson/LessonPlayer'
import { Tex } from '@/components/math/Tex'
import { Quiz } from '@/components/quiz/Quiz'
import { colors } from '@/curriculum/math/shared/colors'
import { DerivativeTracer } from '@/curriculum/math/shared/DerivativeTracer'
import { DifferenceQuotientPanel } from '@/curriculum/math/shared/DifferenceQuotientPanel'
import { FunctionPicker } from '@/curriculum/math/shared/FunctionPicker'
import { presetFunctions } from '@/curriculum/math/shared/functions'
import { NotationTranslator } from './NotationTranslator'
import { questions } from './questions'
import { TangentLineExplorer } from './TangentLineExplorer'
import { TwoFormsExplorer } from './TwoFormsExplorer'

const inst = (tex: string) => `\\textcolor{${colors.instant}}{${tex}}`
const avg = (tex: string) => `\\textcolor{${colors.average}}{${tex}}`

export default function DerivativeDefinitionLesson() {
  const [fn, setFn] = useState(presetFunctions[1])
  const picker = <FunctionPicker value={fn} onChange={setFn} />

  const steps: LessonStep[] = [
    {
      id: 'function',
      title: 'From a number to a function',
      content: (
        <>
          <Prose>
            <p>
              In the last lesson, <Tex>f'(a)</Tex> was one number: the slope of the tangent line at one point. Now find
              the slope at <em>every</em> point. The slopes form a brand-new function, the{' '}
              <strong style={{ color: colors.instant }}>derivative</strong> <Tex>f'</Tex>:
            </p>
            <Tex block>{`${inst("f'(x)")} = \\lim_{h \\to 0} ${avg(String.raw`\frac{f(x+h) - f(x)}{h}`)}`}</Tex>
            <p>Drag the point or press Sweep. Each tangent slope drops a dot onto the lower graph.</p>
          </Prose>
          {picker}
          <DerivativeTracer key={fn.id} fn={fn} />
          <Callout kind="think">
            <p>
              Before revealing <Tex>f'</Tex>: where are the dots above the axis? Below it? Where do they cross zero?
              Compare with where <Tex>f</Tex> rises, falls, and turns around.
            </p>
          </Callout>
          <DifferenceQuotientPanel fn={fn} />
        </>
      ),
      teacherNotes: (
        <>
          <p>
            Start with <Tex>x^3 - 3x</Tex>: ask students to sketch <Tex>f'</Tex> on whiteboards <em>before</em> sweeping.
            The key reading skills: <Tex>f</Tex> increasing ⇔ <Tex>f' &gt; 0</Tex>; turning points ⇔ <Tex>f' = 0</Tex>.
          </p>
          <p>
            Then switch to <Tex>e^x</Tex> and ask what&rsquo;s surprising about its slope graph. That sets up topic 2.7.
          </p>
        </>
      ),
    },
    {
      id: 'two-forms',
      title: 'Two ways to write the limit',
      content: (
        <>
          <Prose>
            <p>
              The second point on the secant line can be named <Tex>a + h</Tex> or simply <Tex>x</Tex>. Same line, same
              slope, so both limits define the same derivative:
            </p>
            <Tex block>{`f'(a) = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h} = \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}`}</Tex>
          </Prose>
          {picker}
          <TwoFormsExplorer key={fn.id} fn={fn} />
          <Callout kind="ap">
            <p>
              AP questions often hand you one of these limits and ask for its value. Spot <Tex>f</Tex> and{' '}
              <Tex>a</Tex>, then find <Tex>f'(a)</Tex> with derivative rules. Example:{' '}
              <Tex>{String.raw`\lim_{x \to \pi} \frac{\cos x + 1}{x - \pi}`}</Tex> is <Tex>f'(\pi)</Tex> for{' '}
              <Tex>f(x) = \cos x</Tex>, which equals <Tex>{String.raw`-\sin\pi = 0`}</Tex>.
            </p>
          </Callout>
        </>
      ),
      teacherNotes: (
        <p>
          Drag x toward a and point out that <Tex>h = x - a</Tex> shrinks at the same time: <Tex>h \to 0</Tex> and{' '}
          <Tex>x \to a</Tex> are the same motion. The x-form is the one that usually appears in AP multiple choice.
        </p>
      ),
    },
    {
      id: 'notation',
      title: 'Notation and units',
      content: (
        <>
          <Prose>
            <p>
              Mathematicians have several notations for the same derivative. Leibniz&rsquo;s{' '}
              <Tex>{String.raw`\frac{dy}{dx}`}</Tex> is a reminder that a derivative is a limit of{' '}
              <Tex>{String.raw`\frac{\Delta y}{\Delta x}`}</Tex>. Pick a context and slide the input.
            </p>
          </Prose>
          <NotationTranslator />
          <Callout kind="ap">
            <p>
              When interpreting a derivative in context, say three things: <strong>when</strong> (at t = 3 seconds),{' '}
              <strong>what</strong> is changing and in which direction (position is increasing), and{' '}
              <strong>how fast</strong>, with units (at 12.6 m/s).
            </p>
          </Callout>
        </>
      ),
      teacherNotes: (
        <p>
          The &ldquo;draining tank&rdquo; context has a negative derivative. Students often write &ldquo;the volume is
          −18.8 L/min&rdquo; at t = 3. Insist on &ldquo;decreasing at 18.8 L/min&rdquo;.
        </p>
      ),
    },
    {
      id: 'tangent-line',
      title: 'The tangent line equation',
      content: (
        <>
          <Prose>
            <p>
              A line needs a point and a slope. The tangent line at <Tex>x = a</Tex> uses the point{' '}
              <Tex>(a, f(a))</Tex> and the slope <Tex>{inst("f'(a)")}</Tex>:
            </p>
            <Tex block>{`y - f(a) = ${inst("f'(a)")}\\,(x - a)`}</Tex>
          </Prose>
          {picker}
          <TangentLineExplorer key={fn.id} fn={fn} />
        </>
      ),
      teacherNotes: (
        <p>
          AP free-response accepts point-slope form, so students needn&rsquo;t simplify. Common error: using{' '}
          <Tex>f'(x)</Tex> (a function) as the slope instead of the number <Tex>f'(a)</Tex>.
        </p>
      ),
    },
    {
      id: 'check',
      title: 'Check your understanding',
      content: <Quiz questions={questions} />,
    },
  ]

  return <LessonPlayer steps={steps} />
}
