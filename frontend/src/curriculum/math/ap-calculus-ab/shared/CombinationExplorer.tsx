import { Coordinates, Line, Mafs, MovablePoint, Plot } from 'mafs'
import 'mafs/core.css'
import { useState } from 'react'
import { ExplorerLayout } from '@/components/lesson/ExplorerLayout'
import { ValueTable } from '@/components/lesson/ValueTable'
import { Tex } from '@/components/math/Tex'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { numericDerivative } from '@/lib/calculus'
import { fmt, paren } from '@/lib/format'
import { colors } from '@/curriculum/math/shared/colors'
import { sampleRange, type Vector2 } from '@/curriculum/math/shared/functions'
import { type Factor, productFactors, quotientFactors } from './factors'

const VIEW_X: Vector2 = [-2, 3]

interface Mistake {
  id: string
  label: string
  tex: string
  value: number
}

/**
 * Combine two functions as f·g or f/g. The tangent line drawn with the correct rule hugs the
 * curve; the tangent from a common mistake (dashed red) visibly misses it.
 */
export function CombinationExplorer({ mode }: { mode: 'product' | 'quotient' }) {
  const options = mode === 'product' ? productFactors : quotientFactors
  const [fId, setFId] = useState(options.f[0].id)
  const [gId, setGId] = useState(options.g[0].id)
  const [mistakeId, setMistakeId] = useState('swap')
  const [a, setA] = useState(1)

  const f = options.f.find((o) => o.id === fId)!
  const g = options.g.find((o) => o.id === gId)!
  const min = Math.max(f.min ?? -Infinity, g.min ?? -Infinity)
  const point = Math.max(a, min + 0.1)

  const h = mode === 'product' ? (x: number) => f.f(x) * g.f(x) : (x: number) => f.f(x) / g.f(x)
  const [fa, dfa, ga, dga] = [f.f(point), f.df(point), g.f(point), g.df(point)]
  const ha = h(point)

  const s = (v: number) => paren(fmt(v))
  const correct =
    mode === 'product'
      ? { value: dfa * ga + fa * dga, tex: `${s(dfa)}\\cdot${s(ga)} + ${s(fa)}\\cdot${s(dga)}` }
      : { value: (dfa * ga - fa * dga) / ga ** 2, tex: `\\frac{${s(dfa)}\\cdot${s(ga)} - ${s(fa)}\\cdot${s(dga)}}{${s(ga)}^2}` }

  const mistakes: Mistake[] =
    mode === 'product'
      ? [{ id: 'swap', label: 'f′ · g′', tex: "f'\\,g'", value: dfa * dga }]
      : [
          { id: 'swap', label: 'f′ / g′', tex: "\\frac{f'}{g'}", value: dfa / dga },
          { id: 'sign', label: 'numerator flipped', tex: "\\frac{f\\,g' - f'\\,g}{g^2}", value: (fa * dga - dfa * ga) / ga ** 2 },
        ]
  const mistake = mistakes.find((m) => m.id === mistakeId) ?? mistakes[0]

  const domain: Vector2 = [Math.max(VIEW_X[0], min + 0.01), VIEW_X[1]]
  const view = { x: VIEW_X, y: sampleRange(h, domain[0], domain[1], 8) }
  view.y = [Math.min(view.y[0], -1), Math.max(view.y[1], 1)]
  const A: Vector2 = [point, ha]
  const symbol = mode === 'product' ? '\\cdot' : '/'

  const picker = (label: string, list: Factor[], value: string, onChange: (id: string) => void, color: string) => (
    <div className="flex flex-wrap items-center gap-2">
      <Tex>{`\\textcolor{${color}}{${label}(x) =}`}</Tex>
      <SegmentedControl ariaLabel={label} value={value} onChange={onChange} options={list.map((o) => ({ value: o.id, label: <Tex>{o.tex}</Tex> }))} />
    </div>
  )

  const graph = (
    <Mafs viewBox={view} height={440} preserveAspectRatio={false} pan={false}>
      <Coordinates.Cartesian subdivisions={false} />
      <Plot.OfX y={f.f} domain={domain} color={colors.first} weight={2} opacity={0.5} />
      <Plot.OfX y={g.f} domain={domain} color={colors.second} weight={2} opacity={0.5} />
      <Plot.OfX y={h} domain={domain} color={colors.combined} weight={3.5} />
      {Number.isFinite(mistake.value) && (
        <Line.PointSlope point={A} slope={mistake.value} color={colors.wrong} style="dashed" weight={2} />
      )}
      <Line.PointSlope point={A} slope={correct.value} color={colors.instant} weight={2.5} />
      <MovablePoint
        point={A}
        onMove={([x]) => setA(x)}
        constrain={([x]) => {
          const v = Math.min(VIEW_X[1] - 0.1, Math.max(domain[0] + 0.1, Math.round(x * 10) / 10))
          return [v, h(v)]
        }}
        color={colors.combined}
      />
    </Mafs>
  )

  const panel = (
    <>
      <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
        {picker('f', options.f, fId, setFId, colors.first)}
        {picker('g', options.g, gId, setGId, colors.second)}
        <Tex>{`\\textcolor{${colors.combined}}{h(x) = f(x) ${symbol} g(x)}`}</Tex>
      </div>
      <ValueTable
        rows={[
          { label: `x = ${fmt(point, 1)}`, values: ['f', "f′", 'g', "g′"] },
          { label: 'value', values: [fa, dfa, ga, dga].map((v) => fmt(v)) },
        ]}
      />
      <div className="space-y-2 overflow-x-auto rounded-xl border border-slate-200 bg-white px-4 py-3">
        <p className="text-sm font-medium" style={{ color: colors.instant }}>
          ✓ {mode === 'product' ? 'Product rule' : 'Quotient rule'}
        </p>
        <Tex>{`h'(${fmt(point, 1)}) = ${correct.tex} = \\textcolor{${colors.instant}}{${fmt(correct.value)}}`}</Tex>
        <p className="pt-2 text-sm font-medium" style={{ color: colors.wrong }}>
          ✗ Common mistake: <Tex>{mistake.tex}</Tex> gives {fmt(mistake.value)}
        </p>
        {mistakes.length > 1 && (
          <SegmentedControl ariaLabel="Mistake" value={mistake.id} onChange={setMistakeId} options={mistakes.map((m) => ({ value: m.id, label: m.label }))} />
        )}
        <p className="pt-2 text-sm text-slate-600">
          Slope measured from the graph: <strong>{fmt(numericDerivative(h, point))}</strong>
        </p>
      </div>
    </>
  )

  return <ExplorerLayout graph={graph} panel={panel} />
}
