import { Callout, Prose } from '@/components/lesson/Callout'
import { type LessonStep, LessonPlayer } from '@/components/lesson/LessonPlayer'
import { PracticeGenerator } from '@/components/quiz/PracticeGenerator'
import { Quiz } from '@/components/quiz/Quiz'
import { generateMixedProblem } from './mixedPractice'
import { questions } from './questions'
import { RulesReference } from './RulesReference'
import { Workshop } from './Workshop'

export default function Unit2ReviewLesson() {
  const steps: LessonStep[] = [
    {
      id: 'rules',
      title: 'Every rule on one page',
      content: (
        <>
          <Prose>
            <p>Click any card to jump back to the lesson where the rule was introduced.</p>
          </Prose>
          <RulesReference />
        </>
      ),
      teacherNotes: <p>Good for projecting during a review day, or printing (Ctrl/Cmd + P) as a reference sheet.</p>,
    },
    {
      id: 'workshop',
      title: 'Derivative workshop',
      content: (
        <>
          <Prose>
            <p>
              Type any function. The server names the rule used at each step, and the graph shows the function with its
              derivative.
            </p>
          </Prose>
          <Workshop />
          <Callout kind="think">
            <p>
              Try <code>sin(2x)</code> or <code>(x^2+1)^5</code>. The workshop labels the step &ldquo;chain rule&rdquo;,
              which is coming up in Unit 3.
            </p>
          </Callout>
        </>
      ),
      teacherNotes: (
        <p>
          Use it to check student work live: type a student&rsquo;s homework function and walk through the steps. It
          handles every Unit 2 rule, including combinations like <code>3x^2 e^x / sin x</code>.
        </p>
      ),
    },
    {
      id: 'mixed',
      title: 'Mixed practice',
      content: (
        <>
          <Prose>
            <p>Problems from every topic, shuffled. Deciding <em>which</em> rule to use is half the skill.</p>
          </Prose>
          <PracticeGenerator generate={generateMixedProblem} />
        </>
      ),
    },
    {
      id: 'check',
      title: 'AP-style review',
      content: <Quiz questions={questions} />,
    },
  ]

  return <LessonPlayer steps={steps} />
}
