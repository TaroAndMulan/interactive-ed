import { Coordinates, Line, Mafs, MovablePoint, Plot, Point } from 'mafs'
import 'mafs/core.css'
import { useState } from 'react'
import { ExplorerLayout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { Slider } from '@/components/ui/Slider'
import { fmt } from '@/lib/format'
import { colors } from '@/curriculum/math/shared/colors'
import { onCurve, type Vector2 } from '@/curriculum/math/shared/functions'
import { mystery } from './mystery'

const f = mystery.f

/** Forward, backward and symmetric difference quotients from the same three table values. */
export function QuotientComparison() {
  const [a, setA] = useState(3)
  const [d, setD] = useState(1)

  const [L, A, R]: Vector2[] = [a - d, a, a + d].map((x) => [x, f(x)] as Vector2)
  const truth = mystery.df(a)
  const estimates = [
    { id: 'forward', label: 'Forward', color: colors.average, tex: String.raw`\frac{f(a+\Delta) - f(a)}{\Delta}`, value: (R[1] - A[1]) / d, through: [A, R] },
    { id: 'backward', label: 'Backward', color: colors.first, tex: String.raw`\frac{f(a) - f(a-\Delta)}{\Delta}`, value: (A[1] - L[1]) / d, through: [L, A] },
    { id: 'symmetric', label: 'Symmetric', color: colors.second, tex: String.raw`\frac{f(a+\Delta) - f(a-\Delta)}{2\Delta}`, value: (R[1] - L[1]) / (2 * d), through: [L, R] },
  ]
  const best = estimates.reduce((p, q) => (Math.abs(q.value - truth) < Math.abs(p.value - truth) ? q : p))

  const graph = (
    <Mafs viewBox={mystery.viewBox} height={420} pan={false}>
      <Coordinates.Cartesian subdivisions={false} />
      <Plot.OfX y={f} color={colors.curve} weight={3} />
      <Line.PointSlope point={A} slope={truth} color={colors.instant} weight={2} style="dashed" />
      {estimates.map((e) => (
        <Line.ThroughPoints key={e.id} point1={e.through[0]} point2={e.through[1]} color={e.color} weight={2} />
      ))}
      <Point x={L[0]} y={L[1]} color={colors.curve} />
      <Point x={R[0]} y={R[1]} color={colors.curve} />
      <MovablePoint point={A} onMove={([x]) => setA(x)} constrain={onCurve(f, 0.5, A)} color={colors.instant} />
    </Mafs>
  )

  const panel = (
    <>
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <Slider label={<Tex>{String.raw`\text{Table spacing } \Delta`}</Tex>} value={d} min={0.1} max={2} step={0.1} onChange={setD} display={fmt(d, 1)} />
        <table className="w-full text-center font-mono text-sm">
          <tbody>
            <tr className="text-slate-500">
              <th className="py-1 text-left font-sans font-medium">x</th>
              {[L, A, R].map(([x]) => (
                <td key={x}>{fmt(x, 1)}</td>
              ))}
            </tr>
            <tr>
              <th className="py-1 text-left font-sans font-medium text-slate-500">f(x)</th>
              {[L, A, R].map(([x, y]) => (
                <td key={x}>{fmt(y, 3)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {estimates.map((e) => (
          <div key={e.id} className="flex items-center justify-between gap-2 px-4 py-2">
            <div>
              <div className="text-sm font-medium" style={{ color: e.color }}>
                {e.label} {e === best && '★'}
              </div>
              <Tex>{e.tex}</Tex>
            </div>
            <div className="text-right font-mono">
              <div style={{ color: e.color }}>{fmt(e.value, 3)}</div>
              <div className="text-xs text-slate-500">error {fmt(Math.abs(e.value - truth), 3)}</div>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-sm font-medium" style={{ color: colors.instant }}>
            True slope f′({fmt(a, 1)})
          </span>
          <span className="font-mono" style={{ color: colors.instant }}>
            {fmt(truth, 3)}
          </span>
        </div>
      </div>
    </>
  )

  return <ExplorerLayout graph={graph} panel={panel} />
}
