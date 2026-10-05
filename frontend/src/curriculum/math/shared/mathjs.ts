const FUNCTIONS = 'sin|cos|tan|sec|csc|cot|ln|log|exp|sqrt|abs'

/**
 * Rewrites classroom notation that mathjs rejects, so the browser accepts the same input
 * as the SymPy server: "sin^2 x" → "sin(x)^2", "sec^2(x)" → "sec(x)^2", "ln x" → "log(x)".
 */
export function normalizeMathInput(input: string): string {
  return input
    .replace(new RegExp(`\\b(${FUNCTIONS})\\^(\\d+)\\s*\\(([^()]*)\\)`, 'g'), '$1($3)^$2')
    .replace(new RegExp(`\\b(${FUNCTIONS})\\^(\\d+)\\s+([\\w.]+)`, 'g'), '$1($3)^$2')
    .replace(new RegExp(`\\b(${FUNCTIONS})\\s+([\\w.]+)`, 'g'), '$1($2)')
    .replace(/\bln\b/g, 'log')
}

/** mathjs is large, so it is only downloaded the first time someone types a function. */
export async function parseMath(input: string) {
  const { parse } = await import('mathjs')
  return parse(normalizeMathInput(input))
}
