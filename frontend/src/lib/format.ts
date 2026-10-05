/** Fixed-decimal display that never shows "-0.00" and says "undefined" for NaN/±∞. */
export function fmt(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return 'undefined'
  const s = value.toFixed(digits)
  return Number(s) === 0 ? (0).toFixed(digits) : s
}

/** Display with `sig` significant figures and no trailing zeros, e.g. 0.001234 → "0.0012". */
export function fmtSig(value: number, sig = 2): string {
  if (!Number.isFinite(value)) return 'undefined'
  return String(Number(value.toPrecision(sig)))
}

/** Axis-label formatter for a grid with spacing `step` (avoids 0.30000000000000004). */
export function axisLabeler(step: number): (value: number) => string {
  const decimals = Math.max(0, -Math.floor(Math.log10(step)))
  return (value) => fmt(value, decimals)
}

/** Axis label in multiples of π/2: "π/2", "π", "3π/2", "-π/2" … */
export function piLabel(x: number): string {
  const k = Math.round(x / (Math.PI / 2))
  if (k === 0) return '0'
  const sign = k < 0 ? '-' : ''
  const n = Math.abs(k)
  if (n % 2 === 0) return `${sign}${n === 2 ? '' : n / 2}π`
  return `${sign}${n === 1 ? '' : n}π/2`
}

/** Wrap a formatted negative number in parentheses for substitution, e.g. "(-1.5)". */
export function paren(s: string): string {
  return s.startsWith('-') ? `(${s})` : s
}

/** A term with its sign pulled out for formulas: 2 → "+ 2.00", -2 → "- 2.00". */
export function signedTerm(value: number, digits = 2): string {
  return value < 0 ? `- ${fmt(-value, digits)}` : `+ ${fmt(value, digits)}`
}
