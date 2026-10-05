import { Coordinates, Line, Mafs, Point } from 'mafs'
import 'mafs/core.css'
import { useState } from 'react'
import { ExplorerLayout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { Slider } from '@/components/ui/Slider'
import { fmt, signedTerm } from '@/lib/format'
import { colors } from '@/curriculum/math/shared/colors'
import { FunctionPlot } from '@/curriculum/math/shared/plot'

/** f(x) = a·x² for x ≤ 1 and 4x + b for x > 1: tune a and b until f is differentiable at 1. */
export function PiecewiseTuner() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(0)

  const leftValue = a
  const rightLimit = 4 + b
  const leftSlope = 2 * a
  const rightSlope = 4
  const continuous = Math.abs(leftValue - rightLimit) < 1e-9
  const smooth = continuous && Math.abs(leftSlope - rightSlope) < 1e-9

  const status = (ok: boolean) => (ok ? <span className="text-emerald-700">✓</span> : <span className="text-rose-700">✗</span>)

  const graph = (
    <Mafs viewBox={{ x: [-1.5, 3], y: [-2, 8] }} height={420} pan={false}>
      <Coordinates.Cartesian subdivisions={false} />
      <FunctionPlot y={(x) => a * x * x} domain={[-Infinity, 1]} color={colors.first} weight={3} />
      <FunctionPlot y={(x) => 4 * x + b} domain={[1, Infinity]} color={colors.second} weight={3} />
      <Line.Segment point1={[0.4, leftValue - 0.6 * leftSlope]} point2={[1, leftValue]} color={colors.first} style="dashed" />
      <Line.Segment point1={[1, rightLimit]} point2={[1.6, rightLimit + 0.6 * rightSlope]} color={colors.second} style="dashed" />
      {!continuous && (
        <Point x={1} y={rightLimit} color={colors.second} svgCircleProps={{ style: { fill: 'white', stroke: colors.second, strokeWidth: 2 } }} />
      )}
      <Point x={1} y={leftValue} color={smooth ? colors.instant : colors.first} />
    </Mafs>
  )

  const panel = (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white px-4 py-2">
        <Tex block>
          {`f(x) = \\begin{cases} \\textcolor{${colors.first}}{${fmt(a)}\\,x^2} & x \\le 1 \\\\ \\textcolor{${colors.second}}{4x ${signedTerm(b)}} & x > 1 \\end{cases}`}
        </Tex>
      </div>
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <Slider label={<Tex>a</Tex>} value={a} min={-2} max={4} step={0.25} onChange={setA} display={fmt(a)} color={colors.first} />
        <Slider label={<Tex>b</Tex>} value={b} min={-4} max={2} step={0.25} onChange={setB} display={fmt(b)} color={colors.second} />
      </div>
      <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-sm">
        <p>
          {status(continuous)} <strong>Continuous at 1:</strong> left value <Tex>{`a = ${fmt(a)}`}</Tex>, right limit{' '}
          <Tex>{`4 + b = ${fmt(rightLimit)}`}</Tex>
        </p>
        <p>
          {status(Math.abs(leftSlope - rightSlope) < 1e-9)} <strong>Slopes match:</strong> left{' '}
          <Tex>{`2a = ${fmt(leftSlope)}`}</Tex>, right <Tex>4</Tex>
        </p>
      </div>
      {smooth ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-emerald-900">
          Differentiable at <Tex>x = 1</Tex>. The pieces meet <em>and</em> share a tangent line.
        </p>
      ) : (
        <p className="text-sm text-slate-600">
          Each check gives an equation in <Tex>a</Tex> and <Tex>b</Tex>. Can you solve them without the sliders?
        </p>
      )}
    </>
  )

  return <ExplorerLayout graph={graph} panel={panel} />
}
