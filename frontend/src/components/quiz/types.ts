import type { ReactNode } from 'react'

export interface CheckResult {
  correct: boolean
  /** Extra feedback, e.g. "Couldn't read that expression." */
  note?: string
}

interface BaseQuestion {
  id: string
  prompt: ReactNode
  /** Shown once the student answers correctly or the teacher reveals the answer. */
  explanation: ReactNode
}

export interface ChoiceQuestion extends BaseQuestion {
  kind: 'choice'
  choices: { id: string; label: ReactNode }[]
  answer: string
}

export interface InputQuestion extends BaseQuestion {
  kind: 'input'
  /** Rendered before the text box, e.g. <Tex>f'(2) =</Tex>. */
  inputPrefix?: ReactNode
  placeholder?: string
  /** The correct answer as displayed by "Reveal answer". */
  answer: ReactNode
  /** Subject-specific grading: numeric tolerance, symbolic equivalence, etc. */
  check: (response: string) => CheckResult | Promise<CheckResult>
}

export type QuizQuestion = ChoiceQuestion | InputQuestion
