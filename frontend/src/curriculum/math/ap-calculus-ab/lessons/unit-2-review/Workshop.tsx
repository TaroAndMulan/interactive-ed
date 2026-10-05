import { type FormEvent, useEffect, useState } from 'react'
import { Tex } from '@/components/math/Tex'
import { Button } from '@/components/ui/Button'
import { DerivativeStepsPanel } from '@/curriculum/math/shared/DerivativeStepsPanel'
import { DerivativeTracer } from '@/curriculum/math/shared/DerivativeTracer'
import { compileCustomFunction, type MathFunction } from '@/curriculum/math/shared/functions'

const EXAMPLES = ['x^3 - 4x + 7', 'x^2 sin x', 'e^x / x', 'tan x', 'sqrt(x) + 1/x', 'x ln x - x', '(x^2 + 1)/(x - 1)', '3sec x - cot x']

/** Type any function: see which rules apply, step by step, and trace its slope graph. */
export function Workshop() {
  const [input, setInput] = useState(EXAMPLES[1])
  const [expression, setExpression] = useState(EXAMPLES[1])
  const [fn, setFn] = useState<MathFunction>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    let cancelled = false
    compileCustomFunction(expression)
      .then((compiled) => {
        if (cancelled) return
        setFn(compiled)
        setError(undefined)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setFn(undefined)
        setError(err instanceof Error ? err.message : String(err))
      })
    return () => {
      cancelled = true
    }
  }, [expression])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (input.trim()) setExpression(input.trim())
  }

  const choose = (example: string) => {
    setInput(example)
    setExpression(example)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <Tex>{'f(x) ='}</Tex>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Function to differentiate"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 font-mono focus:border-slate-900 focus:outline-none"
          spellCheck={false}
        />
        <Button type="submit" variant="primary">
          Differentiate
        </Button>
        <div className="flex w-full flex-wrap gap-1 pt-1">
          <span className="text-sm text-slate-500">Try:</span>
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => choose(example)}
              className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-xs text-slate-700 hover:bg-slate-200"
            >
              {example}
            </button>
          ))}
        </div>
      </form>
      {error && <p className="text-sm text-rose-700">Couldn&rsquo;t graph that: {error}</p>}
      <DerivativeStepsPanel expression={expression} />
      {fn && <DerivativeTracer key={fn.id} fn={fn} revealed />}
    </div>
  )
}
