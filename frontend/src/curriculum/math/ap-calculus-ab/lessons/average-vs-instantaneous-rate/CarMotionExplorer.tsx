import { Coordinates, Line, Mafs, MovablePoint, Plot, Point } from 'mafs'
import 'mafs/core.css'
import { useState } from 'react'
import { Readout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'
import { fmt, fmtSig } from '@/lib/format'
import { useAnimationFrame } from '@/lib/hooks'
import { colors } from '@/curriculum/math/shared/colors'
import type { Vector2 } from '@/curriculum/math/shared/functions'

// A 10-second drive: speeds up, peaks at 15 m/s at t = 5, then brakes to a stop at 100 m.
const T_END = 10
const position = (t: number) => 3 * t ** 2 - 0.2 * t ** 3
const velocity = (t: number) => 6 * t - 0.6 * t ** 2

interface CarMotionExplorerProps {
  /**
   * intro: average speed "so far" over [0, t] vs the speedometer.
   * full:  average velocity over [t, t + Δt] with a position graph, to resolve the paradox.
   */
  mode: 'intro' | 'full'
}

export function CarMotionExplorer({ mode }: CarMotionExplorerProps) {
  const full = mode === 'full'
  const [t, setT] = useState(full ? 5 : 0)
  const [dtExp, setDtExp] = useState(full ? Math.log10(3) : 0)
  const [playing, setPlaying] = useState(false)

  const [start, end] = full ? [t, Math.min(T_END, t + 10 ** dtExp)] : [0, t]
  const averageVelocity = end > start ? (position(end) - position(start)) / (end - start) : NaN
  const instant = velocity(t)

  useAnimationFrame((dt) => {
    const next = Math.min(T_END, t + dt)
    setT(next)
    if (next === T_END) setPlaying(false)
  }, playing)

  const play = () => {
    if (t >= T_END) setT(0)
    setPlaying(true)
  }

  const digits = end > start ? Math.max(2, Math.ceil(-Math.log10(end - start))) : 2
  const intervalTex = `[${fmt(start, digits)},\\ ${fmt(end, digits)}]`

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <Road carAt={position(t)} from={position(start)} to={position(end)} ghostAt={full ? position(end) : undefined} />
      </div>

      <div className={`grid grid-cols-1 gap-5 ${full ? 'lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start' : 'md:grid-cols-2'}`}>
        {full ? (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <PositionGraph t={t} end={end} onMove={setT} />
            <p className="border-t border-slate-100 px-4 py-2 text-sm text-slate-500">
              Position <Tex>s(t)</Tex> in meters vs. time <Tex>t</Tex> in seconds. Drag the blue point.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <Speedometer instant={instant} average={averageVelocity} />
          </div>
        )}

        <div className="space-y-4">
          {full && (
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <Speedometer instant={instant} average={averageVelocity} />
            </div>
          )}
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
            <Slider
              label={<Tex>t</Tex>}
              value={t}
              min={0}
              max={T_END}
              onChange={(v) => {
                setPlaying(false)
                setT(v)
              }}
              display={`${fmt(t, 2)} s`}
              color={colors.instant}
            />
            {full && (
              <Slider
                label={<Tex>{String.raw`\Delta t`}</Tex>}
                value={dtExp}
                min={-3}
                max={1}
                onChange={setDtExp}
                display={`${fmtSig(10 ** dtExp, 2)} s`}
                color={colors.average}
              />
            )}
            <div className="flex gap-2">
              {playing ? (
                <Button onClick={() => setPlaying(false)}>Pause</Button>
              ) : (
                <Button variant="primary" onClick={play}>
                  ▶ Drive
                </Button>
              )}
              <Button
                onClick={() => {
                  setPlaying(false)
                  setT(0)
                }}
              >
                Reset
              </Button>
            </div>
          </div>

          <Readout
            label={
              <>
                {full ? 'Average velocity' : 'Average speed so far'} on <Tex>{intervalTex}</Tex>{' '}
                <Tex>{String.raw`= \frac{\Delta s}{\Delta t}`}</Tex>
              </>
            }
            value={`${fmt(averageVelocity, full ? 4 : 2)} m/s`}
            color={colors.average}
          />
          <Readout
            label={
              <>
                Speedometer at <Tex>{`t = ${fmt(t, 2)}`}</Tex>
              </>
            }
            value={`${fmt(instant, full ? 4 : 2)} m/s`}
            color={colors.instant}
          />
        </div>
      </div>
    </div>
  )
}

function PositionGraph({ t, end, onMove }: { t: number; end: number; onMove: (t: number) => void }) {
  const P: Vector2 = [t, position(t)]
  const Q: Vector2 = [end, position(end)]
  return (
    <Mafs height={360} viewBox={{ x: [0, T_END], y: [0, 105] }} preserveAspectRatio={false} pan={false}>
      <Coordinates.Cartesian
        subdivisions={false}
        xAxis={{ lines: 1, labels: (v) => `${v}` }}
        yAxis={{ lines: 20, labels: (v) => `${v}` }}
      />
      <Plot.OfX y={position} domain={[0, T_END]} color={colors.curve} weight={3} />
      {end > t && <Line.ThroughPoints point1={P} point2={Q} color={colors.average} weight={2.5} />}
      <Line.PointSlope point={P} slope={velocity(t)} color={colors.instant} style="dashed" weight={2} />
      <Point x={Q[0]} y={Q[1]} color={colors.average} />
      <MovablePoint
        point={P}
        onMove={([x]) => onMove(x)}
        constrain={([x]) => {
          const tt = Math.min(T_END, Math.max(0, Math.round(x * 100) / 100))
          return [tt, position(tt)]
        }}
        color={colors.instant}
      />
    </Mafs>
  )
}

// ---------------------------------------------------------------------------------------------
// Plain SVG illustrations

const ROAD_X0 = 80
const ROAD_X1 = 960
const xOf = (meters: number) => ROAD_X0 + (meters / 100) * (ROAD_X1 - ROAD_X0)

function Road({ carAt, from, to, ghostAt }: { carAt: number; from: number; to: number; ghostAt?: number }) {
  return (
    <svg viewBox="0 0 1000 116" className="w-full" role="img" aria-label={`Car at ${fmt(carAt, 1)} meters`}>
      <rect x={0} y={70} width={1000} height={14} fill="#334155" />
      <line x1={0} x2={1000} y1={77} y2={77} stroke="#f8fafc" strokeDasharray="18 14" strokeWidth={1.5} />
      {Array.from({ length: 11 }, (_, i) => (
        <g key={i}>
          <line x1={xOf(i * 10)} x2={xOf(i * 10)} y1={84} y2={92} stroke="#94a3b8" />
          <text x={xOf(i * 10)} y={107} textAnchor="middle" fontSize={13} fill="#64748b">
            {i * 10}
            {i === 10 ? ' m' : ''}
          </text>
        </g>
      ))}

      {to > from && (
        <g stroke={colors.average} strokeWidth={2.5}>
          <line x1={xOf(from)} x2={xOf(to)} y1={18} y2={18} />
          <line x1={xOf(from)} x2={xOf(from)} y1={12} y2={24} />
          <line x1={xOf(to)} x2={xOf(to)} y1={12} y2={24} />
          <text x={(xOf(from) + xOf(to)) / 2} y={11} textAnchor="middle" fontSize={14} fill={colors.average} stroke="none">
            Δs = {fmt(to - from, 2)} m
          </text>
        </g>
      )}

      {ghostAt !== undefined && <Car frontX={xOf(ghostAt)} ghost />}
      <Car frontX={xOf(carAt)} />
    </svg>
  )
}

/** A side-view car whose front bumper sits at x = frontX. */
function Car({ frontX, ghost = false }: { frontX: number; ghost?: boolean }) {
  const paint = ghost
    ? { fill: 'none', stroke: colors.average, strokeWidth: 2, strokeDasharray: '5 3' }
    : { fill: colors.instant, stroke: '#1e3a8a', strokeWidth: 1.5 }
  return (
    <g transform={`translate(${frontX - 64} 29)`}>
      <path
        d="M2 34 L2 22 Q4 14 14 13 L22 4 Q24 1 28 1 L44 1 Q48 1 51 5 L57 13 Q62 14 64 22 L64 34 Z"
        {...paint}
      />
      {!ghost && <path d="M24 6 L44 6 Q46 6 48 8 L52 13 L19 13 Z" fill="#dbeafe" />}
      <circle cx={16} cy={34} r={7} fill={ghost ? 'none' : '#0f172a'} stroke={ghost ? colors.average : 'none'} strokeWidth={2} />
      <circle cx={50} cy={34} r={7} fill={ghost ? 'none' : '#0f172a'} stroke={ghost ? colors.average : 'none'} strokeWidth={2} />
    </g>
  )
}

const MAX_SPEED = 20

/** Gauge with a blue needle (instantaneous velocity) and an orange needle (average velocity). */
function Speedometer({ instant, average }: { instant: number; average: number }) {
  const cx = 120
  const cy = 120
  const r = 100
  const at = (v: number, radius: number): Vector2 => {
    const angle = Math.PI * (1 - Math.min(Math.max(v, 0), MAX_SPEED) / MAX_SPEED)
    return [cx + radius * Math.cos(angle), cy - radius * Math.sin(angle)]
  }
  const ticks = Array.from({ length: MAX_SPEED / 2 + 1 }, (_, i) => i * 2)
  const needle = ([x, y]: Vector2, color: string) => (
    <line x1={cx} y1={cy} x2={x} y2={y} stroke={color} strokeWidth={4} strokeLinecap="round" />
  )

  return (
    <svg viewBox="0 0 240 150" className="mx-auto w-full max-w-xs" role="img" aria-label="Speedometer">
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#cbd5e1" strokeWidth={3} />
      {ticks.map((v) => {
        const major = v % 4 === 0
        const [x1, y1] = at(v, r)
        const [x2, y2] = at(v, r - (major ? 12 : 7))
        const [lx, ly] = at(v, r - 25)
        return (
          <g key={v}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth={major ? 2 : 1} />
            {major && (
              <text x={lx} y={ly + 4} textAnchor="middle" fontSize={12} fill="#475569">
                {v}
              </text>
            )}
          </g>
        )
      })}
      {Number.isFinite(average) && needle(at(average, r - 30), colors.average)}
      {needle(at(instant, r - 14), colors.instant)}
      <circle cx={cx} cy={cy} r={6} fill="#1e293b" />
      <text x={cx} y={cy + 24} textAnchor="middle" fontSize={12} fill="#64748b">
        m/s
      </text>
    </svg>
  )
}
