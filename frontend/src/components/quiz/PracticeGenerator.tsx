import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { QuestionCard } from './Quiz'
import type { InputQuestion } from './types'

export type PracticeProblem = Omit<InputQuestion, 'id' | 'kind'>

/** Endless practice: a fresh randomly generated problem whenever the student asks. */
export function PracticeGenerator({ generate }: { generate: () => PracticeProblem }) {
  const [problem, setProblem] = useState(generate)
  const [count, setCount] = useState(1)
  const [streak, setStreak] = useState(0)
  const [answered, setAnswered] = useState(false)

  const next = () => {
    setProblem(generate())
    setCount(count + 1)
    setAnswered(false)
  }

  return (
    <div className="space-y-3">
      <QuestionCard
        key={count}
        number={count}
        question={{ id: `practice-${count}`, kind: 'input', ...problem }}
        onResult={(correct) => {
          if (answered) return
          setAnswered(true)
          setStreak(correct ? streak + 1 : 0)
        }}
      />
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600">
          First-try streak: <strong>{streak}</strong>
        </span>
        <Button variant="primary" onClick={next}>
          New problem →
        </Button>
      </div>
    </div>
  )
}

