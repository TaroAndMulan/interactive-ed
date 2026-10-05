import { Coordinates, Line, Mafs, MovablePoint, Plot, Point } from 'mafs'
import 'mafs/core.css'
import { useState } from 'react'
import { ExplorerLayout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { Slider } from '@/components/ui/Slider'
import { fmt } from '@/lib/format'
import { colors } from '@/curriculum/math/shared/colors'
import type { Vector2 } from '@/curriculum/math/shared/functions'
import { polynomialTex } from './polynomial'

const TERM_COLORS = ['#64748b', colors.first, colors.second, colors.combined]

/** Build a cubic with sliders; each term's derivative appears in the same color. */
export function PolynomialMachine() {
  const [c, setC] = useState([1, -1.5, -1, 0.5])
  const [a, setA] = useState(1)

  const f = (x: number) => c[3] * x ** 3 + c[2] * x ** 2 + c[1] * x + c[0]
  const df = (x: number) => 3 * c[3] * x ** 2 + 2 * c[2] * x + c[1]
  const terms = [3, 2, 1, 0].map((power) => ({ coefficient: c[power], power, color: TERM_COLORS[power] }))
  const derivativeTerms = [3, 2, 1].map((power) => ({ coefficient: power * c[power], power: power - 1, color: TERM_COLORS[power] }))
  const A: Vector2 = [a, f(a)]

  const graph = (
    <Mafs viewBox={{ x: [-3, 3], y: [-6, 6] }} height={420} preserveAspectRatio={false} pan={false}>
      <Coordinates.Cartesian subdivisions={false} />
      <Plot.OfX y={df} color={colors.instant} weight={2.5} style="dashed" />
      <Plot.OfX y={f} color={colors.curve} weight={3} />
      <Line.PointSlope point={A} slope={df(a)} color={colors.instant} opacity={0.6} />
      <Point x={a} y={df(a)} color={colors.instant} />
      <MovablePoint
        point={A}
        onMove={([x]) => setA(x)}
        constrain={([x]) => {
          const snapped = Math.round(x * 10) / 10
          return [snapped, f(snapped)]
        }}
        color={colors.curve}
      />
    </Mafs>
  )

  const labels = ['constant', 'x', 'x²', 'x³']
  const panel = (
    <>
      <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
        {[3, 2, 1, 0].map((power) => (
          <Slider
            key={power}
            label={`${labels[power]} coefficient`}
            value={c[power]}
            min={-3}
            max={3}
            step={0.5}
            onChange={(v) => setC(c.map((old, i) => (i === power ? v : old)))}
            display={fmt(c[power], 1)}
            color={TERM_COLORS[power]}
          />
        ))}
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white px-4 py-1">
        <Tex block>{`f(x) = ${polynomialTex(terms)}`}</Tex>
        <Tex block>{`f'(x) = ${polynomialTex(derivativeTerms)}`}</Tex>
      </div>
      <p className="text-sm text-slate-600">
        Solid: <Tex>f</Tex>. Dashed blue: <Tex>{"f'"}</Tex>. The blue dot at <Tex>{`x = ${fmt(a, 1)}`}</Tex> sits at
        height <Tex>{`f'(${fmt(a, 1)}) = ${fmt(df(a))}`}</Tex>, the slope of the tangent.
      </p>
    </>
  )

  return <ExplorerLayout graph={graph} panel={panel} />
}
