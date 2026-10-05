import { useState } from 'react'
import { Tex } from '@/components/math/Tex'
import { Button } from '@/components/ui/Button'
import { numericDerivative } from '@/lib/calculus'
import { fmt } from '@/lib/format'
import { colors } from '@/curriculum/math/shared/colors'

const XS = [-2, -1, 1, 2, 3]
const NS = [1, 2, 3, 4, 5]

/** Slopes of xⁿ measured numerically: students hunt for the pattern before it is revealed. */
export function PatternTable() {
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <thead className="text-sm text-slate-500">
            <tr className="border-b border-slate-200">
              <th className="px-3 py-2 text-left font-medium">f(x)</th>
              {XS.map((x) => (
                <th key={x} className="px-3 py-2 font-medium">
                  <Tex>{`f'(${x})`}</Tex>
                </th>
              ))}
              <th className="px-3 py-2 font-medium">pattern</th>
            </tr>
          </thead>
          <tbody>
            {NS.map((n) => (
              <tr key={n} className="border-b border-slate-100">
                <td className="px-3 py-2 text-left">
                  <Tex>{n === 1 ? 'x' : `x^{${n}}`}</Tex>
                </td>
                {XS.map((x) => (
                  <td key={x} className="px-3 py-2 font-mono" style={{ color: colors.instant }}>
                    {fmt(numericDerivative((v) => v ** n, x), 0)}
                  </td>
                ))}
                <td className="px-3 py-2">
                  {revealed ? (
                    <Tex>{`\\textcolor{${colors.instant}}{${n === 1 ? '1' : n === 2 ? '2x' : `${n}x^{${n - 1}}`}}`}</Tex>
                  ) : (
                    '?'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">Each slope was measured with a tiny secant line, with no rules used.</p>
        <Button variant={revealed ? 'secondary' : 'primary'} onClick={() => setRevealed(!revealed)}>
          {revealed ? 'Hide' : 'Reveal'} the pattern
        </Button>
      </div>
    </div>
  )
}
