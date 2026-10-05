import { AlgebraStepper } from '@/components/lesson/AlgebraStepper'
import { Callout, Prose } from '@/components/lesson/Callout'
import { type LessonStep, LessonPlayer } from '@/components/lesson/LessonPlayer'
import { Tex } from '@/components/math/Tex'
import { PracticeGenerator } from '@/components/quiz/PracticeGenerator'
import { Quiz } from '@/components/quiz/Quiz'
import { colors } from '@/curriculum/math/shared/colors'
import { GrowingSquare } from './GrowingSquare'
import { GuessTheDerivative } from './GuessTheDerivative'
import { PatternTable } from './PatternTable'
import { PowerFamily } from './PowerFamily'
import { generatePowerProblem } from './practice'
import { questions } from './questions'

export default function PowerRuleLesson() {
  const steps: LessonStep[] = [
    {
      id: 'pattern',
      title: 'Hunt for the pattern',
      content: (
        <>
          <Prose>
            <p>
              Computing every derivative from the limit definition is slow. Let&rsquo;s look for a shortcut. Here are
              slopes of <Tex>x^n</Tex> at several points, each measured with a tiny secant line:
            </p>
          </Prose>
          <PatternTable />
          <Prose>
            <p>Now test your conjecture: type a formula for <Tex>{"f'(x)"}</Tex> and see if it runs through the slope dots.</p>
          </Prose>
          <GuessTheDerivative />
        </>
      ),
      teacherNotes: (
        <p>
          Give pairs two minutes with the table before revealing. Watch for the guess &ldquo;<Tex>{'x^{n-1}'}</Tex>&rdquo;
          (forgetting the coefficient): plotting it shows the curve has the right shape but the wrong height.
        </p>
      ),
    },
    {
      id: 'why',
      title: 'Why it works',
      content: (
        <>
          <Prose>
            <p>
              Picture <Tex>{'x^2'}</Tex> as the area of a square with side <Tex>x</Tex>. Nudge the side by{' '}
              <Tex>h</Tex>: how much does the area grow?
            </p>
          </Prose>
          <GrowingSquare />
          <Prose>
            <p>The same idea works for any whole-number power, using the binomial expansion:</p>
          </Prose>
          <AlgebraStepper
            title={<Tex>{String.raw`\frac{d}{dx}\left[x^n\right]`}</Tex>}
            lines={[
              { tex: String.raw`\frac{d}{dx}\left[x^n\right] = \lim_{h\to 0}\frac{(x+h)^n - x^n}{h}`, note: 'Definition of the derivative.' },
              {
                tex: String.raw`(x+h)^n = x^n + n x^{n-1}h + \binom{n}{2}x^{n-2}h^2 + \cdots + h^n`,
                note: 'Expand. Only the first two terms have fewer than two factors of h.',
              },
              {
                tex: String.raw`\frac{(x+h)^n - x^n}{h} = n x^{n-1} + \underbrace{\binom{n}{2}x^{n-2}h + \cdots + h^{n-1}}_{\text{every term has an } h}`,
                note: 'The xⁿ cancels; divide every remaining term by h.',
              },
              {
                tex: `\\frac{d}{dx}\\left[x^n\\right] = \\textcolor{${colors.instant}}{n\\,x^{n-1}}`,
                note: 'Let h → 0: every term with an h disappears.',
              },
            ]}
          />
        </>
      ),
      teacherNotes: (
        <p>
          The square picture is from 3Blue1Brown&rsquo;s &ldquo;Essence of Calculus&rdquo;. For <Tex>{'x^3'}</Tex>,
          ask students to imagine a cube: three square slabs of area <Tex>{'x^2'}</Tex> give <Tex>{'3x^2'}</Tex>.
        </p>
      ),
    },
    {
      id: 'any-exponent',
      title: 'Any exponent',
      content: (
        <>
          <Prose>
            <p>The power rule works for negative and fractional exponents too. First rewrite roots and reciprocals as powers:</p>
            <Tex block>{`\\frac{d}{dx}\\left[x^n\\right] = \\textcolor{${colors.instant}}{n\\,x^{n-1}} \\quad \\text{for every real } n`}</Tex>
          </Prose>
          <PowerFamily />
          <Callout kind="think">
            <p>
              Look at <Tex>{String.raw`\sqrt[3]{x}`}</Tex> near <Tex>x = 0</Tex>. Its derivative blows up. Which picture
              from topic 2.4 is this?
            </p>
          </Callout>
          <h3 className="text-lg font-semibold text-slate-900">Practice</h3>
          <PracticeGenerator generate={generatePowerProblem} />
        </>
      ),
      teacherNotes: (
        <p>
          The cube root answers the Think question: a vertical tangent at 0. The power rule&rsquo;s{' '}
          <Tex>{String.raw`\frac{1}{3\sqrt[3]{x^2}}`}</Tex> is undefined there, which matches.
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
