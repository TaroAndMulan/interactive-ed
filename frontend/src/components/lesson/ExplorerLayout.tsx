import type { ReactNode } from 'react'

/** Interactive graph on the left, controls and readouts on the right (stacked on small screens). */
export function ExplorerLayout({ graph, panel }: { graph: ReactNode; panel: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">{graph}</div>
      <div className="space-y-4">{panel}</div>
    </div>
  )
}

/** A labelled value, e.g. "Average rate of change: 3.50". */
export function Readout({ label, value, color }: { label: ReactNode; value: ReactNode; color?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-0.5 font-mono text-2xl font-semibold" style={{ color }}>
        {value}
      </div>
    </div>
  )
}
