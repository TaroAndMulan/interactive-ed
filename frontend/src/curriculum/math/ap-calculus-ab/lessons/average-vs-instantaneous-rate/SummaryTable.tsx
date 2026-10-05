import type { ReactNode } from 'react'
import { Tex } from '@/components/math/Tex'
import { colors } from '@/curriculum/math/shared/colors'

const rows: { label: string; average: ReactNode; instant: ReactNode }[] = [
  {
    label: 'Needs',
    average: <>an interval <Tex>[a, b]</Tex>: two points</>,
    instant: <>a single point <Tex>x = a</Tex></>,
  },
  {
    label: 'Formula',
    average: <Tex>{String.raw`\frac{f(b) - f(a)}{b - a}`}</Tex>,
    instant: <Tex>{String.raw`f'(a) = \lim_{h \to 0} \frac{f(a+h) - f(a)}{h}`}</Tex>,
  },
  { label: 'Picture', average: 'slope of the secant line', instant: 'slope of the tangent line' },
  {
    label: 'For a moving car',
    average: 'average velocity: distance ÷ time for a trip',
    instant: 'the speedometer reading',
  },
  { label: 'How to compute it', average: 'arithmetic', instant: 'a limit of average rates' },
  {
    label: 'Units',
    average: 'output units per input unit (e.g. m/s)',
    instant: 'the same: output units per input unit',
  },
]

export function SummaryTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="w-40 px-5 py-3" />
            <th className="px-5 py-3 text-lg" style={{ color: colors.average }}>
              Average rate of change
            </th>
            <th className="px-5 py-3 text-lg" style={{ color: colors.instant }}>
              Instantaneous rate of change
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, average, instant }) => (
            <tr key={label} className="border-b border-slate-100 last:border-0">
              <th className="px-5 py-3 text-sm font-medium text-slate-500">{label}</th>
              <td className="px-5 py-3">{average}</td>
              <td className="px-5 py-3">{instant}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
