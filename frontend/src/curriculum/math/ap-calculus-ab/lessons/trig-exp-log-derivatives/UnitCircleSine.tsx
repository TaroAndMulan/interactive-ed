import { Circle, Coordinates, Line, Mafs, MovablePoint, Plot, Text } from 'mafs'
import 'mafs/core.css'
import { useState } from 'react'
import { ExplorerLayout, Readout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { Slider } from '@/components/ui/Slider'
import { fmt, fmtSig } from '@/lib/format'
import { colors } from '@/curriculum/math/shared/colors'
import type { Vector2 } from '@/curriculum/math/shared/functions'

/**
 * Nudge the angle θ by dθ. The point moves along an arc of length dθ, and its height
 * (sin θ) changes by about cos θ · dθ: the little triangle is similar to the big one.
 */
export function UnitCircleSine() {
  const [theta, setTheta] = useState(0.9)
  const [dExp, setDExp] = useState(-0.3)
  const d = 10 ** dExp

  const P: Vector2 = [Math.cos(theta), Math.sin(theta)]
  const Q: Vector2 = [Math.cos(theta + d), Math.sin(theta + d)]
  const corner: Vector2 = [Q[0], P[1]]
  const ratio = (Q[1] - P[1]) / d

  const graph = (
    <Mafs viewBox={{ x: [-1.2, 1.2], y: [-1.2, 1.2] }} height={480} pan={false}>
      <Coordinates.Cartesian subdivisions={false} xAxis={{ lines: 0.5 }} yAxis={{ lines: 0.5 }} />
      <Circle center={[0, 0]} radius={1} color={colors.curve} weight={2} fillOpacity={0} />
      <Line.Segment point1={[0, 0]} point2={P} color={colors.curve} opacity={0.5} />
      <Line.Segment point1={[0, 0]} point2={Q} color={colors.curve} opacity={0.3} />
      <Line.Segment point1={[0, 0]} point2={[P[0], 0]} color={colors.instant} weight={5} />
      <Line.Segment point1={[P[0], 0]} point2={P} color={colors.second} weight={3} />
      <Plot.Parametric xy={(t) => [Math.cos(t), Math.sin(t)]} domain={[theta, theta + d]} color={colors.curve} weight={6} />
      <Line.Segment point1={P} point2={corner} color={colors.average} style="dashed" />
      <Line.Segment point1={corner} point2={Q} color={colors.average} weight={4} />
      <Text x={P[0] / 2} y={0} attach="s" color={colors.instant} size={16}>
        cos θ
      </Text>
      <Text x={P[0]} y={P[1] / 2} attach="e" color={colors.second} size={16}>
        sin θ
      </Text>
      <MovablePoint
        point={P}
        onMove={([x, y]) => setTheta(Math.atan2(y, x))}
        constrain={([x, y]) => {
          const angle = Math.atan2(y, x)
          return [Math.cos(angle), Math.sin(angle)]
        }}
        color={colors.second}
      />
    </Mafs>
  )

  const panel = (
    <>
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-600">
          Drag the point to change <Tex>\theta</Tex>. The thick dark arc is the nudge <Tex>{String.raw`\Delta\theta`}</Tex>; the
          orange leg is the change in height, <Tex>{String.raw`\Delta(\sin\theta)`}</Tex>.
        </p>
        <Slider
          label={<Tex>{String.raw`\Delta\theta`}</Tex>}
          value={dExp}
          min={-2.5}
          max={0}
          onChange={setDExp}
          display={fmtSig(d, 2)}
          color={colors.average}
        />
      </div>
      <Readout
        label={<Tex>{String.raw`\frac{\Delta(\sin\theta)}{\Delta\theta}`}</Tex>}
        value={fmt(ratio, 4)}
        color={colors.average}
      />
      <Readout label={<Tex>{`\\cos\\theta \\quad (\\theta = ${fmt(theta)})`}</Tex>} value={fmt(Math.cos(theta), 4)} color={colors.instant} />
      <p className="text-sm text-slate-600">
        The tiny orange triangle is similar to the big triangle with sides <Tex>\cos\theta</Tex> and{' '}
        <Tex>\sin\theta</Tex>, rotated a quarter turn. So its vertical leg is about <Tex>{String.raw`\cos\theta \cdot \Delta\theta`}</Tex>.
      </p>
    </>
  )

  return <ExplorerLayout graph={graph} panel={panel} />
}
