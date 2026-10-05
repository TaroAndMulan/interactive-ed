import { Callout, Prose } from '@/components/lesson/Callout'
import { type LessonStep, LessonPlayer } from '@/components/lesson/LessonPlayer'
import { Tex } from '@/components/math/Tex'
import { Quiz } from '@/components/quiz/Quiz'
import { NestedSets } from './NestedSets'
import { PiecewiseTuner } from './PiecewiseTuner'
import { questions } from './questions'
import { SmoothnessGallery } from './SmoothnessGallery'

export default function DifferentiabilityLesson() {
  const steps: LessonStep[] = [
    {
      id: 'gallery',
      title: 'When does f′(c) exist?',
      content: (
        <>
          <Prose>
            <p>
              <Tex>{"f'(c)"}</Tex> exists only when the secant slopes from <strong>both</strong> sides approach the{' '}
              <strong>same finite</strong> number:
            </p>
            <Tex block>{String.raw`\lim_{h \to 0^-} \frac{f(c+h) - f(c)}{h} = \lim_{h \to 0^+} \frac{f(c+h) - f(c)}{h}`}</Tex>
            <p>
              Pick an example. Shrink <Tex>h</Tex> and zoom in at <Tex>x = 1</Tex>. Do the left (teal) and right (violet)
              secant slopes agree?
            </p>
          </Prose>
          <SmoothnessGallery />
          <Callout kind="idea">
            <p>
              A derivative fails to exist at a <strong>corner</strong>, a <strong>cusp</strong>, a{' '}
              <strong>vertical tangent</strong>, or any <strong>discontinuity</strong>. Zoom test: a function is
              differentiable at <Tex>c</Tex> when zooming in makes the graph look like a non-vertical straight line.
            </p>
          </Callout>
        </>
      ),
      teacherNotes: (
        <>
          <p>
            Have students predict &ldquo;differentiable or not&rdquo; for each example before revealing the verdict.
            The &ldquo;misplaced point&rdquo; case surprises most: the graph looks like a line, but the slopes still
            blow up because they all start from the misplaced point.
          </p>
          <p>Connect to Unit 1: the jump and misplaced-point cases fail continuity (topics 1.10–1.11).</p>
        </>
      ),
    },
    {
      id: 'logic',
      title: 'Differentiable ⇒ continuous',
      content: (
        <>
          <Prose>
            <p>Every differentiable function is continuous, but not every continuous function is differentiable.</p>
          </Prose>
          <NestedSets />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Callout kind="idea" title="True">
              <p>If f is differentiable at c, then f is continuous at c.</p>
            </Callout>
            <Callout kind="idea" title="Also true (contrapositive)">
              <p>If f is not continuous at c, then f is not differentiable at c.</p>
            </Callout>
            <Callout kind="think" title="False (converse)">
              <p>
                If f is continuous at c, then f is differentiable at c. Counterexample: <Tex>|x|</Tex> at 0.
              </p>
            </Callout>
          </div>
        </>
      ),
      teacherNotes: (
        <p>
          Why does differentiability force continuity? If the difference quotient has a finite limit, then{' '}
          <Tex>{String.raw`f(c+h) - f(c) = \frac{f(c+h) - f(c)}{h} \cdot h \to f'(c) \cdot 0 = 0`}</Tex>. Worth a minute
          with strong classes.
        </p>
      ),
    },
    {
      id: 'tune',
      title: 'Make it differentiable',
      content: (
        <>
          <Prose>
            <p>
              A classic AP question: choose constants so a piecewise function is differentiable where the pieces meet.
              That takes <strong>two</strong> conditions: the pieces must meet (continuity), and their slopes must match.
            </p>
          </Prose>
          <PiecewiseTuner />
          <Callout kind="ap">
            <p>
              Write both conditions as equations, then solve. Check continuity first. If the pieces don&rsquo;t meet,
              matching slopes doesn&rsquo;t help.
            </p>
          </Callout>
        </>
      ),
      teacherNotes: (
        <p>
          Solution: slopes give <Tex>2a = 4</Tex>, so <Tex>a = 2</Tex>. Continuity gives <Tex>a = 4 + b</Tex>, so{' '}
          <Tex>b = -2</Tex>. Have students set slopes equal first with the continuity check failing, so they see that
          matching slopes alone isn&rsquo;t enough.
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
