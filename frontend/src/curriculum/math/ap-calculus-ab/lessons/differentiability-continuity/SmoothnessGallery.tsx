import { Line, Mafs, Point } from 'mafs'
import 'mafs/core.css'
import { useState } from 'react'
import { ExplorerLayout, Readout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { Button } from '@/components/ui/Button'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Slider } from '@/components/ui/Slider'
import { differenceQuotient } from '@/lib/calculus'
import { fmt, fmtSig } from '@/lib/format'
import { colors } from '@/curriculum/math/shared/colors'
import type { Vector2 } from '@/curriculum/math/shared/functions'
import { LimitTable } from '@/curriculum/math/shared/LimitTable'
import { AutoGrid, FunctionPlot } from '@/curriculum/math/shared/plot'
import { C, cases } from './cases'

const BASE_VIEW = { x: [-1, 3] as Vector2, y: [-0.5, 3.5] as Vector2 }

/** Six behaviours at x = 1: zoom in and compare the slopes from the left and from the right. */
export function SmoothnessGallery() {
  const [caseId, setCaseId] = useState('smooth')
  const [zoom, setZoom] = useState(1)
  const [hExp, setHExp] = useState(-0.3)
  const [revealed, setRevealed] = useState(false)
  const item = cases.find((c) => c.id === caseId)!

  const h = 10 ** hExp
  const center: Vector2 = [C, item.f(C)]
  const leftPoint: Vector2 = [C - h, item.f(C - h)]
  const rightPoint: Vector2 = [C + h, item.f(C + h)]
  const leftSlope = differenceQuotient(item.f, C, -h)
  const rightSlope = differenceQuotient(item.f, C, h)

  const half = (BASE_VIEW.x[1] - BASE_VIEW.x[0]) / 2 / zoom
  const halfY = (BASE_VIEW.y[1] - BASE_VIEW.y[0]) / 2 / zoom
  const view =
    zoom === 1
      ? BASE_VIEW
      : { x: [C - half, C + half] as Vector2, y: [center[1] - halfY, center[1] + halfY] as Vector2 }

  const choose = (id: string) => {
    setCaseId(id)
    setRevealed(false)
  }

  const graph = (
    <Mafs viewBox={{ ...view, padding: 0 }} height={420} pan={false}>
      <AutoGrid viewBox={view} />
      <Line.ThroughPoints point1={leftPoint} point2={center} color={colors.first} weight={2} opacity={0.85} />
      <Line.ThroughPoints point1={center} point2={rightPoint} color={colors.second} weight={2} opacity={0.85} />
      {item.pieces.map((piece, i) => (
        <FunctionPlot key={i} y={piece.y} domain={piece.domain} color={colors.curve} weight={3} />
      ))}
      {item.dots.map(({ at, open }) => (
        <Point
          key={`${at}`}
          x={at[0]}
          y={at[1]}
          color={colors.curve}
          svgCircleProps={open ? { style: { fill: 'white', stroke: colors.curve, strokeWidth: 2 } } : undefined}
        />
      ))}
      <Point x={leftPoint[0]} y={leftPoint[1]} color={colors.first} />
      <Point x={rightPoint[0]} y={rightPoint[1]} color={colors.second} />
    </Mafs>
  )

  const panel = (
    <>
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="overflow-x-auto">
          <Tex>{`f(x) = ${item.tex}`}</Tex>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          Zoom
          <SegmentedControl
            ariaLabel="Zoom"
            value={zoom}
            onChange={setZoom}
            options={[1, 10, 100].map((z) => ({ value: z, label: `${z}×` }))}
          />
        </div>
        <Slider label={<Tex>h</Tex>} value={hExp} min={-3} max={0} onChange={setHExp} display={fmtSig(h, 2)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Readout label="Slope from the left" value={fmt(leftSlope)} color={colors.first} />
        <Readout label="Slope from the right" value={fmt(rightSlope)} color={colors.second} />
      </div>
      {revealed ? (
        <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
          <p>
            Continuous at 1? <strong>{item.continuous ? 'Yes ✓' : 'No ✗'}</strong>
            <br />
            Differentiable at 1? <strong>{item.differentiable ? 'Yes ✓' : 'No ✗'}</strong>
          </p>
          <p className="text-sm text-slate-600">{item.why}</p>
        </div>
      ) : (
        <Button variant="primary" onClick={() => setRevealed(true)}>
          Reveal the verdict
        </Button>
      )}
    </>
  )

  return (
    <div className="space-y-4">
      <SegmentedControl
        ariaLabel="Example"
        value={caseId}
        onChange={choose}
        options={cases.map((c) => ({ value: c.id, label: c.label }))}
      />
      <ExplorerLayout graph={graph} panel={panel} />
      <LimitTable
        f={item.f}
        a={C}
        limits={{ left: revealed ? item.left : '?', right: revealed ? item.right : '?' }}
      />
    </div>
  )
}
