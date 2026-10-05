import { AlgebraStepper } from '@/components/lesson/AlgebraStepper'
import { Callout, Prose } from '@/components/lesson/Callout'
import { type LessonStep, LessonPlayer } from '@/components/lesson/LessonPlayer'
import { Tex } from '@/components/math/Tex'
import { PracticeGenerator } from '@/components/quiz/PracticeGenerator'
import { Quiz } from '@/components/quiz/Quiz'
import { colors } from '@/curriculum/math/shared/colors'
import { CombinationExplorer } from '../../shared/CombinationExplorer'
import { generateTableProblem } from '../../shared/tableProblems'
import { ProductArea } from './ProductArea'
import { questions } from './questions'

const rule = `\\frac{d}{dx}\\big[f(x)\\,g(x)\\big] = \\textcolor{${colors.instant}}{f'(x)\\,g(x) + f(x)\\,g'(x)}`

export default function ProductRuleLesson() {
  const steps: LessonStep[] = [
    {
      id: 'guess',
      title: 'Is (fg)′ = f′g′?',
      content: (
        <>
          <Prose>
            <p>
              The derivative of a sum is the sum of the derivatives. So is the derivative of a product the product of
              the derivatives? Test it: the pink curve is <Tex>{'f \\cdot g'}</Tex>. The dashed red line uses{' '}
              <Tex>{"f' \\cdot g'"}</Tex> as its slope.
            </p>
          </Prose>
          <CombinationExplorer mode="product" />
          <Callout kind="think">
            <p>
              Does the red line ever touch the curve the way a tangent should? The blue line uses a different formula.
              Can you figure out what it is from the numbers?
            </p>
          </Callout>
        </>
      ),
      teacherNotes: (
        <p>
          Let students work out the blue formula from the value table before naming the product rule. With{' '}
          <Tex>{'f = x^2'}</Tex>, <Tex>{'g = e^x'}</Tex>, and <Tex>x = 1</Tex>, the numbers are small enough to test
          hypotheses by hand.
        </p>
      ),
    },
    {
      id: 'area',
      title: 'The area model',
      content: (
        <>
          <Prose>
            <p>
              Picture <Tex>{'f(x) \\cdot g(x)'}</Tex> as the area of a rectangle with width <Tex>f</Tex> and height{' '}
              <Tex>g</Tex>. When <Tex>x</Tex> grows a little, both sides grow, and the area gains three pieces:
            </p>
          </Prose>
          <ProductArea />
          <Callout kind="idea">
            <p>Only the two strips survive the limit:</p>
            <Tex block>{rule}</Tex>
            <p>
              Memory aid: &ldquo;derivative of the first times the second, plus the first times the derivative of the
              second.&rdquo;
            </p>
          </Callout>
        </>
      ),
    },
    {
      id: 'proof',
      title: 'The proof',
      content: (
        <AlgebraStepper
          title="Proving the product rule from the definition"
          lines={[
            { tex: String.raw`(fg)'(x) = \lim_{h\to 0}\frac{f(x+h)g(x+h) - f(x)g(x)}{h}`, note: 'Definition of the derivative.' },
            {
              tex: String.raw`= \lim_{h\to 0}\frac{f(x+h)g(x+h) \textcolor{${colors.second}}{- f(x)g(x+h) + f(x)g(x+h)} - f(x)g(x)}{h}`,
              note: 'Subtract and add the same thing: the "missing" mixed term.',
            },
            {
              tex: String.raw`= \lim_{h\to 0}\left[\frac{f(x+h) - f(x)}{h}\,g(x+h) + f(x)\,\frac{g(x+h) - g(x)}{h}\right]`,
              note: 'Group into two difference quotients.',
            },
            {
              tex: rule,
              note: 'g is differentiable, so it is continuous (topic 2.4): g(x + h) → g(x).',
            },
          ]}
        />
      ),
      teacherNotes: (
        <p>
          The third line is the area picture in symbols: the first term is the side strip and the second is the top
          strip. The continuity step quietly uses topic 2.4. Ask students to spot it.
        </p>
      ),
    },
    {
      id: 'practice',
      title: 'Practice with tables',
      content: (
        <>
          <Callout kind="ap">
            <p>
              AP questions often give values of f, f′, g, and g′ in a table instead of formulas. Write the rule, then
              substitute.
            </p>
          </Callout>
          <PracticeGenerator generate={() => generateTableProblem('product')} />
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
