import { Coordinates, Line, Mafs, MovablePoint, Plot, Point } from 'mafs'
import 'mafs/core.css'
import { useState } from 'react'
import { ExplorerLayout, Readout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { fmt } from '@/lib/format'
import { colors } from '@/curriculum/math/shared/colors'
import type { Vector2 } from '@/curriculum/math/shared/functions'

/** ln x is eˣ reflected across y = x, so reflected tangent lines swap rise and run: slope a becomes 1/a. */
export function LogReflection() {
  const [a, setA] = useState(2)
  const A: Vector2 = [a, Math.log(a)]
  const B: Vector2 = [Math.log(a), a]

  const graph = (
    <Mafs viewBox={{ x: [-1.5, 5], y: [-1.5, 5] }} height={420} pan={false}>
      <Coordinates.Cartesian subdivisions={false} />
      <Plot.OfX y={(x) => x} color="#94a3b8" style="dashed" />
      <Plot.OfX y={Math.exp} color={colors.second} weight={2.5} opacity={0.8} />
      <Plot.OfX y={Math.log} domain={[0, Infinity]} color={colors.curve} weight={3} />
      <Line.Segment point1={A} point2={B} color="#94a3b8" style="dashed" />
      <Line.PointSlope point={B} slope={a} color={colors.second} style="dashed" />
      <Line.PointSlope point={A} slope={1 / a} color={colors.instant} weight={2.5} />
      <Point x={B[0]} y={B[1]} color={colors.second} />
      <MovablePoint
        point={A}
        onMove={([x]) => setA(x)}
        constrain={([x]) => {
          const v = Math.min(5, Math.max(0.2, Math.round(x * 10) / 10))
          return [v, Math.log(v)]
        }}
        color={colors.instant}
      />
    </Mafs>
  )

  const panel = (
    <>
      <Readout
        label={
          <>
            Slope of <Tex>{'e^x'}</Tex> at <Tex>{`(\\ln ${fmt(a, 1)},\\ ${fmt(a, 1)})`}</Tex>
          </>
        }
        value={<Tex>{`e^{\\ln ${fmt(a, 1)}} = ${fmt(a, 1)}`}</Tex>}
        color={colors.second}
      />
      <Readout
        label={
          <>
            Slope of <Tex>\ln x</Tex> at <Tex>{`(${fmt(a, 1)},\\ \\ln ${fmt(a, 1)})`}</Tex>
          </>
        }
        value={<Tex>{`\\frac{1}{${fmt(a, 1)}} = ${fmt(1 / a, 3)}`}</Tex>}
        color={colors.instant}
      />
      <p className="text-sm text-slate-600">
        Reflecting across <Tex>y = x</Tex> swaps every rise with its run, so slopes turn into their reciprocals. That
        is why <Tex>{String.raw`\frac{d}{dx}\ln x = \frac{1}{x}`}</Tex>.
      </p>
    </>
  )

  return <ExplorerLayout graph={graph} panel={panel} />
}
