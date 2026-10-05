import { Plot } from 'mafs'
import { type FormEvent, useState } from 'react'
import { Tex } from '@/components/math/Tex'
import { Button } from '@/components/ui/Button'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import type { RealFunction } from '@/lib/calculus'
import { colors } from '@/curriculum/math/shared/colors'
import { DerivativeTracer } from '@/curriculum/math/shared/DerivativeTracer'
import { parseMath } from '@/curriculum/math/shared/mathjs'
import { wholePower } from './powers'

/** Trace the slopes of xⁿ, then type a formula for f′ and see whether it runs through the dots. */
export function GuessTheDerivative() {
  const [n, setN] = useState(3)
  const fn = wholePower(n)
  const [input, setInput] = useState('')
  const [guess, setGuess] = useState<{ n: number; y: RealFunction; matches: boolean }>()
  const [error, setError] = useState<string>()

  const plotGuess = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const compiled = (await parseMath(input)).compile()
      const y: RealFunction = (x) => {
        const v = compiled.evaluate({ x })
        return typeof v === 'number' ? v : NaN
      }
      const matches = [-1.7, -0.6, 0.4, 1.3, 1.9].every((x) => Math.abs(y(x) - fn.df(x)) < 1e-6 * Math.max(1, Math.abs(fn.df(x))))
      setGuess({ n, y, matches })
      setError(undefined)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const current = guess?.n === n ? guess : undefined

  const guessPanel = (
    <form onSubmit={plotGuess} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <label className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-600">Your guess:</span>
        <Tex>{"f'(x) ="}</Tex>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 2x^2"
          className="w-32 rounded-lg border border-slate-300 px-2 py-1 font-mono text-sm focus:border-slate-900 focus:outline-none"
          spellCheck={false}
        />
        <Button type="submit" disabled={!input.trim()}>
          Plot
        </Button>
      </label>
      {error && <p className="text-sm text-rose-700">{error}</p>}
      {current && (
        <p className={`rounded-lg px-3 py-2 text-sm ${current.matches ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>
          {current.matches
            ? '✓ Your violet curve runs through every slope dot. That is the derivative!'
            : 'Your violet curve misses the slope dots somewhere. Adjust and try again.'}
        </p>
      )}
    </form>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">Power</span>
        <SegmentedControl
          ariaLabel="Power n"
          value={n}
          onChange={setN}
          options={[2, 3, 4, 5].map((v) => ({ value: v, label: <Tex>{`x^{${v}}`}</Tex> }))}
        />
      </div>
      <DerivativeTracer
        key={n}
        fn={fn}
        derivativeOverlay={current && <Plot.OfX y={current.y} color={colors.second} weight={2.5} style="dashed" />}
        panelExtra={guessPanel}
      />
    </div>
  )
}
