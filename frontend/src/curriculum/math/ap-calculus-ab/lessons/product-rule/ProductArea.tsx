import { useState } from 'react'
import { Readout } from '@/components/lesson/ExplorerLayout'
import { Tex } from '@/components/math/Tex'
import { Slider } from '@/components/ui/Slider'
import { fmt } from '@/lib/format'
import { colors } from '@/curriculum/math/shared/colors'

// f(x) = x is the width, g(x) = x² the height, so the area is x³.
const f = (x: number) => x
const g = (x: number) => x * x
const X_SCALE = 90
const Y_SCALE = 30
const PAD = 24

/** The product f·g as a rectangle's area: grow x by dx and see which strips appear. */
export function ProductArea() {
  const [x, setX] = useState(1.5)
  const [dx, setDx] = useState(0.5)

  const [w, hgt] = [f(x), g(x)]
  const [dw, dh] = [f(x + dx) - w, g(x + dx) - hgt]
  const [W, H, DW, DH] = [w * X_SCALE, hgt * Y_SCALE, dw * X_SCALE, dh * Y_SCALE]
  const bottom = 9 * Y_SCALE + PAD

  const text = (cx: number, cy: number, label: string, color: string, show = true) =>
    show && (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={14} fontWeight={600} fill={color}>
        {label}
      </text>
    )

  const strips = {
    side: hgt * dw,
    top: w * dh,
    corner: dw * dh,
  }

  return (
    <div className="grid grid-cols-1 gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[minmax(0,1fr)_22rem]">
      <svg viewBox={`0 0 ${3 * X_SCALE + 2 * PAD} ${bottom + PAD}`} className="mx-auto w-full max-w-sm" role="img" aria-label="Product as area">
        <rect x={PAD} y={bottom - H} width={W} height={H} fill="#e2e8f0" stroke="#475569" />
        <rect x={PAD + W} y={bottom - H} width={DW} height={H} fill={colors.first} fillOpacity={0.35} stroke={colors.first} />
        <rect x={PAD} y={bottom - H - DH} width={W} height={DH} fill={colors.second} fillOpacity={0.35} stroke={colors.second} />
        <rect x={PAD + W} y={bottom - H - DH} width={DW} height={DH} fill={colors.wrong} fillOpacity={0.45} stroke={colors.wrong} />
        {text(PAD + W / 2, bottom - H / 2, 'f · g', '#0f172a')}
        {text(PAD + W + DW / 2, bottom - H / 2, 'g·Δf', colors.first, DW > 34)}
        {text(PAD + W / 2, bottom - H - DH / 2, 'f·Δg', colors.second, DH > 18)}
        <text x={PAD + W / 2} y={bottom + 14} textAnchor="middle" fontSize={12} fill="#475569">
          f(x) = x = {fmt(w, 1)}
        </text>
        <text x={PAD - 6} y={bottom - H / 2} textAnchor="end" fontSize={12} fill="#475569" transform={`rotate(-90 ${PAD - 6} ${bottom - H / 2})`}>
          g(x) = x² = {fmt(hgt, 2)}
        </text>
      </svg>
      <div className="space-y-4">
        <Slider label={<Tex>x</Tex>} value={x} min={0.5} max={2} step={0.1} onChange={setX} display={fmt(x, 1)} />
        <Slider label={<Tex>{String.raw`\Delta x`}</Tex>} value={dx} min={0.01} max={1} step={0.01} onChange={setDx} display={fmt(dx)} />
        <div className="overflow-x-auto rounded-xl bg-slate-50 px-3 py-1">
          <Tex block>
            {`\\Delta(fg) = \\textcolor{${colors.first}}{g\\,\\Delta f} + \\textcolor{${colors.second}}{f\\,\\Delta g} + \\textcolor{${colors.wrong}}{\\Delta f\\,\\Delta g}`}
          </Tex>
          <Tex block>
            {`= \\textcolor{${colors.first}}{${fmt(strips.side, 3)}} + \\textcolor{${colors.second}}{${fmt(strips.top, 3)}} + \\textcolor{${colors.wrong}}{${fmt(strips.corner, 3)}}`}
          </Tex>
          <Tex block>
            {`\\frac{\\Delta(fg)}{\\Delta x} = ${fmt((strips.side + strips.top + strips.corner) / dx, 3)}`}
          </Tex>
        </div>
        <Readout
          label={<Tex>{String.raw`\text{As } \Delta x \to 0:\ g f' + f g' = x^2 \cdot 1 + x \cdot 2x = 3x^2`}</Tex>}
          value={fmt(3 * x * x, 3)}
          color={colors.instant}
        />
        <p className="text-sm text-slate-600">
          The red corner <Tex>{String.raw`\Delta f\,\Delta g`}</Tex> shrinks twice as fast as the strips. It is the
          only piece that disappears in the limit, and it is exactly the <Tex>{"f'g'"}</Tex> people wrongly expect.
        </p>
      </div>
    </div>
  )
}
