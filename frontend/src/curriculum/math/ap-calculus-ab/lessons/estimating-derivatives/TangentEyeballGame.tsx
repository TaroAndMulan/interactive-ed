import { Coordinates, Line, Mafs, MovablePoint, Plot, Point, Text } from 'mafs'
import 'mafs/core.css'
import { useState } from 'react'
import { ExplorerLayout, Readout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { Button } from '@/components/ui/Button'
import { fmt } from '@/lib/format'
import { pick } from '@/lib/random'
import { colors } from '@/curriculum/math/shared/colors'
import type { Vector2 } from '@/curriculum/math/shared/functions'
import { mystery } from './mystery'

const TARGETS = [0.5, 1, 1.5, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6.5, 7, 7.5]

function rating(error: number) {
  if (error <= 0.1) return { text: 'Excellent!', className: 'bg-emerald-50 text-emerald-900' }
  if (error <= 0.3) return { text: 'Close!', className: 'bg-amber-50 text-amber-900' }
  return { text: 'Keep practicing.', className: 'bg-rose-50 text-rose-900' }
}

/** Students rotate a line through P until it looks tangent, then compare with the true slope. */
export function TangentEyeballGame() {
  const [a, setA] = useState(1)
  const P: Vector2 = [a, mystery.f(a)]
  const [handle, setHandle] = useState<Vector2>([a + 1.5, P[1]])
  const [checked, setChecked] = useState(false)
  const [errors, setErrors] = useState<number[]>([])

  const run = handle[0] - a
  const rise = handle[1] - P[1]
  const guess = run === 0 ? NaN : rise / run
  const truth = mystery.df(a)
  const error = Math.abs(guess - truth)

  const check = () => {
    setChecked(true)
    setErrors([...errors, error])
  }

  const newPoint = () => {
    const next = pick(TARGETS.filter((t) => t !== a))
    setA(next)
    setHandle([next + 1.5, mystery.f(next)])
    setChecked(false)
  }

  const graph = (
    <Mafs viewBox={mystery.viewBox} height={440} pan={false}>
      <Coordinates.Cartesian subdivisions={2} />
      <Plot.OfX y={mystery.f} color={colors.curve} weight={3} />
      {checked && <Line.PointSlope point={P} slope={truth} color={colors.instant} weight={2.5} />}
      {run !== 0 && <Line.ThroughPoints point1={P} point2={handle} color={colors.second} weight={2.5} />}
      <Line.Segment point1={P} point2={[handle[0], P[1]]} color={colors.second} style="dashed" opacity={0.7} />
      <Line.Segment point1={[handle[0], P[1]]} point2={handle} color={colors.second} style="dashed" opacity={0.7} />
      <Text x={(a + handle[0]) / 2} y={P[1]} attach={rise >= 0 ? 's' : 'n'} color={colors.second} size={15}>
        run {fmt(run, 1)}
      </Text>
      <Text x={handle[0]} y={(P[1] + handle[1]) / 2} attach={run >= 0 ? 'e' : 'w'} color={colors.second} size={15}>
        rise {fmt(rise, 1)}
      </Text>
      <Point x={P[0]} y={P[1]} color={colors.curve} />
      <Text x={P[0]} y={P[1]} attach="nw" attachDistance={14} size={16}>
        P
      </Text>
      {!checked && (
        <MovablePoint
          point={handle}
          onMove={setHandle}
          constrain={([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]}
          color={colors.second}
        />
      )}
    </Mafs>
  )

  const result = rating(error)
  const average = errors.length ? errors.reduce((s, e) => s + e, 0) / errors.length : NaN

  const panel = (
    <>
      <Readout
        label={
          <>
            Your slope <Tex>{String.raw`\frac{\text{rise}}{\text{run}}`}</Tex>
          </>
        }
        value={fmt(guess)}
        color={colors.second}
      />
      {checked ? (
        <>
          <Readout label="True slope at P" value={fmt(truth)} color={colors.instant} />
          <p className={`rounded-xl px-4 py-3 ${result.className}`}>
            {result.text} You were off by {fmt(error)}.
          </p>
          <Button variant="primary" onClick={newPoint}>
            Try a new point →
          </Button>
        </>
      ) : (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">
            Drag the violet handle until the line just touches the curve at P without cutting through it. Read the
            rise and run off the grid.
          </p>
          <Button variant="primary" onClick={check} disabled={run === 0}>
            Check my tangent
          </Button>
        </div>
      )}
      {errors.length > 0 && (
        <p className="text-sm text-slate-600">
          Rounds: {errors.length} · average error {fmt(average)}
        </p>
      )}
    </>
  )

  return <ExplorerLayout graph={graph} panel={panel} />
}
