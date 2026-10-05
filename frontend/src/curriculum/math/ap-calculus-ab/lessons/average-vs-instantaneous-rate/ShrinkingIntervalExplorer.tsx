import { Coordinates, Line, Mafs, MovablePoint, Plot, Text } from 'mafs'
import 'mafs/core.css'
import { useState } from 'react'
import { ExplorerLayout, Readout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { Button } from '@/components/ui/Button'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Slider } from '@/components/ui/Slider'
import { differenceQuotient } from '@/lib/calculus'
import { fmt, fmtSig } from '@/lib/format'
import { useAnimationFrame } from '@/lib/hooks'
import { colors } from '@/curriculum/math/shared/colors'
import { type MathFunction, onCurve, type Vector2 } from '@/curriculum/math/shared/functions'
import { LimitTable } from '@/curriculum/math/shared/LimitTable'

// h is controlled on a log scale so tiny values (0.001) are as easy to reach as big ones.
const MIN_EXP = -3
const MAX_EXP = Math.log10(3)

export function ShrinkingIntervalExplorer({ fn }: { fn: MathFunction }) {
  const [a, setA] = useState(fn.defaultA)
  const [hExp, setHExp] = useState(0)
  const [side, setSide] = useState<1 | -1>(1)
  const [showTangent, setShowTangent] = useState(false)
  const [shrinking, setShrinking] = useState(false)

  const h = side * 10 ** hExp
  const A: Vector2 = [a, fn.f(a)]
  const B: Vector2 = [a + h, fn.f(a + h)]
  const secantSlope = differenceQuotient(fn.f, a, h)
  const tangentSlope = fn.df(a)

  useAnimationFrame((dt) => {
    const next = Math.max(MIN_EXP, hExp - dt * 1.2)
    setHExp(next)
    if (next === MIN_EXP) setShrinking(false)
  }, shrinking)

  const moveB = ([x]: Vector2) => {
    const d = x - a
    if (d === 0) return
    setShrinking(false)
    setSide(d > 0 ? 1 : -1)
    setHExp(Math.min(MAX_EXP, Math.max(MIN_EXP, Math.log10(Math.abs(d)))))
  }

  const constrainB = ([x]: Vector2): Vector2 => {
    const d = x - a
    const sign = d === 0 ? side : Math.sign(d)
    const bx = a + sign * Math.min(3, Math.max(0.001, Math.abs(d)))
    const y = fn.f(bx)
    return Number.isFinite(y) ? [bx, y] : B
  }

  const graph = (
    <Mafs viewBox={fn.viewBox} height={440} pan={false}>
      <Coordinates.Cartesian subdivisions={false} />
      <Plot.OfX y={fn.f} color={colors.curve} weight={3} />
      {showTangent && Number.isFinite(tangentSlope) && (
        <Line.PointSlope point={A} slope={tangentSlope} color={colors.instant} style="dashed" weight={2.5} />
      )}
      <Line.ThroughPoints point1={A} point2={B} color={colors.average} weight={2.5} />
      <Line.Segment point1={A} point2={[B[0], A[1]]} color={colors.average} style="dashed" opacity={0.7} />
      <Text x={a + h / 2} y={A[1]} attach={B[1] >= A[1] ? 's' : 'n'} color={colors.average} size={16}>
        h
      </Text>
      <MovablePoint point={B} onMove={moveB} constrain={constrainB} color={colors.average} />
      <MovablePoint point={A} onMove={([x]) => setA(x)} constrain={onCurve(fn.f, 0.1, A)} color={colors.instant} />
    </Mafs>
  )

  const panel = (
    <>
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <Slider
          label={<Tex>h</Tex>}
          value={hExp}
          min={MIN_EXP}
          max={MAX_EXP}
          onChange={(v) => {
            setShrinking(false)
            setHExp(v)
          }}
          display={fmtSig(h, 2)}
          color={colors.average}
        />
        <SegmentedControl
          ariaLabel="Side to approach from"
          value={side}
          onChange={setSide}
          options={[
            { value: 1, label: 'h > 0 (right)' },
            { value: -1, label: 'h < 0 (left)' },
          ]}
        />
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => setShrinking(true)} disabled={shrinking || hExp === MIN_EXP}>
            Shrink h → 0
          </Button>
          <Button
            onClick={() => {
              setShrinking(false)
              setHExp(0)
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <Readout
        label={<Tex>{String.raw`\text{Secant slope } \frac{f(a+h)-f(a)}{h}`}</Tex>}
        value={fmt(secantSlope, 4)}
        color={colors.average}
      />
      <Readout
        label={<Tex>{`\\text{Tangent slope at } a = ${fmt(a, 1)}`}</Tex>}
        value={
          showTangent ? (
            fmt(tangentSlope, 4)
          ) : (
            <button
              type="button"
              onClick={() => setShowTangent(true)}
              className="text-base font-medium text-blue-700 underline-offset-2 hover:underline"
            >
              ? Make a prediction, then reveal
            </button>
          )
        }
        color={colors.instant}
      />
    </>
  )

  return (
    <div className="space-y-5">
      <ExplorerLayout graph={graph} panel={panel} />
      <LimitTable
        f={fn.f}
        a={a}
        limits={{
          left: showTangent ? fmt(tangentSlope, 5) : '?',
          right: showTangent ? fmt(tangentSlope, 5) : '?',
        }}
      />
    </div>
  )
}
