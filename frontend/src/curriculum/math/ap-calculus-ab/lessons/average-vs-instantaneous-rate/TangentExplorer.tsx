import { Coordinates, Line, Mafs, MovablePoint, Plot } from 'mafs'
import 'mafs/core.css'
import { useState } from 'react'
import { ExplorerLayout, Readout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { niceStep } from '@/lib/calculus'
import { axisLabeler, fmt } from '@/lib/format'
import { colors } from '@/curriculum/math/shared/colors'
import { type MathFunction, onCurve, type Vector2 } from '@/curriculum/math/shared/functions'

const ZOOMS = [1, 10, 100, 1000]

export function TangentExplorer({ fn }: { fn: MathFunction }) {
  const [a, setA] = useState(fn.defaultA)
  const [zoom, setZoom] = useState(1)
  // Zooming centres on A once; the view then stays put while A is dragged.
  const [center, setCenter] = useState<Vector2>([a, fn.f(a)])

  const A: Vector2 = [a, fn.f(a)]
  const slope = fn.df(a)

  const halfX = (fn.viewBox.x[1] - fn.viewBox.x[0]) / 2 / zoom
  const halfY = (fn.viewBox.y[1] - fn.viewBox.y[0]) / 2 / zoom
  const viewBox =
    zoom === 1
      ? fn.viewBox
      : {
          x: [center[0] - halfX, center[0] + halfX] as Vector2,
          y: [center[1] - halfY, center[1] + halfY] as Vector2,
          padding: 0,
        }
  // Unit grid normally; finer, relabelled grid lines once zoomed in.
  const xStep = zoom === 1 ? 1 : niceStep(2 * halfX)
  const yStep = zoom === 1 ? 1 : niceStep(2 * halfY)

  const changeZoom = (z: number) => {
    setZoom(z)
    setCenter(A)
  }

  const graph = (
    <Mafs viewBox={viewBox} height={440} pan={false}>
      <Coordinates.Cartesian
        subdivisions={false}
        xAxis={{ lines: xStep, labels: axisLabeler(xStep) }}
        yAxis={{ lines: yStep, labels: axisLabeler(yStep) }}
      />
      {Number.isFinite(slope) && (
        <Line.PointSlope point={A} slope={slope} color={colors.instant} weight={2.5} opacity={0.85} />
      )}
      <Plot.OfX y={fn.f} color={colors.curve} weight={3} />
      <MovablePoint point={A} onMove={([x]) => setA(x)} constrain={onCurve(fn.f, 0.1 / zoom, A)} color={colors.instant} />
    </Mafs>
  )

  const panel = (
    <>
      <Readout
        label={<Tex>{`\\text{Instantaneous rate of change at } a = ${fmt(a, zoom === 1 ? 1 : 4)}`}</Tex>}
        value={<>f′(a) = {fmt(slope, 4)}</>}
        color={colors.instant}
      />
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white px-4 py-2">
        <Tex block>{String.raw`f'(a) = \lim_{h \to 0} \frac{f(a+h) - f(a)}{h}`}</Tex>
      </div>
      <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-600">Zoom in on A</p>
        <SegmentedControl
          ariaLabel="Zoom"
          value={zoom}
          onChange={changeZoom}
          options={ZOOMS.map((z) => ({ value: z, label: `${z}×` }))}
        />
        <p className="text-sm text-slate-500">
          The more you zoom, the straighter the curve looks. That straight line is the{' '}
          <strong style={{ color: colors.instant }}>tangent line</strong>.
        </p>
      </div>
    </>
  )

  return <ExplorerLayout graph={graph} panel={panel} />
}
