import { useState } from 'react'
import { Readout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { Slider } from '@/components/ui/Slider'
import { fmt } from '@/lib/format'
import { colors } from '@/curriculum/math/shared/colors'

const SCALE = 80
const SIZE = 4 * SCALE + 40

/**
 * The area of a square of side x is x². Grow the side by h: the new area is
 * x² + 2xh + h². The two strips give the derivative 2x; the corner h² vanishes.
 */
export function GrowingSquare() {
  const [x, setX] = useState(2)
  const [h, setH] = useState(0.6)
  const [s, d] = [x * SCALE, h * SCALE]
  const bottom = SIZE - 20

  const label = (cx: number, cy: number, text: string, color = '#0f172a') => (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={15} fill={color} fontWeight={600}>
      {text}
    </text>
  )

  return (
    <div className="grid grid-cols-1 gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[minmax(0,1fr)_20rem]">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-md" role="img" aria-label="Growing square">
        <rect x={20} y={bottom - s} width={s} height={s} fill="#e2e8f0" stroke="#475569" />
        <rect x={20 + s} y={bottom - s} width={d} height={s} fill={colors.first} fillOpacity={0.35} stroke={colors.first} />
        <rect x={20} y={bottom - s - d} width={s} height={d} fill={colors.second} fillOpacity={0.35} stroke={colors.second} />
        <rect x={20 + s} y={bottom - s - d} width={d} height={d} fill={colors.wrong} fillOpacity={0.45} stroke={colors.wrong} />
        {label(20 + s / 2, bottom - s / 2, 'x²')}
        {d > 18 && label(20 + s + d / 2, bottom - s / 2, 'xh', colors.first)}
        {d > 18 && label(20 + s / 2, bottom - s - d / 2, 'xh', colors.second)}
        {d > 24 && label(20 + s + d / 2, bottom - s - d / 2, 'h²', colors.wrong)}
        <text x={20 + s / 2} y={bottom + 14} textAnchor="middle" fontSize={13} fill="#475569">
          x = {fmt(x, 1)}
        </text>
      </svg>
      <div className="space-y-4">
        <Slider label={<Tex>x</Tex>} value={x} min={1} max={3} step={0.1} onChange={setX} display={fmt(x, 1)} />
        <Slider label={<Tex>h</Tex>} value={h} min={0.01} max={1} step={0.01} onChange={setH} display={fmt(h)} />
        <div className="overflow-x-auto rounded-xl bg-slate-50 px-3 py-1">
          <Tex block>
            {`\\Delta A = \\textcolor{${colors.first}}{xh} + \\textcolor{${colors.second}}{xh} + \\textcolor{${colors.wrong}}{h^2}`}
          </Tex>
          <Tex block>{`\\frac{\\Delta A}{h} = 2x + \\textcolor{${colors.wrong}}{h} = ${fmt(2 * x + h)}`}</Tex>
        </div>
        <Readout label={<Tex>{String.raw`\text{As } h \to 0: \ \frac{dA}{dx} = 2x`}</Tex>} value={fmt(2 * x)} color={colors.instant} />
        <p className="text-sm text-slate-600">
          Shrink <Tex>h</Tex>: the corner <Tex>h^2</Tex> becomes negligible next to the two strips.
        </p>
      </div>
    </div>
  )
}
