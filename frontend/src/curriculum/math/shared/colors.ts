/**
 * Colour language used in every calculus picture, in graphs AND formulas:
 * orange = average (secant), blue = instantaneous (tangent, f′).
 * Literal hex values because KaTeX's \textcolor can't read CSS variables.
 * curve/average/instant are mirrored in the @theme block of src/index.css; keep them in sync.
 */
export const colors = {
  curve: '#1e293b',
  average: '#ea580c',
  instant: '#2563eb',
  /** When a picture has several functions: f, g, and their combination (f + g, fg, f/g). */
  first: '#0d9488',
  second: '#7c3aed',
  combined: '#db2777',
  /** Where something breaks: corners, jumps, common mistakes. */
  wrong: '#e11d48',
} as const
