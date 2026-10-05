import { Coordinates, Line, Mafs, Point } from 'mafs'
import 'mafs/core.css'
import { useState } from 'react'
import { Tex } from '@/components/math/Tex'
import { Button } from '@/components/ui/Button'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { fmt } from '@/lib/format'
import { colors } from '@/curriculum/math/shared/colors'

const t = [0, 2, 5, 7, 11, 12]
const H = [0, 80, 170, 210, 250, 254]
const TARGETS = [3, 6, 9]

/** AP-style table question: click two columns to estimate H′(target). */
export function DataTableEstimator() {
  const [target, setTarget] = useState(6)
  const [chosen, setChosen] = useState<number[]>([])

  const toggle = (i: number) => {
    if (chosen.includes(i)) setChosen(chosen.filter((j) => j !== i))
    else setChosen([...chosen.slice(-1), i].sort((p, q) => p - q))
  }

  const ideal = t.findIndex((v, i) => v < target && t[i + 1] > target)
  const [i, j] = chosen
  const ready = chosen.length === 2
  const estimate = ready ? (H[j] - H[i]) / (t[j] - t[i]) : NaN
  const contains = ready && t[i] < target && t[j] > target
  const verdict = !ready
    ? null
    : i === ideal && j === ideal + 1
      ? { ok: true, text: `Best choice: the data points closest to t = ${target} on either side.` }
      : contains
        ? { ok: false, text: `This interval contains t = ${target}, but closer data points give a better estimate.` }
        : { ok: false, text: `This interval doesn't contain t = ${target}. Pick points on either side of it.` }

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-slate-700">
        A weather balloon rises. Its height <Tex>H(t)</Tex>, in meters, is recorded <Tex>t</Tex> minutes after launch.
        Click two columns to estimate the rate the balloon is rising.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-slate-500">Estimate</span>
        <SegmentedControl
          ariaLabel="Target time"
          value={target}
          onChange={(v) => {
            setTarget(v)
            setChosen([])
          }}
          options={TARGETS.map((v) => ({ value: v, label: <Tex>{`H'(${v})`}</Tex> }))}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="text-center font-mono">
          <tbody>
            <tr>
              <th className="border border-slate-200 bg-slate-50 px-3 py-1 text-left font-sans text-sm">t (min)</th>
              {t.map((v, k) => (
                <td key={v} className="border border-slate-200 p-0">
                  <button
                    type="button"
                    onClick={() => toggle(k)}
                    className={`w-full px-4 py-1 ${chosen.includes(k) ? 'bg-orange-100 font-semibold' : 'hover:bg-slate-50'}`}
                  >
                    {v}
                  </button>
                </td>
              ))}
            </tr>
            <tr>
              <th className="border border-slate-200 bg-slate-50 px-3 py-1 text-left font-sans text-sm">H(t) (m)</th>
              {H.map((v, k) => (
                <td key={k} className={`border border-slate-200 px-4 py-1 ${chosen.includes(k) ? 'bg-orange-100' : ''}`}>
                  {v}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <Mafs height={260} viewBox={{ x: [0, 12.5], y: [0, 270] }} preserveAspectRatio={false} pan={false}>
            <Coordinates.Cartesian
              subdivisions={false}
              xAxis={{ lines: 1, labels: (v) => `${v}` }}
              yAxis={{ lines: 50, labels: (v) => `${v}` }}
            />
            <Line.Segment point1={[target, 0]} point2={[target, 270]} color={colors.instant} style="dashed" opacity={0.6} />
            {ready && <Line.Segment point1={[t[i], H[i]]} point2={[t[j], H[j]]} color={colors.average} weight={3} />}
            {t.map((v, k) => (
              <Point key={v} x={v} y={H[k]} color={chosen.includes(k) ? colors.average : colors.curve} />
            ))}
          </Mafs>
        </div>
        <div className="space-y-3">
          {ready ? (
            <>
              <div className="overflow-x-auto rounded-xl bg-slate-50 px-4 py-2">
                <Tex block>
                  {`H'(${target}) \\approx \\frac{H(${t[j]}) - H(${t[i]})}{${t[j]} - ${t[i]}} = \\frac{${H[j]} - ${H[i]}}{${t[j] - t[i]}} = \\textcolor{${colors.average}}{${fmt(estimate, 1)}} \\text{ m/min}`}
                </Tex>
              </div>
              <p className={`rounded-xl px-4 py-3 ${verdict!.ok ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}`}>
                {verdict!.text}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-500">Select two time columns ({2 - chosen.length} more).</p>
          )}
          <Button variant="ghost" onClick={() => setChosen([])} disabled={chosen.length === 0}>
            Clear selection
          </Button>
        </div>
      </div>
    </div>
  )
}
