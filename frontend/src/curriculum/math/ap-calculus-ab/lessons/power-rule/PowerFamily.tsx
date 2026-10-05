import { useState } from 'react'
import { Tex } from '@/components/math/Tex'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { colors } from '@/curriculum/math/shared/colors'
import { DerivativeTracer } from '@/curriculum/math/shared/DerivativeTracer'
import { powerExamples } from './powers'

/** Roots and reciprocals: rewrite as xⁿ, apply the power rule, rewrite back. */
export function PowerFamily() {
  const [id, setId] = useState(powerExamples[0].fn.id)
  const example = powerExamples.find((e) => e.fn.id === id)!

  const rewrite = (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white px-4 py-2">
      <p className="pt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Rewrite → power rule → simplify</p>
      <Tex block>{`f(x) = ${example.original} = x^{\\textcolor{${colors.average}}{${example.exponent}}}`}</Tex>
      <Tex block>{`f'(x) = ${example.powerRule} = \\textcolor{${colors.instant}}{${example.simplified}}`}</Tex>
    </div>
  )

  return (
    <div className="space-y-4">
      <SegmentedControl
        ariaLabel="Function"
        value={id}
        onChange={setId}
        options={powerExamples.map((e) => ({ value: e.fn.id, label: <Tex>{e.original}</Tex> }))}
      />
      <DerivativeTracer key={id} fn={example.fn} revealed panelExtra={rewrite} />
    </div>
  )
}
