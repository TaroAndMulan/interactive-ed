import type { ReactNode } from 'react'

/** The horizontal data table used in AP problems: a header cell, then one value per column. */
export function ValueTable({ rows }: { rows: { label: ReactNode; values: ReactNode[] }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="mt-2 text-center font-mono text-sm">
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              <th className="border border-slate-200 bg-slate-50 px-3 py-1 text-left font-sans font-medium">{row.label}</th>
              {row.values.map((value, c) => (
                <td key={c} className="border border-slate-200 px-3 py-1">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
