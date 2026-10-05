import { useState } from 'react'
import { Callout, Prose } from '@/components/lesson/Callout'
import { type LessonStep, LessonPlayer } from '@/components/lesson/LessonPlayer'
import { Tex } from '@/components/math/Tex'
import { Quiz } from '@/components/quiz/Quiz'
import { colors } from '@/curriculum/math/shared/colors'
import { DifferenceQuotientPanel } from '@/curriculum/math/shared/DifferenceQuotientPanel'
import { FunctionPicker } from '@/curriculum/math/shared/FunctionPicker'
import { presetFunctions } from '@/curriculum/math/shared/functions'
import { AverageRateExplorer } from './AverageRateExplorer'
import { CarMotionExplorer } from './CarMotionExplorer'
import { questions } from './questions'
import { ShrinkingIntervalExplorer } from './ShrinkingIntervalExplorer'
import { SummaryTable } from './SummaryTable'
import { TangentExplorer } from './TangentExplorer'

const avg = (tex: string) => `\\textcolor{${colors.average}}{${tex}}`
const inst = (tex: string) => `\\textcolor{${colors.instant}}{${tex}}`

export default function AverageVsInstantaneousRateLesson() {
  // Shared by steps 2–4 so a function chosen once follows the class through the lesson.
  const [fn, setFn] = useState(presetFunctions[0])
  const picker = <FunctionPicker value={fn} onChange={setFn} />

  const steps: LessonStep[] = [
    {
      id: 'paradox',
      title: 'The speedometer paradox',
      content: (
        <>
          <Prose>
            <p>
              A speed camera clocks a car at <strong>exactly</strong> <Tex>t = 5</Tex> seconds. The driver objects:
            </p>
            <blockquote className="border-l-4 border-slate-300 pl-4 italic">
              &ldquo;Speed is distance divided by time. In a single instant I moved 0 meters in 0 seconds. That&rsquo;s{' '}
              <Tex>{String.raw`\tfrac{0}{0}`}</Tex>. You can&rsquo;t measure my speed at an instant!&rdquo;
            </blockquote>
            <p>
              Press <strong>Drive</strong> and watch two needles: the{' '}
              <strong style={{ color: colors.instant }}>speedometer</strong> and the{' '}
              <strong style={{ color: colors.average }}>average speed so far</strong> (total distance ÷ total time).
            </p>
          </Prose>
          <CarMotionExplorer mode="intro" />
          <Callout kind="think">
            <p>
              At <Tex>t = 5</Tex> the speedometer reads 15 m/s but the average so far is only 10 m/s. Why are they
              different? And if speed needs two moments in time, what is a speedometer actually measuring?
            </p>
          </Callout>
        </>
      ),
      teacherNotes: (
        <>
          <p>
            Run the animation once without commentary, then pause at <Tex>t = 5</Tex>. Collect a few answers to the
            question, but <strong>don&rsquo;t resolve the paradox yet</strong>. Step 5 comes back to it.
          </p>
          <p>Students usually say &ldquo;it&rsquo;s the speed over a really short time.&rdquo; Write that phrase on the board.</p>
        </>
      ),
    },
    {
      id: 'average',
      title: 'Average rate of change',
      content: (
        <>
          <Prose>
            <p>
              The <strong style={{ color: colors.average }}>average rate of change</strong> of <Tex>f</Tex> on{' '}
              <Tex>[a, b]</Tex> is how much the output changes per unit of input, across the whole interval:
            </p>
            <Tex block>{`${avg(String.raw`\frac{\Delta y}{\Delta x}`)} = \\frac{f(b) - f(a)}{b - a}`}</Tex>
            <p>
              On the graph, it is the slope of the <strong style={{ color: colors.average }}>secant line</strong>{' '}
              through <Tex>A = (a, f(a))</Tex> and <Tex>B = (b, f(b))</Tex>. Drag A and B along the curve.
            </p>
          </Prose>
          {picker}
          <AverageRateExplorer key={fn.id} fn={fn} />
          <Callout kind="think">
            <p>Drag B right on top of A. What happens to the formula, and why?</p>
          </Callout>
        </>
      ),
      teacherNotes: (
        <>
          <p>
            <strong>Misconception to watch for:</strong> students sometimes compute the average of the function values,{' '}
            <Tex>{String.raw`\frac{f(a) + f(b)}{2}`}</Tex>, instead of the change in output per change in input.
          </p>
          <p>
            Challenge: with <Tex>f(x) = x^2</Tex>, find two <em>different</em> intervals with the same average rate of
            change. (Any interval centred on the same midpoint works, which previews the symmetric difference
            quotient.)
          </p>
        </>
      ),
    },
    {
      id: 'shrink',
      title: 'Shrink the interval',
      content: (
        <>
          <Prose>
            <p>
              Keep A fixed and move B closer. Write the second point as <Tex>b = a + h</Tex>, so the average rate on{' '}
              <Tex>[a, a + h]</Tex> becomes the <strong>difference quotient</strong>:
            </p>
            <Tex block>{avg(String.raw`\frac{f(a+h) - f(a)}{h}`)}</Tex>
            <p>
              Press <strong>Shrink h → 0</strong> and watch the secant line. Then try approaching from the left.
            </p>
          </Prose>
          {picker}
          <ShrinkingIntervalExplorer key={fn.id} fn={fn} />
          <Callout kind="idea">
            <p>
              We never set <Tex>h = 0</Tex>: that would be <Tex>{String.raw`\tfrac{0}{0}`}</Tex> again. Instead we
              ask which value the secant slopes <em>approach</em> as <Tex>h</Tex> gets close to 0. That is a{' '}
              <strong>limit</strong>.
            </p>
          </Callout>
        </>
      ),
      teacherNotes: (
        <>
          <p>
            Keep the tangent hidden until students have written a prediction from the table. For <Tex>x^2</Tex> at{' '}
            <Tex>a = 1</Tex>, the slopes approach 2 from both sides.
          </p>
          <p>
            Point out that the right-hand slopes are all <em>too big</em> and the left-hand slopes <em>too small</em>{' '}
            for <Tex>x^2</Tex>. The true value is squeezed between them.
          </p>
        </>
      ),
    },
    {
      id: 'instantaneous',
      title: 'Instantaneous rate of change',
      content: (
        <>
          <Prose>
            <p>
              The limit of those average rates is the{' '}
              <strong style={{ color: colors.instant }}>instantaneous rate of change</strong> of <Tex>f</Tex> at{' '}
              <Tex>a</Tex>, also called the <strong>derivative</strong> <Tex>f'(a)</Tex>:
            </p>
            <Tex block>{`${inst("f'(a)")} = \\lim_{h \\to 0} ${avg(String.raw`\frac{f(a+h) - f(a)}{h}`)}`}</Tex>
            <p>
              On the graph it is the slope of the <strong style={{ color: colors.instant }}>tangent line</strong> at
              A. Zoom in on A and see why: up close, a smooth curve looks straight.
            </p>
          </Prose>
          {picker}
          <TangentExplorer key={fn.id} fn={fn} />
          <DifferenceQuotientPanel fn={fn} />
        </>
      ),
      teacherNotes: (
        <>
          <p>
            At 1000× zoom the curve and tangent line are indistinguishable. This is <strong>local linearity</strong>,
            the idea behind tangent-line approximation in Unit 4.
          </p>
          <p>
            Extension: choose &ldquo;Your own…&rdquo;, enter <code>abs(x)</code>, and put A at 0. No amount of
            zooming straightens the corner, so there is no tangent line and <Tex>f'(0)</Tex> does not exist. This
            previews differentiability (CED 2.4).
          </p>
        </>
      ),
    },
    {
      id: 'resolve',
      title: 'Resolving the paradox',
      content: (
        <>
          <Prose>
            <p>
              Back to the car. Its average velocity over <Tex>{String.raw`[t,\ t + \Delta t]`}</Tex> is the slope of a
              secant line on the position graph. Set <Tex>t = 5</Tex> and shrink <Tex>{String.raw`\Delta t`}</Tex>.
              Watch the orange needle close in on the blue one.
            </p>
          </Prose>
          <CarMotionExplorer mode="full" />
          <Callout kind="idea">
            <p>
              The driver was right that <Tex>{String.raw`\tfrac{0}{0}`}</Tex> means nothing. But the camera never
              divides zero by zero. Instantaneous velocity is the <strong>limit</strong> of average velocities over
              shorter and shorter time intervals:
            </p>
            <Tex block>{`${inst('v(t)')} = \\lim_{\\Delta t \\to 0} ${avg(String.raw`\frac{s(t + \Delta t) - s(t)}{\Delta t}`)} = s'(t)`}</Tex>
          </Callout>
        </>
      ),
      teacherNotes: (
        <>
          <p>
            Here <Tex>s(t) = 3t^2 - 0.2t^3</Tex> meters on <Tex>{String.raw`0 \le t \le 10`}</Tex>, so{' '}
            <Tex>v(t) = 6t - 0.6t^2</Tex>, which peaks at 15 m/s when <Tex>t = 5</Tex>. Over{' '}
            <Tex>[5,\ 5 + \Delta t]</Tex> the average velocity is exactly{' '}
            <Tex>{String.raw`15 - 0.2(\Delta t)^2`}</Tex>, a nice algebra follow-up for strong students.
          </p>
          <p>Return to the phrase from step 1 (&ldquo;speed over a really short time&rdquo;) and refine it into the limit.</p>
        </>
      ),
    },
    {
      id: 'summary',
      title: 'Side by side',
      content: (
        <>
          <SummaryTable />
          <Callout kind="idea">
            <p>
              The instantaneous rate of change is the <strong>limit of average rates of change</strong> over shrinking
              intervals. Graphically, secant lines turn into the tangent line.
            </p>
          </Callout>
          <Callout kind="ap">
            <p>
              &ldquo;Estimate <Tex>f'(c)</Tex> using the table&rdquo; means: compute an <em>average</em> rate of change
              using the data points on either side of <Tex>c</Tex>, show the difference quotient, and include units.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: 'check',
      title: 'Check your understanding',
      content: <Quiz questions={questions} />,
      teacherNotes: (
        <p>
          Question 4 accepts any equivalent expression (e.g. <code>h+6</code>, <code>(12+2h)/2</code>). The SymPy
          server checks it, with an in-browser fallback if the server is offline.
        </p>
      ),
    },
  ]

  return <LessonPlayer steps={steps} />
}
