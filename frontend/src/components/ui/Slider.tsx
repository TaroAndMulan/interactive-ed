import type { ReactNode } from 'react'

interface SliderProps {
  label: ReactNode
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  /** Formatted value shown at the right of the label. */
  display?: ReactNode
  color?: string
}

export function Slider({ label, value, min, max, step = 0.01, onChange, display, color }: SliderProps) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3 text-sm text-slate-600">
        <span>{label}</span>
        {display !== undefined && <span className="font-mono text-slate-900">{display}</span>}
      </span>
      <input
        type="range"
        className="mt-1 w-full cursor-pointer"
        style={{ accentColor: color }}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  )
}
