import { type FormEvent, useState } from 'react'
import { Tex } from '@/components/math/Tex'
import { Button } from '@/components/ui/Button'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { compileCustomFunction, type MathFunction, presetFunctions } from './functions'

const CUSTOM = 'custom'

/** Choose one of the preset functions, or type your own (parsed with mathjs). */
export function FunctionPicker({ value, onChange }: { value: MathFunction; onChange: (fn: MathFunction) => void }) {
  const isCustom = !presetFunctions.includes(value)
  const [customOpen, setCustomOpen] = useState(isCustom)
  const [input, setInput] = useState(isCustom ? value.expression : 'x^3/3 - x')
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)

  const select = (id: string) => {
    if (id === CUSTOM) {
      setCustomOpen(true)
      return
    }
    setCustomOpen(false)
    onChange(presetFunctions.find((fn) => fn.id === id)!)
  }

  const graphCustom = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    try {
      onChange(await compileCustomFunction(input))
      setError(undefined)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-slate-500">
          <Tex>{'f(x) ='}</Tex>
        </span>
        <SegmentedControl
          ariaLabel="Function"
          value={customOpen ? CUSTOM : value.id}
          onChange={select}
          options={[
            ...presetFunctions.map((fn) => ({ value: fn.id, label: <Tex>{fn.tex}</Tex> })),
            { value: CUSTOM, label: 'Your own…' },
          ]}
        />
      </div>
      {customOpen && (
        <form onSubmit={graphCustom} className="flex flex-wrap items-center gap-2">
          <Tex>{'f(x) ='}</Tex>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Custom function of x"
            placeholder="e.g. x^3/3 - x, sqrt(x), abs(x)"
            className="w-64 rounded-lg border border-slate-300 px-3 py-1.5 font-mono text-sm focus:border-slate-900 focus:outline-none"
            spellCheck={false}
          />
          <Button type="submit" variant="primary" disabled={busy || !input.trim()}>
            Graph it
          </Button>
          {error && <span className="text-sm text-rose-700">{error}</span>}
        </form>
      )}
    </div>
  )
}
