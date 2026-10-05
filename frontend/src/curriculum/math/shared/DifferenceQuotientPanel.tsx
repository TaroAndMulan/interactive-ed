import { ServerMessage } from '@/components/lesson/ServerMessage'
import { Tex } from '@/components/math/Tex'
import { useServerResult } from '@/lib/useServerResult'
import { fetchDifferenceQuotient } from './api'
import { colors } from './colors'
import type { MathFunction } from './functions'

/** Shows the algebra of the limit definition for the current function, worked out by SymPy. */
export function DifferenceQuotientPanel({ fn }: { fn: MathFunction }) {
  const state = useServerResult(fn.expression, (signal) => fetchDifferenceQuotient(fn.expression, signal))

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-slate-900">The algebra behind the limit</h3>
      <p className="text-sm text-slate-500">Worked out symbolically for every x by the SymPy server.</p>

      <ServerMessage state={state} />

      {state.status === 'ready' && (
        <div className="mt-3 space-y-1 overflow-x-auto">
          <Tex block>{`f(x) = ${state.result.functionLatex}`}</Tex>
          <Tex block>{`\\frac{f(x+h)-f(x)}{h} = ${state.result.quotientLatex}`}</Tex>
          {state.result.hCancels ? (
            <>
              <Tex block>{`= ${state.result.simplifiedLatex} \\quad (h \\ne 0)`}</Tex>
              <p className="text-sm text-slate-600">
                After simplifying, putting <Tex>h = 0</Tex> no longer divides by zero, so we can let{' '}
                <Tex>h \to 0</Tex>:
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-600">
              Simple algebra doesn&rsquo;t cancel the <Tex>h</Tex> here (it takes tricks like conjugates or special
              trig limits), but the limit still exists:
            </p>
          )}
          <Tex block>{`f'(x) = \\lim_{h \\to 0}\\frac{f(x+h)-f(x)}{h} = \\textcolor{${colors.instant}}{${state.result.derivativeLatex}}`}</Tex>
        </div>
      )}
    </div>
  )
}
