import { Coordinates, Line, Mafs, MovablePoint, Plot, Text } from 'mafs'
import 'mafs/core.css'
import { useState } from 'react'
import { ExplorerLayout, Readout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { averageRateOfChange } from '@/lib/calculus'
import { fmt, paren } from '@/lib/format'
import { colors } from '@/curriculum/math/shared/colors'
import { type MathFunction, onCurve, type Vector2 } from '@/curriculum/math/shared/functions'

/** One secant line, two ways to name the second point: a + h, or x. */
export function TwoFormsExplorer({ fn }: { fn: MathFunction }) {
  const [a, setA] = useState(fn.defaultA)
  const [x, setX] = useState(fn.defaultA + 1)

  const A: Vector2 = [a, fn.f(a)]
  const X: Vector2 = [x, fn.f(x)]
  const h = x - a
  const slope = averageRateOfChange(fn.f, a, x)
  const tangent = fn.df(a)

  const graph = (
    <Mafs viewBox={fn.viewBox} height={420} pan={false}>
      <Coordinates.Cartesian subdivisions={false} />
      <Plot.OfX y={fn.f} color={colors.curve} weight={3} />
      {Number.isFinite(tangent) && (
        <Line.PointSlope point={A} slope={tangent} color={colors.instant} style="dashed" opacity={0.6} />
      )}
      {h !== 0 && (
        <>
          <Line.ThroughPoints point1={A} point2={X} color={colors.average} weight={2.5} />
          <Line.Segment point1={A} point2={[x, A[1]]} color={colors.average} style="dashed" opacity={0.7} />
          <Text x={(a + x) / 2} y={A[1]} attach={X[1] >= A[1] ? 's' : 'n'} color={colors.average} size={15}>
            h = x − a = {fmt(h, 1)}
          </Text>
        </>
      )}
      <Text x={a} y={A[1]} attach="nw" attachDistance={18} color={colors.instant} size={16}>
        (a, f(a))
      </Text>
      <Text x={x} y={X[1]} attach="se" attachDistance={18} color={colors.average} size={16}>
        (x, f(x)) = (a+h, f(a+h))
      </Text>
      <MovablePoint point={X} onMove={([v]) => setX(v)} constrain={onCurve(fn.f, 0.1, X)} color={colors.average} />
      <MovablePoint point={A} onMove={([v]) => setA(v)} constrain={onCurve(fn.f, 0.1, A)} color={colors.instant} />
    </Mafs>
  )

  const [sa, sx, sh] = [fmt(a, 1), fmt(x, 1), fmt(h, 1)]
  const panel = (
    <>
      <Readout label="Slope of the secant line" value={fmt(slope, 3)} color={colors.average} />
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white px-4 py-2">
        <p className="pt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">h-form</p>
        <Tex block>{`\\frac{f(a+h) - f(a)}{h} = \\frac{f(${sa} + ${paren(sh)}) - f(${sa})}{${sh}}`}</Tex>
        <p className="pt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">x-form</p>
        <Tex block>{`\\frac{f(x) - f(a)}{x - a} = \\frac{f(${sx}) - f(${sa})}{${sx} - ${paren(sa)}}`}</Tex>
      </div>
      <Readout
        label={
          <>
            Both limits give the tangent slope: <Tex>{`h \\to 0 \\iff x \\to a`}</Tex>
          </>
        }
        value={<>f′({sa}) = {fmt(tangent, 3)}</>}
        color={colors.instant}
      />
    </>
  )

  return <ExplorerLayout graph={graph} panel={panel} />
}
