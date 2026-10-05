import { Coordinates, Line, Mafs, Plot, Point } from 'mafs'
import 'mafs/core.css'
import { useState } from 'react'
import { ExplorerLayout, Readout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'
import { fmt } from '@/lib/format'
import { useAnimationFrame } from '@/lib/hooks'
import { colors } from '@/curriculum/math/shared/colors'

/** Every exponential bˣ has slope proportional to its height; for b = e the factor is exactly 1. */
export function ExponentialBase() {
  const [b, setB] = useState(2)
  const [seeking, setSeeking] = useState(false)
  const k = Math.log(b)
  const f = (x: number) => b ** x
  const df = (x: number) => k * b ** x
  const found = Math.abs(k - 1) < 0.005

  useAnimationFrame((dt) => {
    const next = b + (Math.E - b) * Math.min(1, dt * 3)
    if (Math.abs(next - Math.E) < 1e-4) {
      setB(Math.E)
      setSeeking(false)
    } else setB(next)
  }, seeking)

  const graph = (
    <Mafs viewBox={{ x: [-2.5, 2], y: [-0.5, 5] }} height={420} pan={false}>
      <Coordinates.Cartesian subdivisions={false} />
      <Plot.OfX y={df} color={colors.instant} weight={found ? 6 : 2.5} style="dashed" opacity={found ? 0.5 : 1} />
      <Plot.OfX y={f} color={colors.curve} weight={3} />
      <Line.PointSlope point={[0, 1]} slope={k} color={colors.instant} opacity={0.6} />
      <Point x={0} y={1} color={colors.curve} />
    </Mafs>
  )

  const panel = (
    <>
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <Tex>{`f(x) = ${fmt(b, 3)}^{x}`}</Tex>
        <Slider
          label={<Tex>b</Tex>}
          value={b}
          min={1.5}
          max={4}
          step={0.001}
          onChange={(v) => {
            setSeeking(false)
            setB(v)
          }}
          display={fmt(b, 3)}
        />
        <Button variant="primary" onClick={() => setSeeking(true)} disabled={seeking || b === Math.E}>
          Find the base where f′ = f
        </Button>
      </div>
      <Readout
        label={
          <>
            <Tex>{"\\frac{f'(x)}{f(x)}"}</Tex>: the same at every x
          </>
        }
        value={fmt(k, 4)}
        color={colors.instant}
      />
      {found ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-emerald-900">
          <Tex>{`b \\approx ${fmt(b, 4)} = e`}</Tex>. The dashed slope curve lands exactly on the graph:{' '}
          <Tex>{String.raw`\frac{d}{dx}e^x = e^x`}</Tex>.
        </p>
      ) : (
        <p className="text-sm text-slate-600">
          Solid: <Tex>{'b^x'}</Tex>. Dashed blue: its slope at every <Tex>x</Tex>. For which <Tex>b</Tex> do the two
          curves coincide?
        </p>
      )}
    </>
  )

  return <ExplorerLayout graph={graph} panel={panel} />
}
