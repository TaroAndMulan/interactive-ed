import { Callout, Prose } from '@/components/lesson/Callout'
import { type LessonStep, LessonPlayer } from '@/components/lesson/LessonPlayer'
import { Tex } from '@/components/math/Tex'
import { PracticeGenerator } from '@/components/quiz/PracticeGenerator'
import { Quiz } from '@/components/quiz/Quiz'
import { DataTableEstimator } from './DataTableEstimator'
import { questions } from './questions'
import { QuotientComparison } from './QuotientComparison'
import { generateTableProblem } from './tablePractice'
import { TangentEyeballGame } from './TangentEyeballGame'

export default function EstimatingDerivativesLesson() {
  const steps: LessonStep[] = [
    {
      id: 'graph',
      title: 'Estimate from a graph',
      content: (
        <>
          <Prose>
            <p>
              Often there&rsquo;s no formula, just a graph. Then <Tex>{"f'(a)"}</Tex> is the slope of the line that just
              touches the curve at <Tex>x = a</Tex>. Draw that line, then measure its slope with the grid:{' '}
              <Tex>{String.raw`\frac{\text{rise}}{\text{run}}`}</Tex>.
            </p>
          </Prose>
          <TangentEyeballGame />
          <Callout kind="think">
            <p>
              Where are your estimates most accurate: where the curve is steep, or near the turning points? Why might a
              longer run make the measurement easier?
            </p>
          </Callout>
        </>
      ),
      teacherNotes: (
        <p>
          Turn this into a class game: project it and let students call out a slope before you check. Tangent lines
          at the local max (x = 2) and min (x = 6) are horizontal, an early preview of Unit 5.
        </p>
      ),
    },
    {
      id: 'table',
      title: 'Estimate from a table',
      content: (
        <>
          <Prose>
            <p>
              With only table values, use an average rate of change, the slope of a secant line, as the estimate.
              Three choices use the same table:
            </p>
          </Prose>
          <QuotientComparison />
          <Callout kind="idea">
            <p>
              The <strong>symmetric</strong> difference quotient is usually the most accurate, because its errors on
              the left and right partly cancel. Shrink <Tex>\Delta</Tex> and watch every error shrink. A graphing
              calculator&rsquo;s numerical derivative uses the symmetric quotient with a tiny <Tex>\Delta</Tex>.
            </p>
          </Callout>
        </>
      ),
      teacherNotes: (
        <p>
          Drag the point to <Tex>x = 4</Tex>, the inflection point. There the forward and backward estimates become as
          good as the symmetric one. Ask why: their extra error comes from the curve bending, and at x = 4 it
          isn&rsquo;t bending.
        </p>
      ),
    },
    {
      id: 'data',
      title: 'Real data, AP style',
      content: (
        <>
          <DataTableEstimator />
          <Callout kind="ap">
            <p>
              &ldquo;Use the data in the table to estimate <Tex>{"H'(6)"}</Tex>&rdquo; means: use the two data points
              closest to 6 on either side, show the difference quotient with numbers substituted, and give units. If 6
              were itself in the table, use the closest points on either side of it.
            </p>
          </Callout>
          <h3 className="text-lg font-semibold text-slate-900">Practice: unlimited tables</h3>
          <PracticeGenerator generate={generateTableProblem} />
        </>
      ),
      teacherNotes: (
        <p>
          The balloon&rsquo;s rate drops from 40 to 4 m/min, so it is slowing down. Ask whether <Tex>{"H''"}</Tex> is
          positive or negative as a preview of Unit 4.
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
