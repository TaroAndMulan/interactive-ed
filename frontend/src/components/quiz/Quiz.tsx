import { type FormEvent, useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { QuizQuestion } from './types'

/** A list of self-checking questions. The score counts first attempts only. */
export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [firstAttempts, setFirstAttempts] = useState<Record<string, boolean>>({})
  const answered = Object.keys(firstAttempts).length
  const correct = Object.values(firstAttempts).filter(Boolean).length

  return (
    <div className="space-y-4">
      {questions.map((question, i) => (
        <QuestionCard
          key={question.id}
          number={i + 1}
          question={question}
          onResult={(ok) =>
            setFirstAttempts((prev) => (question.id in prev ? prev : { ...prev, [question.id]: ok }))
          }
        />
      ))}
      {answered > 0 && (
        <p className="text-right text-sm text-slate-600">
          First-try score: <strong>{correct}</strong> / {questions.length}
          {answered < questions.length && ` (${questions.length - answered} unanswered)`}
        </p>
      )}
    </div>
  )
}

type Status = 'idle' | 'checking' | 'correct' | 'incorrect'

export function QuestionCard({
  number,
  question,
  onResult,
}: {
  number: number
  question: QuizQuestion
  onResult: (correct: boolean) => void
}) {
  const [response, setResponse] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [note, setNote] = useState<string>()
  const [revealed, setRevealed] = useState(false)

  const respond = (value: string) => {
    setResponse(value)
    setStatus('idle')
    setNote(undefined)
  }

  const check = async (event: FormEvent) => {
    event.preventDefault()
    if (!response.trim() || status === 'checking') return
    setStatus('checking')
    try {
      const result =
        question.kind === 'choice' ? { correct: response === question.answer } : await question.check(response)
      setStatus(result.correct ? 'correct' : 'incorrect')
      setNote(result.note)
      onResult(result.correct)
    } catch {
      setStatus('idle')
      setNote('Something went wrong while checking. Please try again.')
    }
  }

  const showExplanation = status === 'correct' || revealed

  return (
    <form onSubmit={check} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
          {number}
        </span>
        <div className="min-w-0 flex-1 space-y-4">
          <div className="leading-relaxed text-slate-800">{question.prompt}</div>

          {question.kind === 'choice' ? (
            <div role="radiogroup" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {question.choices.map((choice) => {
                const selected = response === choice.id
                const isAnswer = revealed && choice.id === question.answer
                return (
                  <button
                    key={choice.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => respond(choice.id)}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      isAnswer
                        ? 'border-emerald-500 bg-emerald-50'
                        : selected
                          ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                          : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {choice.label}
                  </button>
                )
              })}
            </div>
          ) : (
            <label className="flex flex-wrap items-center gap-3">
              {question.inputPrefix}
              <input
                value={response}
                onChange={(e) => respond(e.target.value)}
                placeholder={question.placeholder}
                className="w-56 rounded-lg border border-slate-300 px-3 py-2 font-mono focus:border-slate-900 focus:outline-none"
                autoComplete="off"
                spellCheck={false}
              />
            </label>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" variant="primary" disabled={!response.trim() || status === 'checking'}>
              {status === 'checking' ? 'Checking…' : 'Check'}
            </Button>
            {!showExplanation && (
              <Button variant="ghost" onClick={() => setRevealed(true)}>
                Reveal answer
              </Button>
            )}
            {status === 'correct' && <span className="font-medium text-emerald-700">✓ Correct!</span>}
            {status === 'incorrect' && <span className="font-medium text-rose-700">Not quite. Try again.</span>}
            {note && <span className="text-sm text-slate-500">{note}</span>}
          </div>

          {showExplanation && (
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-slate-700">
              {question.kind === 'input' && revealed && status !== 'correct' && (
                <p className="mb-2">
                  <span className="font-medium">Answer:</span> {question.answer}
                </p>
              )}
              {question.explanation}
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
