import { AlgebraStepper } from '@/components/lesson/AlgebraStepper'
import { Callout, Prose } from '@/components/lesson/Callout'
import { type LessonStep, LessonPlayer } from '@/components/lesson/LessonPlayer'
import { Tex } from '@/components/math/Tex'
import { PracticeGenerator } from '@/components/quiz/PracticeGenerator'
import { Quiz } from '@/components/quiz/Quiz'
import { colors } from '@/curriculum/math/shared/colors'
import { DerivativeStepsPanel } from '@/curriculum/math/shared/DerivativeStepsPanel'
import { CombinationExplorer } from '../../shared/CombinationExplorer'
import { generateTableProblem } from '../../shared/tableProblems'
import { questions } from './questions'

const rule = `\\frac{d}{dx}\\left[\\frac{f(x)}{g(x)}\\right] = \\textcolor{${colors.instant}}{\\frac{f'(x)\\,g(x) - f(x)\\,g'(x)}{\\big[g(x)\\big]^2}}`

export default function QuotientRuleLesson() {
  const steps: LessonStep[] = [
    {
      id: 'derive',
      title: 'Derive it from the product rule',
      content: (
        <>
          <Prose>
            <p>
              You don&rsquo;t need a new limit argument. Call the quotient <Tex>Q</Tex> and use the product rule you
              already know. Reveal one line at a time and predict the next.
            </p>
          </Prose>
          <AlgebraStepper
            title={<Tex>{String.raw`Q(x) = \frac{f(x)}{g(x)}`}</Tex>}
            lines={[
              { tex: String.raw`f = Q \cdot g`, note: 'Multiply both sides by g.' },
              { tex: String.raw`f' = Q'g + Qg'`, note: 'Differentiate with the product rule.' },
              { tex: String.raw`Q' = \frac{f' - Qg'}{g}`, note: "Solve for Q′." },
              { tex: String.raw`Q' = \frac{f' - \frac{f}{g}g'}{g} = \frac{f'g - fg'}{g^2}`, note: 'Substitute Q = f/g and multiply top and bottom by g.' },
            ]}
          />
          <Callout kind="idea">
            <Tex block>{rule}</Tex>
            <p>Memory aid: &ldquo;low d-high minus high d-low, over the square of what&rsquo;s below.&rdquo;</p>
          </Callout>
        </>
      ),
      teacherNotes: (
        <p>
          This derivation assumes Q is differentiable, which is fine for a classroom argument. Students who know the
          chain rule can also derive it from <Tex>{'f \\cdot g^{-1}'}</Tex> in Unit 3.
        </p>
      ),
    },
    {
      id: 'test',
      title: 'Test it against the graph',
      content: (
        <>
          <Prose>
            <p>
              The pink curve is <Tex>{'f/g'}</Tex>. The blue tangent uses the quotient rule; the dashed red one uses a
              common mistake. Switch between the mistakes. Getting the order of the numerator wrong flips the sign of
              the slope.
            </p>
          </Prose>
          <CombinationExplorer mode="quotient" />
        </>
      ),
      teacherNotes: (
        <p>
          With <Tex>{'f = x^2'}</Tex> and <Tex>{'g = x^2 + 1'}</Tex>, the flipped-numerator tangent slopes downward while
          the curve rises, which makes the mistake obvious.
        </p>
      ),
    },
    {
      id: 'rewrite',
      title: 'Rewrite first?',
      content: (
        <>
          <Prose>
            <p>
              Not every fraction needs the quotient rule. Compare the two routes for the same function, both worked
              out step by step by the server:
            </p>
          </Prose>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <p className="font-medium text-slate-700">
                Route 1: quotient rule on <Tex>{String.raw`\frac{x^2 + 3}{x}`}</Tex>
              </p>
              <DerivativeStepsPanel expression="(x^2 + 3)/x" />
            </div>
            <div className="space-y-2">
              <p className="font-medium text-slate-700">
                Route 2: rewrite as <Tex>{String.raw`x + \frac{3}{x}`}</Tex> first
              </p>
              <DerivativeStepsPanel expression="x + 3/x" />
            </div>
          </div>
          <Callout kind="ap">
            <p>
              If the denominator is a single term like <Tex>x</Tex> or <Tex>{String.raw`\sqrt{x}`}</Tex>, divide it
              into each term first and use the power rule. Save the quotient rule for denominators that really are
              sums or products.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: 'practice',
      title: 'Practice with tables',
      content: <PracticeGenerator generate={() => generateTableProblem('quotient')} />,
    },
    {
      id: 'check',
      title: 'Check your understanding',
      content: <Quiz questions={questions} />,
    },
  ]

  return <LessonPlayer steps={steps} />
}
