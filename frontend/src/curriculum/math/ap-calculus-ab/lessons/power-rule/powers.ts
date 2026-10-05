import type { MathFunction } from '@/curriculum/math/shared/functions'

/** f(x) = xⁿ for a whole number n, ready for the derivative tracer. */
export function wholePower(n: number): MathFunction {
  return {
    id: `x^${n}`,
    tex: `x^{${n}}`,
    expression: `x^${n}`,
    f: (x) => x ** n,
    df: (x) => n * x ** (n - 1),
    derivativeTex: n === 2 ? '2x' : `${n}x^{${n - 1}}`,
    viewBox: { x: [-2, 2], y: n % 2 === 0 ? [-0.5, 4] : [-4, 4] },
    defaultA: 1,
  }
}

export interface PowerExample {
  fn: MathFunction
  /** LaTeX for the familiar form, e.g. \frac{1}{x}. */
  original: string
  /** The exponent n after rewriting as xⁿ, as LaTeX. */
  exponent: string
  /** The power rule applied to xⁿ, then rewritten back in familiar notation. */
  powerRule: string
  simplified: string
}

const right = [0, Infinity] as [number, number]

export const powerExamples: PowerExample[] = [
  {
    original: String.raw`\frac{1}{x}`,
    exponent: '-1',
    powerRule: '-1\\,x^{-2}',
    simplified: String.raw`-\frac{1}{x^2}`,
    fn: {
      id: 'recip',
      tex: String.raw`\frac{1}{x}`,
      expression: '1/x',
      f: (x) => 1 / x,
      df: (x) => -1 / x ** 2,
      derivativeTex: String.raw`-\frac{1}{x^2}`,
      viewBox: { x: [-3, 3], y: [-3, 3] },
      defaultA: 1,
      breaks: [0],
    },
  },
  {
    original: String.raw`\frac{1}{x^2}`,
    exponent: '-2',
    powerRule: '-2\\,x^{-3}',
    simplified: String.raw`-\frac{2}{x^3}`,
    fn: {
      id: 'recip2',
      tex: String.raw`\frac{1}{x^2}`,
      expression: '1/x^2',
      f: (x) => 1 / x ** 2,
      df: (x) => -2 / x ** 3,
      derivativeTex: String.raw`-\frac{2}{x^3}`,
      viewBox: { x: [-3, 3], y: [-1, 4] },
      defaultA: 1,
      breaks: [0],
    },
  },
  {
    original: String.raw`\sqrt{x}`,
    exponent: '1/2',
    powerRule: String.raw`\tfrac12\,x^{-1/2}`,
    simplified: String.raw`\frac{1}{2\sqrt{x}}`,
    fn: {
      id: 'sqrt',
      tex: String.raw`\sqrt{x}`,
      expression: 'sqrt(x)',
      f: Math.sqrt,
      df: (x) => 0.5 / Math.sqrt(x),
      derivativeTex: String.raw`\frac{1}{2\sqrt{x}}`,
      viewBox: { x: [-0.5, 4], y: [-0.5, 2.5] },
      defaultA: 1,
      domain: right,
    },
  },
  {
    original: String.raw`\sqrt[3]{x}`,
    exponent: '1/3',
    powerRule: String.raw`\tfrac13\,x^{-2/3}`,
    simplified: String.raw`\frac{1}{3\sqrt[3]{x^2}}`,
    fn: {
      id: 'cbrt',
      tex: String.raw`\sqrt[3]{x}`,
      expression: 'x^(1/3)',
      f: Math.cbrt,
      df: (x) => 1 / (3 * Math.cbrt(x * x)),
      derivativeTex: String.raw`\frac{1}{3\sqrt[3]{x^2}}`,
      viewBox: { x: [-3, 3], y: [-2, 2] },
      defaultA: 1,
      breaks: [0],
    },
  },
  {
    original: String.raw`\frac{1}{\sqrt{x}}`,
    exponent: '-1/2',
    powerRule: String.raw`-\tfrac12\,x^{-3/2}`,
    simplified: String.raw`-\frac{1}{2x\sqrt{x}}`,
    fn: {
      id: 'rsqrt',
      tex: String.raw`\frac{1}{\sqrt{x}}`,
      expression: '1/sqrt(x)',
      f: (x) => 1 / Math.sqrt(x),
      df: (x) => -0.5 * x ** -1.5,
      derivativeTex: String.raw`-\frac{1}{2x\sqrt{x}}`,
      viewBox: { x: [-0.5, 4], y: [-0.5, 3] },
      defaultA: 1,
      domain: right,
    },
  },
]
