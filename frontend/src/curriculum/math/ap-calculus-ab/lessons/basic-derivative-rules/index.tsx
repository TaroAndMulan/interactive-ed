import { Callout, Prose } from '@/components/lesson/Callout'
import { type LessonStep, LessonPlayer } from '@/components/lesson/LessonPlayer'
import { Tex } from '@/components/math/Tex'
import { PracticeGenerator } from '@/components/quiz/PracticeGenerator'
import { Quiz } from '@/components/quiz/Quiz'
import { PolynomialMachine } from './PolynomialMachine'
import { generatePolynomialProblem } from './practice'
import { questions } from './questions'
import { ShiftStretchExplorer } from './ShiftStretchExplorer'
import { SumRuleExplorer } from './SumRuleExplorer'

export default function BasicRulesLesson() {
  const steps: LessonStep[] = [
    {
      id: 'constant',
      title: 'Constants vanish',
      content: (
        <>
          <Prose>
            <p>
              Adding a constant slides the whole graph up or down. Every point moves the same amount, so no slope
              changes. Drag <Tex>C</Tex> and watch the two tangent lines stay parallel.
            </p>
          </Prose>
          <ShiftStretchExplorer mode="shift" />
          <Callout kind="idea">
            <p>
              <strong>Constant rule:</strong> <Tex>{String.raw`\frac{d}{dx}[c] = 0`}</Tex>. A flat line has slope 0, so
              adding a constant adds nothing to the derivative.
            </p>
          </Callout>
        </>
      ),
      teacherNotes: (
        <p>
          Ask: &ldquo;If two functions have the same derivative, must they be the same function?&rdquo; No, they can
          differ by a constant. This becomes the &ldquo;+ C&rdquo; in antiderivatives (Unit 6).
        </p>
      ),
    },
    {
      id: 'multiple',
      title: 'Constant multiples scale slopes',
      content: (
        <>
          <Prose>
            <p>
              Multiplying by <Tex>k</Tex> stretches the graph vertically. Every rise is multiplied by <Tex>k</Tex> while
              the runs stay the same, so every slope is multiplied by <Tex>k</Tex>.
            </p>
          </Prose>
          <ShiftStretchExplorer mode="scale" />
          <Callout kind="idea">
            <p>
              <strong>Constant multiple rule:</strong>{' '}
              <Tex>{String.raw`\frac{d}{dx}\big[k\,f(x)\big] = k\,f'(x)`}</Tex>. Try <Tex>k = -1</Tex>: the graph flips
              and so does every slope.
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: 'sum',
      title: 'Slopes add',
      content: (
        <>
          <Prose>
            <p>
              Stack two functions. Over a run of 1, the rise of <Tex>f + g</Tex> is the rise of <Tex>f</Tex> plus the
              rise of <Tex>g</Tex>. Drag the point and compare the vertical legs of the three slope triangles.
            </p>
          </Prose>
          <SumRuleExplorer />
          <Callout kind="idea">
            <p>
              <strong>Sum and difference rules:</strong>{' '}
              <Tex>{String.raw`\frac{d}{dx}\big[f(x) \pm g(x)\big] = f'(x) \pm g'(x)`}</Tex>
            </p>
          </Callout>
        </>
      ),
      teacherNotes: (
        <p>
          For x past π/2 the teal and violet bars point in opposite directions, so the slopes partly cancel. Near x ≈
          −1 they cancel exactly and the sum&rsquo;s tangent line is flat.
        </p>
      ),
    },
    {
      id: 'polynomials',
      title: 'Any polynomial',
      content: (
        <>
          <Prose>
            <p>
              Together with the power rule, these rules differentiate every polynomial, one term at a time. Each term of{' '}
              <Tex>{"f'"}</Tex> is colored to match the term of <Tex>f</Tex> it came from.
            </p>
          </Prose>
          <PolynomialMachine />
          <Callout kind="think">
            <p>
              Make <Tex>f</Tex> a cubic. What kind of function is <Tex>{"f'"}</Tex>? Where does the dashed curve cross
              zero, and what is <Tex>f</Tex> doing there?
            </p>
          </Callout>
          <h3 className="text-lg font-semibold text-slate-900">Practice</h3>
          <PracticeGenerator generate={generatePolynomialProblem} />
        </>
      ),
      teacherNotes: (
        <p>
          The derivative of a degree-n polynomial has degree n − 1, and its zeros line up with the turning points of
          f. This is a good bridge to Unit 5 (critical points).
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
