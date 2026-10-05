import { ServerMessage } from '@/components/lesson/ServerMessage'
import { Tex } from '@/components/math/Tex'
import { useServerResult } from '@/lib/useServerResult'
import { fetchDerivativeSteps } from './api'
import { colors } from './colors'

/** Differentiates `expression` one rule at a time (SymPy on the server), naming each rule. */
export function DerivativeStepsPanel({ expression }: { expression: string }) {
  const state = useServerResult(expression, (signal) => fetchDerivativeSteps(expression, signal))

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-slate-900">Step by step</h3>
      <p className="text-sm text-slate-500">Which rule applies at each stage, worked out by the SymPy server.</p>

      <ServerMessage state={state} />

      {state.status === 'ready' && (
        <>
          <ol className="mt-4 space-y-3">
            {state.result.steps.map((step, i) => (
              <li key={i} className="rounded-lg bg-slate-50 px-3 py-2">
                <span className="inline-block rounded-md bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
                  {i + 1}. {step.rule}
                </span>
                <div className="overflow-x-auto">
                  <Tex block>{step.latex}</Tex>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-4 overflow-x-auto border-t border-slate-200 pt-3">
            <Tex block>
              {`f'(x) = \\textcolor{${colors.instant}}{${state.result.derivativeLatex}}${
                state.result.simplifiedLatex ? ` = ${state.result.simplifiedLatex}` : ''
              }`}
            </Tex>
          </div>
        </>
      )}
    </div>
  )
}
