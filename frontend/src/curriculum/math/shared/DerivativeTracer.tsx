import { Line, Mafs, MovablePoint, Point } from 'mafs'
import 'mafs/core.css'
import { type ReactNode, useState } from 'react'
import { ExplorerLayout, Readout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { Button } from '@/components/ui/Button'
import { fmt } from '@/lib/format'
import { useAnimationFrame } from '@/lib/hooks'
import { colors } from './colors'
import { type MathFunction, onCurve, sampleRange, type Vector2 } from './functions'
import { AutoGrid, FunctionPlot, GraphLabel } from './plot'

interface DerivativeTracerProps {
  fn: MathFunction
  /** Show f′ from the start instead of letting students trace it first. */
  revealed?: boolean
  /** Label the x-axis in multiples of π/2 (trig functions). */
  pi?: boolean
  /** Extra Mafs content for the f′ graph, e.g. a student's guess. */
  derivativeOverlay?: ReactNode
  /** Extra controls/readouts below the built-in panel. */
  panelExtra?: ReactNode
}

/**
 * Two aligned graphs: drag a point along f (top) and its tangent slope is plotted
 * underneath, so the derivative function f′ appears point by point.
 */
export function DerivativeTracer({
  fn,
  revealed: startRevealed = false,
  pi = false,
  derivativeOverlay,
  panelExtra,
}: DerivativeTracerProps) {
  const lo = Math.max(fn.domain?.[0] ?? -Infinity, fn.viewBox.x[0])
  const hi = Math.min(fn.domain?.[1] ?? Infinity, fn.viewBox.x[1])
  const bucket = (hi - lo) / 240

  const [a, setA] = useState(fn.defaultA)
  const [trail, setTrail] = useState<Record<number, Vector2>>({})
  const [revealed, setRevealed] = useState(startRevealed)
  const [sweeping, setSweeping] = useState(false)

  const slope = fn.df(a)
  const A: Vector2 = [a, fn.f(a)]
  const derivativeView = { x: fn.viewBox.x, y: sampleRange(fn.df, lo, hi) }

  const visit = (x: number) => {
    setA(x)
    const s = fn.df(x)
    if (Number.isFinite(s)) setTrail((t) => ({ ...t, [Math.round(x / bucket)]: [x, s] }))
  }

  useAnimationFrame((dt) => {
    const next = a + (dt * (hi - lo)) / 6
    if (next >= hi - bucket) setSweeping(false)
    else visit(next)
  }, sweeping)

  const sweep = () => {
    visit(lo + bucket)
    setSweeping(true)
  }

  const graph = (
    <div>
      <div className="relative">
        <GraphLabel>
          <Tex>{`f(x) = ${fn.tex}`}</Tex>
        </GraphLabel>
        <Mafs height={270} viewBox={fn.viewBox} preserveAspectRatio={false} pan={false}>
          <AutoGrid viewBox={fn.viewBox} pi={pi} />
          <FunctionPlot y={fn.f} breaks={fn.breaks} domain={fn.domain} color={colors.curve} weight={3} />
          {Number.isFinite(slope) && Number.isFinite(A[1]) && (
            <Line.PointSlope point={A} slope={slope} color={colors.instant} weight={2.5} />
          )}
          {Number.isFinite(A[1]) && (
            <MovablePoint
              point={A}
              onMove={([x]) => visit(x)}
              constrain={onCurve(fn.f, bucket, A)}
              color={colors.instant}
            />
          )}
        </Mafs>
      </div>
      <div className="relative border-t border-slate-200">
        <GraphLabel>
          <Tex>{`\\textcolor{${colors.instant}}{f'(x)} \\text{ (slope of } f)`}</Tex>
        </GraphLabel>
        <Mafs height={230} viewBox={derivativeView} preserveAspectRatio={false} pan={false}>
          <AutoGrid viewBox={derivativeView} pi={pi} />
          {revealed && (
            <FunctionPlot y={fn.df} breaks={fn.breaks} domain={fn.domain} color={colors.instant} weight={2.5} opacity={0.6} />
          )}
          {Object.entries(trail).map(([k, [x, y]]) => (
            <Point key={k} x={x} y={y} color={colors.instant} opacity={0.55} svgCircleProps={{ r: 3 }} />
          ))}
          {derivativeOverlay}
          {Number.isFinite(slope) && <Point x={a} y={slope} color={colors.instant} />}
        </Mafs>
      </div>
    </div>
  )

  const panel = (
    <>
      <Readout
        label={<Tex>{`\\text{Slope of the tangent at } x = ${fmt(a, 2)}`}</Tex>}
        value={<>f′ = {fmt(slope, 3)}</>}
        color={colors.instant}
      />
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-600">
          Drag the blue point, or sweep it across. Each tangent slope leaves a dot on the lower graph.
        </p>
        <div className="flex flex-wrap gap-2">
          {sweeping ? (
            <Button onClick={() => setSweeping(false)}>Pause</Button>
          ) : (
            <Button variant="primary" onClick={sweep}>
              ▶ Sweep
            </Button>
          )}
          <Button onClick={() => setTrail({})}>Clear dots</Button>
          <Button onClick={() => setRevealed(!revealed)}>{revealed ? 'Hide' : 'Reveal'} f′(x)</Button>
        </div>
        {revealed && fn.derivativeTex && (
          <Tex block>{`f'(x) = \\textcolor{${colors.instant}}{${fn.derivativeTex}}`}</Tex>
        )}
      </div>
      {panelExtra}
    </>
  )

  return <ExplorerLayout graph={graph} panel={panel} />
}
