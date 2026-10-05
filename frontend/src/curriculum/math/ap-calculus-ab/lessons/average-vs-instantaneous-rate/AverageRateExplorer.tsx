import { Coordinates, Line, Mafs, MovablePoint, Plot, Text } from 'mafs'
import 'mafs/core.css'
import { useState } from 'react'
import { ExplorerLayout, Readout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { averageRateOfChange } from '@/lib/calculus'
import { fmt, paren as p } from '@/lib/format'
import { colors } from '@/curriculum/math/shared/colors'
import { type MathFunction, onCurve, type Vector2 } from '@/curriculum/math/shared/functions'

export function AverageRateExplorer({ fn }: { fn: MathFunction }) {
  const [a, setA] = useState(fn.defaultA)
  const [b, setB] = useState(fn.defaultA + 1.5)

  const A: Vector2 = [a, fn.f(a)]
  const B: Vector2 = [b, fn.f(b)]
  const rate = averageRateOfChange(fn.f, a, b)
  const hasInterval = a !== b
  const corner: Vector2 = [b, A[1]]

  const graph = (
    <Mafs viewBox={fn.viewBox} height={440} pan={false}>
      <Coordinates.Cartesian subdivisions={false} />
      <Plot.OfX y={fn.f} color={colors.curve} weight={3} />
      {hasInterval && (
        <>
          <Line.ThroughPoints point1={A} point2={B} color={colors.average} weight={2.5} />
          <Line.Segment point1={A} point2={corner} color={colors.average} style="dashed" opacity={0.7} />
          <Line.Segment point1={corner} point2={B} color={colors.average} style="dashed" opacity={0.7} />
          <Text x={(a + b) / 2} y={A[1]} attach={B[1] >= A[1] ? 's' : 'n'} color={colors.average} size={16}>
            Δx = {fmt(b - a, 1)}
          </Text>
          <Text x={b} y={(A[1] + B[1]) / 2} attach={b > a ? 'e' : 'w'} color={colors.average} size={16}>
            Δy = {fmt(B[1] - A[1])}
          </Text>
        </>
      )}
      <Text x={a} y={A[1]} attach="nw" attachDistance={18} size={18}>
        A
      </Text>
      <Text x={b} y={B[1]} attach="nw" attachDistance={18} size={18}>
        B
      </Text>
      <MovablePoint point={A} onMove={([x]) => setA(x)} constrain={onCurve(fn.f, 0.1, A)} color={colors.average} />
      <MovablePoint point={B} onMove={([x]) => setB(x)} constrain={onCurve(fn.f, 0.1, B)} color={colors.average} />
    </Mafs>
  )

  const panel = (
    <>
      <Readout
        label={
          <>
            Average rate of change on <Tex>{`[${fmt(Math.min(a, b), 1)},\\ ${fmt(Math.max(a, b), 1)}]`}</Tex>
          </>
        }
        value={fmt(rate)}
        color={colors.average}
      />
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white px-4 py-2">
        <Tex block>{String.raw`\frac{\Delta y}{\Delta x} = \frac{f(b)-f(a)}{b-a}`}</Tex>
        <Tex block>{`= \\frac{f(${fmt(b, 1)}) - f(${fmt(a, 1)})}{${fmt(b, 1)} - ${p(fmt(a, 1))}}`}</Tex>
        <Tex block>
          {`= \\frac{${fmt(B[1])} - ${p(fmt(A[1]))}}{${fmt(b - a, 1)}} = \\textcolor{${colors.average}}{${fmt(rate)}}`}
        </Tex>
      </div>
      {hasInterval ? (
        <p className="text-sm text-slate-600">
          This is the <strong style={{ color: colors.average }}>slope of the secant line</strong> through A and B.
          Drag either point along the curve.
        </p>
      ) : (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-900">
          <Tex>b - a = 0</Tex>, so the formula asks for <Tex>{String.raw`\tfrac{0}{0}`}</Tex>. An average rate
          needs an <em>interval</em>: two different points.
        </p>
      )}
    </>
  )

  return <ExplorerLayout graph={graph} panel={panel} />
}
