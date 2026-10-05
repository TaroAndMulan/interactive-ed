import { Coordinates, Plot } from 'mafs'
import type { ReactNode } from 'react'
import { niceStep, type RealFunction } from '@/lib/calculus'
import { axisLabeler, piLabel } from '@/lib/format'
import type { Vector2 } from './functions'

const EPSILON = 1e-4

interface FunctionPlotProps {
  y: RealFunction
  /** Asymptotes/jumps: the curve is drawn in separate pieces between them. */
  breaks?: number[]
  domain?: Vector2
  color?: string
  weight?: number
  opacity?: number
  style?: 'solid' | 'dashed'
}

/** Plot.OfX that doesn't draw false vertical lines across asymptotes or jumps. */
export function FunctionPlot({ y, breaks = [], domain = [-Infinity, Infinity], ...stroke }: FunctionPlotProps) {
  const cuts = breaks.filter((b) => b > domain[0] && b < domain[1]).sort((p, q) => p - q)
  const edges = [domain[0], ...cuts, domain[1]]
  return (
    <>
      {edges.slice(1).map((end, i) => (
        <Plot.OfX
          key={i}
          y={y}
          domain={[edges[i] + (i > 0 ? EPSILON : 0), end - (i < cuts.length ? EPSILON : 0)]}
          {...stroke}
        />
      ))}
    </>
  )
}

/** Cartesian grid with readable spacing for any window; `pi` labels the x-axis in multiples of π/2. */
export function AutoGrid({ viewBox, pi = false }: { viewBox: { x: Vector2; y: Vector2 }; pi?: boolean }) {
  // Few lines on purpose: equal-aspect graphs often show more than the requested window.
  const xStep = pi ? Math.PI / 2 : niceStep(viewBox.x[1] - viewBox.x[0], 6)
  const yStep = niceStep(viewBox.y[1] - viewBox.y[0], 5)
  return (
    <Coordinates.Cartesian
      subdivisions={false}
      xAxis={{ lines: xStep, labels: pi ? piLabel : axisLabeler(xStep) }}
      yAxis={{ lines: yStep, labels: axisLabeler(yStep) }}
    />
  )
}

/** A caption pinned to the top-left corner of a graph. */
export function GraphLabel({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none absolute left-3 top-2 z-10 rounded-md bg-white/85 px-2 py-0.5 text-sm">
      {children}
    </div>
  )
}
