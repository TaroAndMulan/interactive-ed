import { Coordinates, Line, Mafs, MovablePoint, Plot } from 'mafs'
import 'mafs/core.css'
import { useState } from 'react'
import { ExplorerLayout, Readout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { Slider } from '@/components/ui/Slider'
import { fmt, signedTerm } from '@/lib/format'
import { colors } from '@/curriculum/math/shared/colors'
import type { Vector2 } from '@/curriculum/math/shared/functions'

const f = (x: number) => x ** 3 / 3 - x
const df = (x: number) => x ** 2 - 1

/**
 * mode="shift": compare f and f + C (parallel tangents, same slope).
 * mode="scale": compare f and k·f (every slope multiplied by k).
 */
export function ShiftStretchExplorer({ mode }: { mode: 'shift' | 'scale' }) {
  const [a, setA] = useState(1.6)
  const [C, setC] = useState(2)
  const [k, setK] = useState(2)

  const g = mode === 'shift' ? (x: number) => f(x) + C : (x: number) => k * f(x)
  const dg = mode === 'shift' ? df : (x: number) => k * df(x)
  const A: Vector2 = [a, f(a)]
  const B: Vector2 = [a, g(a)]

  const graph = (
    <Mafs viewBox={{ x: [-3, 3], y: [-4, 5] }} height={420} pan={false}>
      <Coordinates.Cartesian subdivisions={false} />
      <Plot.OfX y={f} color={colors.curve} weight={2} style="dashed" opacity={0.6} />
      <Plot.OfX y={g} color={colors.combined} weight={3} />
      <Line.PointSlope point={A} slope={df(a)} color={colors.instant} opacity={0.5} />
      <Line.PointSlope point={B} slope={dg(a)} color={colors.instant} weight={2.5} />
      <Line.Segment point1={A} point2={B} color={colors.combined} style="dashed" opacity={0.5} />
      <MovablePoint
        point={B}
        onMove={([x]) => setA(x)}
        constrain={([x]) => {
          const snapped = Math.round(x * 10) / 10
          return [snapped, g(snapped)]
        }}
        color={colors.combined}
      />
    </Mafs>
  )

  const original = <Tex>{String.raw`f(x) = \tfrac13 x^3 - x`}</Tex>
  const panel =
    mode === 'shift' ? (
      <>
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Dashed: {original}</p>
          <Slider label={<Tex>C</Tex>} value={C} min={-3} max={3} step={0.5} onChange={setC} display={fmt(C, 1)} color={colors.combined} />
          <Tex>{`\\textcolor{${colors.combined}}{f(x) ${signedTerm(C, 1)}}`}</Tex>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Readout label={<Tex>{"f'(a)"}</Tex>} value={fmt(df(a))} color={colors.instant} />
          <Readout label={<Tex>{`\\frac{d}{dx}[f + C]`}</Tex>} value={fmt(dg(a))} color={colors.instant} />
        </div>
        <div className="overflow-x-auto rounded-xl bg-slate-50 px-4 py-1">
          <Tex block>{`\\frac{d}{dx}\\big[f(x) + C\\big] = f'(x) + \\underbrace{\\tfrac{d}{dx}[C]}_{0} = f'(x)`}</Tex>
        </div>
      </>
    ) : (
      <>
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Dashed: {original}</p>
          <Slider label={<Tex>k</Tex>} value={k} min={-2} max={3} step={0.5} onChange={setK} display={fmt(k, 1)} color={colors.combined} />
          <Tex>{`\\textcolor{${colors.combined}}{${fmt(k, 1)}\\,f(x)}`}</Tex>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Readout label={<Tex>{"f'(a)"}</Tex>} value={fmt(df(a))} color={colors.instant} />
          <Readout label={<Tex>{`\\frac{d}{dx}[k f]`}</Tex>} value={fmt(dg(a))} color={colors.instant} />
        </div>
        <div className="overflow-x-auto rounded-xl bg-slate-50 px-4 py-1">
          <Tex block>{`\\frac{d}{dx}\\big[k\\,f(x)\\big] = k\\,f'(x): \\quad ${fmt(k, 1)} \\times ${fmt(df(a))} = ${fmt(dg(a))}`}</Tex>
        </div>
      </>
    )

  return <ExplorerLayout graph={graph} panel={panel} />
}
