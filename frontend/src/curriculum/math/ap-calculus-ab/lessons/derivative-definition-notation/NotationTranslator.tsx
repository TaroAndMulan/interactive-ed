import { useState } from 'react'
import { Tex } from '@/components/math/Tex'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Slider } from '@/components/ui/Slider'
import { fmt } from '@/lib/format'
import { colors } from '@/curriculum/math/shared/colors'

interface Context {
  id: string
  label: string
  /** Input and output variable names, e.g. t and s. */
  input: string
  output: string
  inputUnit: string
  outputUnit: string
  rateUnit: string
  tex: string
  f: (x: number) => number
  df: (x: number) => number
  range: [number, number]
  describe: (a: string, rate: string, rising: boolean) => string
}

const contexts: Context[] = [
  {
    id: 'math',
    label: 'Pure math',
    input: 'x',
    output: 'y',
    inputUnit: '',
    outputUnit: '',
    rateUnit: '',
    tex: 'x^2',
    f: (x) => x * x,
    df: (x) => 2 * x,
    range: [-3, 3],
    describe: (a, rate, rising) =>
      `At x = ${a}, the graph of y = x² is ${rising ? 'rising' : 'falling'}: its tangent line has slope ${rate}.`,
  },
  {
    id: 'car',
    label: 'Moving car',
    input: 't',
    output: 's',
    inputUnit: 's',
    outputUnit: 'm',
    rateUnit: 'm/s',
    tex: '3t^2 - 0.2t^3',
    f: (t) => 3 * t ** 2 - 0.2 * t ** 3,
    df: (t) => 6 * t - 0.6 * t ** 2,
    range: [0, 10],
    describe: (a, rate) => `At t = ${a} seconds, the car's position is changing at ${rate} meters per second.`,
  },
  {
    id: 'tank',
    label: 'Draining tank',
    input: 't',
    output: 'V',
    inputUnit: 'min',
    outputUnit: 'L',
    rateUnit: 'L/min',
    tex: '500 - 20t + 0.2t^2',
    f: (t) => 500 - 20 * t + 0.2 * t ** 2,
    df: (t) => -20 + 0.4 * t,
    range: [0, 40],
    describe: (a, rate, rising) =>
      `At t = ${a} minutes, the volume is ${rising ? 'increasing' : 'decreasing'} at ${rate.replace('-', '')} liters per minute.`,
  },
]

/** Every common derivative notation for the same number, in context and with units. */
export function NotationTranslator() {
  const [contextId, setContextId] = useState('car')
  const c = contexts.find((ctx) => ctx.id === contextId)!
  const [a, setA] = useState(3)
  const point = Math.min(Math.max(a, c.range[0]), c.range[1])
  const rate = c.df(point)
  const value = `${fmt(rate)}${c.rateUnit ? `\\text{ ${c.rateUnit}}` : ''}`
  const [x, y, at] = [c.input, c.output, fmt(point, 1)]

  const rows: [string, string][] = [
    [`f'(${at})`, `“f prime of ${at}”`],
    [`\\left.\\frac{d${y}}{d${x}}\\right|_{${x} = ${at}}`, `“d${y} d${x} at ${x} = ${at}”`],
    [`${y}'(${at})`, `“${y} prime at ${at}”`],
    [`\\left.\\frac{d}{d${x}}\\big[f(${x})\\big]\\right|_{${x} = ${at}}`, `“the derivative of f(${x}) at ${at}”`],
  ]

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl
          ariaLabel="Context"
          value={contextId}
          onChange={setContextId}
          options={contexts.map((ctx) => ({ value: ctx.id, label: ctx.label }))}
        />
        <Tex>{`${y} = f(${x}) = ${c.tex}`}</Tex>
      </div>
      <Slider
        label={<Tex>{x}</Tex>}
        value={point}
        min={c.range[0]}
        max={c.range[1]}
        step={0.5}
        onChange={setA}
        display={`${at}${c.inputUnit ? ` ${c.inputUnit}` : ''}`}
      />
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-sm text-slate-500">
            <tr className="border-b border-slate-200">
              <th className="py-2 pr-4 font-medium">Notation</th>
              <th className="py-2 pr-4 font-medium">Read it as</th>
              <th className="py-2 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([notation, spoken]) => (
              <tr key={spoken} className="border-b border-slate-100">
                <td className="py-2 pr-4">
                  <Tex>{notation}</Tex>
                </td>
                <td className="py-2 pr-4 text-slate-600">{spoken}</td>
                <td className="py-2">
                  <Tex>{`\\textcolor{${colors.instant}}{${value}}`}</Tex>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="rounded-lg bg-blue-50 px-4 py-3 text-blue-950">{c.describe(at, fmt(rate), rate >= 0)}</p>
      {c.rateUnit && (
        <p className="text-sm text-slate-600">
          Units of a derivative are always <em>output units per input unit</em>: {c.outputUnit} per {c.inputUnit} ={' '}
          {c.rateUnit}.
        </p>
      )}
    </div>
  )
}
