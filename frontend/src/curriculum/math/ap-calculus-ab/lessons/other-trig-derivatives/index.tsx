import { AlgebraStepper } from '@/components/lesson/AlgebraStepper'
import { Callout, Prose } from '@/components/lesson/Callout'
import { type LessonStep, LessonPlayer } from '@/components/lesson/LessonPlayer'
import { Tex } from '@/components/math/Tex'
import { PracticeGenerator } from '@/components/quiz/PracticeGenerator'
import { Quiz } from '@/components/quiz/Quiz'
import { colors } from '@/curriculum/math/shared/colors'
import { TracerGallery } from '@/curriculum/math/shared/TracerGallery'
import { cosecant, cotangent, secant, tangent } from './functions'
import { generateTrigProblem } from './practice'
import { questions } from './questions'

const pairs: [string, string, string, string][] = [
  ['\\sin x', '\\cos x', '\\cos x', '-\\sin x'],
  ['\\tan x', '\\sec^2 x', '\\cot x', '-\\csc^2 x'],
  ['\\sec x', '\\sec x\\tan x', '\\csc x', '-\\csc x\\cot x'],
]

export default function OtherTrigLesson() {
  const steps: LessonStep[] = [
    {
      id: 'tan',
      title: 'tan x from sin and cos',
      content: (
        <>
          <Prose>
            <p>
              Every other trig function is built from sine and cosine, so the quotient rule finds its derivative.
            </p>
          </Prose>
          <AlgebraStepper
            title={<Tex>{String.raw`\frac{d}{dx}\tan x`}</Tex>}
            lines={[
              { tex: String.raw`\frac{d}{dx}\tan x = \frac{d}{dx}\left[\frac{\sin x}{\cos x}\right]`, note: 'Rewrite with sine and cosine.' },
              { tex: String.raw`= \frac{(\cos x)(\cos x) - (\sin x)(-\sin x)}{\cos^2 x}`, note: 'Quotient rule: low d-high minus high d-low.' },
              { tex: String.raw`= \frac{\cos^2 x + \sin^2 x}{\cos^2 x} = \frac{1}{\cos^2 x}`, note: 'Pythagorean identity: sin² x + cos² x = 1.' },
              { tex: `= \\textcolor{${colors.instant}}{\\sec^2 x}` },
            ]}
          />
          <AlgebraStepper
            title={<Tex>{String.raw`\frac{d}{dx}\sec x`}</Tex>}
            lines={[
              { tex: String.raw`\frac{d}{dx}\sec x = \frac{d}{dx}\left[\frac{1}{\cos x}\right]`, note: 'Rewrite with cosine.' },
              { tex: String.raw`= \frac{(0)(\cos x) - (1)(-\sin x)}{\cos^2 x} = \frac{\sin x}{\cos^2 x}`, note: 'The derivative of the constant 1 is 0.' },
              { tex: `= \\frac{1}{\\cos x}\\cdot\\frac{\\sin x}{\\cos x} = \\textcolor{${colors.instant}}{\\sec x\\tan x}`, note: 'Split the fraction to recognize sec and tan.' },
            ]}
          />
        </>
      ),
      teacherNotes: (
        <p>
          Have students derive <Tex>\cot x</Tex> and <Tex>\csc x</Tex> themselves in pairs, then check with the table in
          step 3. The structure is identical, just with sine and cosine swapped.
        </p>
      ),
    },
    {
      id: 'trace',
      title: 'See the slopes',
      content: (
        <>
          <Prose>
            <p>Sweep each function. Watch what the slope does near the vertical asymptotes.</p>
          </Prose>
          <TracerGallery functions={[tangent, secant, cotangent, cosecant]} pi />
          <Callout kind="think">
            <p>
              The slope of <Tex>\tan x</Tex> never drops below 1. Why does <Tex>{String.raw`\sec^2 x \ge 1`}</Tex> explain
              that? Where is <Tex>\tan x</Tex> least steep?
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: 'table',
      title: 'All six at a glance',
      content: (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-center">
              <thead className="text-sm text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-2 font-medium">f(x)</th>
                  <th className="px-4 py-2 font-medium">f′(x)</th>
                  <th className="px-4 py-2 font-medium">co-function</th>
                  <th className="px-4 py-2 font-medium">its derivative</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map(([f, df, co, dco]) => (
                  <tr key={f} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3">
                      <Tex>{f}</Tex>
                    </td>
                    <td className="px-4 py-3">
                      <Tex>{`\\textcolor{${colors.instant}}{${df}}`}</Tex>
                    </td>
                    <td className="px-4 py-3">
                      <Tex>{co}</Tex>
                    </td>
                    <td className="px-4 py-3">
                      <Tex>{`\\textcolor{${colors.wrong}}{${dco}}`}</Tex>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Callout kind="idea">
            <p>
              Pattern: each <strong>co-</strong>function&rsquo;s derivative looks like its partner&rsquo;s with every
              function swapped for its co-function, plus a <strong>minus sign</strong>.
            </p>
          </Callout>
          <h3 className="text-lg font-semibold text-slate-900">Practice</h3>
          <PracticeGenerator generate={generateTrigProblem} />
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
