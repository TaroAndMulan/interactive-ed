import type { ReactNode } from 'react'

type Kind = 'idea' | 'think' | 'ap'

const styles: Record<Kind, { label: string; className: string }> = {
  idea: { label: 'Key idea', className: 'border-blue-200 bg-blue-50 text-blue-950' },
  think: { label: 'Think about it', className: 'border-violet-200 bg-violet-50 text-violet-950' },
  ap: { label: 'AP exam tip', className: 'border-slate-300 bg-white text-slate-800' },
}

export function Callout({ kind = 'idea', title, children }: { kind?: Kind; title?: string; children: ReactNode }) {
  const style = styles[kind]
  return (
    <div className={`rounded-xl border px-4 py-3 ${style.className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{title ?? style.label}</p>
      <div className="mt-1 space-y-2 leading-relaxed">{children}</div>
    </div>
  )
}

/** A readable-width column of lesson text. */
export function Prose({ children }: { children: ReactNode }) {
  return <div className="max-w-3xl space-y-3 leading-relaxed text-slate-700">{children}</div>
}
