import { Coordinates, Line, Mafs, MovablePoint, Plot } from 'mafs'
import 'mafs/core.css'
import { useState } from 'react'
import { ExplorerLayout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { fmt } from '@/lib/format'
import { colors } from '@/curriculum/math/shared/colors'
import type { Vector2 } from '@/curriculum/math/shared/functions'

const f = (x: number) => (x * x) / 4
const df = (x: number) => x / 2
const g = (x: number) => Math.sin(x)
const dg = (x: number) => Math.cos(x)
const sum = (x: number) => f(x) + g(x)

/** A run-1 slope triangle: its rise is the slope. */
function SlopeTriangle({ at, slope, color }: { at: Vector2; slope: number; color: string }) {
  const corner: Vector2 = [at[0] + 1, at[1]]
  const tip: Vector2 = [at[0] + 1, at[1] + slope]
  return (
    <>
      <Line.Segment point1={at} point2={corner} color={color} style="dashed" opacity={0.7} />
      <Line.Segment point1={corner} point2={tip} color={color} weight={4} />
    </>
  )
}

/** Horizontal bars: f′ and g′ laid end to end equal (f + g)′. */
function SlopeBars({ a: fa, b: ga }: { a: number; b: number }) {
  const scale = 40
  const zero = 150
  const bar = (start: number, value: number, y: number, color: string) => (
    <rect
      x={zero + Math.min(start, start + value) * scale}
      y={y}
      width={Math.abs(value) * scale}
      height={16}
      fill={color}
      rx={3}
    />
  )
  return (
    <svg viewBox="0 0 300 92" className="w-full" role="img" aria-label="Slopes add">
      <line x1={zero} x2={zero} y1={0} y2={92} stroke="#94a3b8" />
      {bar(0, fa, 6, colors.first)}
      {bar(0, ga, 32, colors.second)}
      {bar(0, fa, 66, colors.first)}
      {bar(fa, ga, 66, colors.second)}
      <line x1={zero + (fa + ga) * scale} x2={zero + (fa + ga) * scale} y1={60} y2={88} stroke={colors.combined} strokeWidth={3} />
    </svg>
  )
}

/** f, g and f + g: the rises of the run-1 slope triangles add up. */
export function SumRuleExplorer() {
  const [a, setA] = useState(1)
  const points: Vector2[] = [f, g, sum].map((fn) => [a, fn(a)] as Vector2)

  const graph = (
    <Mafs viewBox={{ x: [-2, 5], y: [-2, 6] }} height={420} pan={false}>
      <Coordinates.Cartesian subdivisions={false} />
      <Plot.OfX y={f} color={colors.first} weight={2.5} />
      <Plot.OfX y={g} color={colors.second} weight={2.5} />
      <Plot.OfX y={sum} color={colors.combined} weight={3.5} />
      <SlopeTriangle at={points[0]} slope={df(a)} color={colors.first} />
      <SlopeTriangle at={points[1]} slope={dg(a)} color={colors.second} />
      <SlopeTriangle at={points[2]} slope={df(a) + dg(a)} color={colors.combined} />
      <MovablePoint
        point={points[2]}
        onMove={([x]) => setA(x)}
        constrain={([x]) => {
          const snapped = Math.min(3.9, Math.max(-1.9, Math.round(x * 10) / 10))
          return [snapped, sum(snapped)]
        }}
        color={colors.combined}
      />
    </Mafs>
  )

  const panel = (
    <>
      <div className="space-y-1 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <Tex>{`\\textcolor{${colors.first}}{f(x) = \\tfrac14 x^2}`}</Tex>
        <br />
        <Tex>{`\\textcolor{${colors.second}}{g(x) = \\sin x}`}</Tex>
        <br />
        <Tex>{`\\textcolor{${colors.combined}}{f(x) + g(x)}`}</Tex>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-2 text-sm text-slate-600">
          Slopes at <Tex>{`x = ${fmt(a, 1)}`}</Tex>: the bottom bar is the top two laid end to end.
        </p>
        <SlopeBars a={df(a)} b={dg(a)} />
      </div>
      <div className="overflow-x-auto rounded-xl bg-slate-50 px-4 py-1">
        <Tex block>
          {`\\textcolor{${colors.first}}{${fmt(df(a))}} + \\textcolor{${colors.second}}{${fmt(dg(a))}} = \\textcolor{${colors.combined}}{${fmt(df(a) + dg(a))}}`}
        </Tex>
      </div>
    </>
  )

  return <ExplorerLayout graph={graph} panel={panel} />
}
