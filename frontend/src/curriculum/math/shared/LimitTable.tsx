import type { ReactNode } from 'react'
import { Tex } from '@/components/math/Tex'
import { differenceQuotient, type RealFunction } from '@/lib/calculus'
import { fmt } from '@/lib/format'
import { colors } from './colors'

const STEPS = [1, 0.1, 0.01, 0.001]

interface LimitTableProps {
  f: RealFunction
  a: number
  /** Final "h → 0" row, e.g. the revealed one-sided limits. Omit to hide the row. */
  limits?: { left: ReactNode; right: ReactNode }
}

/** The classic numerical-limit table: secant slopes for h shrinking toward 0 from both sides. */
export function LimitTable({ f, a, limits }: LimitTableProps) {
  const cell = 'px-4 py-2 text-right font-mono'
  const head = 'px-4 py-2 text-right font-medium'
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <caption className="px-4 pt-3 text-left text-slate-600">
          Secant slopes <Tex>{String.raw`\frac{f(a+h)-f(a)}{h}`}</Tex> at <Tex>{`a = ${fmt(a, 1)}`}</Tex>
        </caption>
        <thead className="text-slate-500">
          <tr className="border-b border-slate-100">
            <th className={head}>h</th>
            <th className={head}>from the right</th>
            <th className={head}>h</th>
            <th className={head}>from the left</th>
          </tr>
        </thead>
        <tbody>
          {STEPS.map((h) => (
            <tr key={h} className="border-b border-slate-100">
              <td className={`${cell} text-slate-500`}>{h}</td>
              <td className={cell} style={{ color: colors.average }}>
                {fmt(differenceQuotient(f, a, h), 5)}
              </td>
              <td className={`${cell} text-slate-500`}>{-h}</td>
              <td className={cell} style={{ color: colors.average }}>
                {fmt(differenceQuotient(f, a, -h), 5)}
              </td>
            </tr>
          ))}
          {limits && (
            <tr className="font-semibold">
              <td className={cell}>
                <Tex>{String.raw`h \to 0^+`}</Tex>
              </td>
              <td className={cell} style={{ color: colors.instant }}>
                {limits.right}
              </td>
              <td className={cell}>
                <Tex>{String.raw`h \to 0^-`}</Tex>
              </td>
              <td className={cell} style={{ color: colors.instant }}>
                {limits.left}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
