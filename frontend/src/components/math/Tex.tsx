import katex from 'katex'
import 'katex/dist/katex.min.css'
import { useMemo } from 'react'

interface TexProps {
  /** LaTeX source, e.g. String.raw`\frac{f(b)-f(a)}{b-a}`. */
  children: string
  /** Display (block, centred) math instead of inline math. */
  block?: boolean
  className?: string
}

export function Tex({ children, block = false, className }: TexProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(children, { displayMode: block, throwOnError: true })
    } catch (error) {
      // Make typos visible during development; students see KaTeX's red source text instead.
      if (import.meta.env.DEV) console.error(`Invalid LaTeX: ${children}`, error)
      return katex.renderToString(children, { displayMode: block, throwOnError: false })
    }
  }, [children, block])
  const Tag = block ? 'div' : 'span'
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
