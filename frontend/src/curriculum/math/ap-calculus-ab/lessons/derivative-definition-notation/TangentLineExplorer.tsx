import { Coordinates, Line, Mafs, MovablePoint, Plot, Point, Text } from 'mafs'
import 'mafs/core.css'
import { useState } from 'react'
import { ExplorerLayout, Readout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { fmt, paren, signedTerm } from '@/lib/format'
import { colors } from '@/curriculum/math/shared/colors'
import { type MathFunction, onCurve, type Vector2 } from '@/curriculum/math/shared/functions'

/** A point and a slope make a line: the tangent line equation, live. */
export function TangentLineExplorer({ fn }: { fn: MathFunction }) {
  const [a, setA] = useState(fn.defaultA)
  const A: Vector2 = [a, fn.f(a)]
  const m = fn.df(a)
  const b = A[1] - m * a

  const graph = (
    <Mafs viewBox={fn.viewBox} height={420} pan={false}>
      <Coordinates.Cartesian subdivisions={false} />
      <Plot.OfX y={fn.f} color={colors.curve} weight={3} />
      {Number.isFinite(m) && <Line.PointSlope point={A} slope={m} color={colors.instant} weight={2.5} />}
      {Number.isFinite(b) && <Point x={0} y={b} color={colors.instant} opacity={0.6} />}
      <Text x={a} y={A[1]} attach="nw" attachDistance={18} color={colors.instant} size={16}>
        ({fmt(a, 1)}, {fmt(A[1])})
      </Text>
      <MovablePoint point={A} onMove={([x]) => setA(x)} constrain={onCurve(fn.f, 0.1, A)} color={colors.instant} />
    </Mafs>
  )

  const panel = (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Readout label="Point" value={`(${fmt(a, 1)}, ${fmt(A[1])})`} />
        <Readout label="Slope m = f′(a)" value={fmt(m)} color={colors.instant} />
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white px-4 py-2">
        <p className="pt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Point-slope form</p>
        <Tex block>{"y - f(a) = f'(a)\\,(x - a)"}</Tex>
        <Tex block>{`y - ${paren(fmt(A[1]))} = \\textcolor{${colors.instant}}{${fmt(m)}}\\,(x - ${paren(fmt(a, 1))})`}</Tex>
        <p className="pt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Slope-intercept form</p>
        <Tex block>{`y = \\textcolor{${colors.instant}}{${fmt(m)}}\\,x ${signedTerm(b)}`}</Tex>
      </div>
      <p className="text-sm text-slate-600">
        The faint dot is the tangent line&rsquo;s y-intercept, <Tex>{`(0,\\ ${fmt(b)})`}</Tex>.
      </p>
    </>
  )

  return <ExplorerLayout graph={graph} panel={panel} />
}
