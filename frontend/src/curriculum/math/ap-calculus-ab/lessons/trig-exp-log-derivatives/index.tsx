import { AlgebraStepper } from '@/components/lesson/AlgebraStepper'
import { Callout, Prose } from '@/components/lesson/Callout'
import { type LessonStep, LessonPlayer } from '@/components/lesson/LessonPlayer'
import { Tex } from '@/components/math/Tex'
import { PracticeGenerator } from '@/components/quiz/PracticeGenerator'
import { Quiz } from '@/components/quiz/Quiz'
import { colors } from '@/curriculum/math/shared/colors'
import { DerivativeTracer } from '@/curriculum/math/shared/DerivativeTracer'
import { TracerGallery } from '@/curriculum/math/shared/TracerGallery'
import { ExponentialBase } from './ExponentialBase'
import { cosine, naturalLog, sine } from './functions'
import { LogReflection } from './LogReflection'
import { generateBasicFunctionProblem } from './practice'
import { questions } from './questions'
import { UnitCircleSine } from './UnitCircleSine'

const summary: [string, string][] = [
  [String.raw`\sin x`, String.raw`\cos x`],
  [String.raw`\cos x`, String.raw`-\sin x`],
  ['e^x', 'e^x'],
  [String.raw`\ln x`, String.raw`\frac{1}{x}`],
]

export default function TrigExpLogLesson() {
  const steps: LessonStep[] = [
    {
      id: 'trace-trig',
      title: 'Trace sine and cosine',
      content: (
        <>
          <Prose>
            <p>
              Sweep the slope of <Tex>\sin x</Tex> and look at the dots. Have you seen that wave before? Then try{' '}
              <Tex>\cos x</Tex>.
            </p>
          </Prose>
          <TracerGallery functions={[sine, cosine]} pi />
          <Callout kind="think">
            <p>
              The slope of <Tex>\sin x</Tex> is largest at <Tex>x = 0</Tex> and zero at <Tex>{String.raw`x = \frac{\pi}{2}`}</Tex>.
              Which familiar function is 1 at 0 and 0 at <Tex>{String.raw`\frac{\pi}{2}`}</Tex>?
            </p>
          </Callout>
        </>
      ),
      teacherNotes: (
        <p>
          The radian scale matters: in degrees the slope of sine would be <Tex>{String.raw`\frac{\pi}{180}\cos x`}</Tex>.
          Calculus always uses radians for exactly this reason.
        </p>
      ),
    },
    {
      id: 'why-cos',
      title: 'Why sin′ = cos',
      content: (
        <>
          <Prose>
            <p>
              On the unit circle, <Tex>\sin\theta</Tex> is the height of the point. Nudge the angle by{' '}
              <Tex>{String.raw`\Delta\theta`}</Tex>: how much does the height change?
            </p>
          </Prose>
          <UnitCircleSine />
          <Callout kind="idea">
            <p>
              As <Tex>{String.raw`\Delta\theta \to 0`}</Tex>, the arc becomes a straight segment and the triangles become
              exactly similar: <Tex>{String.raw`\frac{d}{d\theta}\sin\theta = \cos\theta`}</Tex>. The horizontal leg gives{' '}
              <Tex>{String.raw`\frac{d}{d\theta}\cos\theta = -\sin\theta`}</Tex>: moving counterclockwise in the first
              quadrant, the point slides <em>left</em>.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: 'e',
      title: 'The base whose slope is itself',
      content: (
        <>
          <Prose>
            <p>
              For every exponential <Tex>{'b^x'}</Tex>, the slope is a constant multiple of the height. Slide{' '}
              <Tex>b</Tex> to make that multiple exactly 1.
            </p>
          </Prose>
          <ExponentialBase />
          <AlgebraStepper
            title={<Tex>{String.raw`\frac{d}{dx}e^x`}</Tex>}
            lines={[
              { tex: String.raw`\frac{d}{dx}e^x = \lim_{h\to 0}\frac{e^{x+h} - e^x}{h}`, note: 'Definition of the derivative.' },
              {
                tex: String.raw`= \lim_{h\to 0} e^x\cdot\frac{e^h - 1}{h}`,
                note: (
                  <>
                    Factor out <Tex>{'e^x'}</Tex>, since <Tex>{'e^{x+h} = e^x e^h'}</Tex>.
                  </>
                ),
              },
              { tex: String.raw`= e^x \cdot \lim_{h\to 0}\frac{e^h - 1}{h} = e^x \cdot 1`, note: 'This limit is the slope of eˣ at x = 0, which is exactly 1. That is what makes e special.' },
              { tex: `\\frac{d}{dx}e^x = \\textcolor{${colors.instant}}{e^x}` },
            ]}
          />
        </>
      ),
      teacherNotes: (
        <p>
          The ratio <Tex>{"f'(x)/f(x)"}</Tex> equals <Tex>\ln b</Tex>, which is a nice preview of{' '}
          <Tex>{String.raw`\frac{d}{dx}b^x = b^x\ln b`}</Tex> in Unit 3.
        </p>
      ),
    },
    {
      id: 'ln',
      title: 'The slope of ln x',
      content: (
        <>
          <Prose>
            <p>
              Trace the slope of <Tex>\ln x</Tex>. At <Tex>x = 2</Tex> the dot is at <Tex>{String.raw`\frac12`}</Tex>; at{' '}
              <Tex>x = 4</Tex>, at <Tex>{String.raw`\frac14`}</Tex>. See the pattern?
            </p>
          </Prose>
          <DerivativeTracer fn={naturalLog} />
          <Prose>
            <p>
              Why <Tex>{String.raw`\frac{1}{x}`}</Tex>? Because <Tex>\ln x</Tex> is the mirror image of <Tex>{'e^x'}</Tex>:
            </p>
          </Prose>
          <LogReflection />
        </>
      ),
    },
    {
      id: 'summary',
      title: 'Summary and practice',
      content: (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-center">
              <thead className="text-sm text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-2 font-medium">f(x)</th>
                  {summary.map(([f]) => (
                    <td key={f} className="px-4 py-2">
                      <Tex>{f}</Tex>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="px-4 py-2 text-sm font-medium text-slate-500">f′(x)</th>
                  {summary.map(([f, df]) => (
                    <td key={f} className="px-4 py-3">
                      <Tex>{`\\textcolor{${colors.instant}}{${df}}`}</Tex>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <PracticeGenerator generate={generateBasicFunctionProblem} />
        </>
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
