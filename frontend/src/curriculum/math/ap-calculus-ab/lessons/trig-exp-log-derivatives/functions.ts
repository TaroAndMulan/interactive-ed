import type { MathFunction } from '@/curriculum/math/shared/functions'

const trigView = { x: [-0.5, 6.8] as [number, number], y: [-1.5, 1.5] as [number, number] }

export const sine: MathFunction = {
  id: 'sin',
  tex: '\\sin x',
  expression: 'sin(x)',
  f: Math.sin,
  df: Math.cos,
  derivativeTex: '\\cos x',
  viewBox: trigView,
  defaultA: 0.5,
}

export const cosine: MathFunction = {
  id: 'cos',
  tex: '\\cos x',
  expression: 'cos(x)',
  f: Math.cos,
  df: (x) => -Math.sin(x),
  derivativeTex: '-\\sin x',
  viewBox: trigView,
  defaultA: 0.5,
}

export const naturalLog: MathFunction = {
  id: 'ln',
  tex: '\\ln x',
  expression: 'ln(x)',
  f: Math.log,
  df: (x) => 1 / x,
  derivativeTex: '\\frac{1}{x}',
  viewBox: { x: [-0.5, 5], y: [-3, 2] },
  defaultA: 1,
  domain: [0, Infinity],
}
