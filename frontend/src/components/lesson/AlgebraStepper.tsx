import { type ReactNode, useState } from 'react'
import { Tex } from '@/components/math/Tex'
import { Button } from '@/components/ui/Button'

export interface AlgebraLine {
  tex: string
  /** Why this line follows from the previous one. */
  note?: ReactNode
}

/** A derivation revealed one line at a time, so the class can predict each next step. */
export function AlgebraStepper({ title, lines }: { title?: ReactNode; lines: AlgebraLine[] }) {
  const [shown, setShown] = useState(1)
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {title && <h3 className="font-semibold text-slate-900">{title}</h3>}
      <ol className="mt-2 divide-y divide-slate-100">
        {lines.slice(0, shown).map((line, i) => (
          <li key={i} className="grid grid-cols-1 items-center gap-x-6 py-1 md:grid-cols-[minmax(0,1fr)_16rem]">
            <div className="overflow-x-auto">
              <Tex block>{line.tex}</Tex>
            </div>
            {line.note && <p className="pb-2 text-sm text-slate-500 md:pb-0">{line.note}</p>}
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="primary" onClick={() => setShown(shown + 1)} disabled={shown >= lines.length}>
          Next line
        </Button>
        <Button onClick={() => setShown(lines.length)} disabled={shown >= lines.length}>
          Show all
        </Button>
        <Button variant="ghost" onClick={() => setShown(1)} disabled={shown === 1}>
          Start over
        </Button>
      </div>
    </div>
  )
}
