import { type MathFunction, periodicBreaks } from '@/curriculum/math/shared/functions'

const view = { x: [-3.3, 3.3] as [number, number], y: [-4, 4] as [number, number] }
const cosZeros = periodicBreaks(Math.PI / 2, Math.PI)
const sinZeros = periodicBreaks(0, Math.PI)

export const tangent: MathFunction = {
  id: 'tan',
  tex: '\\tan x',
  expression: 'tan(x)',
  f: Math.tan,
  df: (x) => 1 / Math.cos(x) ** 2,
  derivativeTex: '\\sec^2 x',
  viewBox: view,
  defaultA: 0.5,
  breaks: cosZeros,
}

export const secant: MathFunction = {
  id: 'sec',
  tex: '\\sec x',
  expression: 'sec(x)',
  f: (x) => 1 / Math.cos(x),
  df: (x) => Math.sin(x) / Math.cos(x) ** 2,
  derivativeTex: '\\sec x \\tan x',
  viewBox: view,
  defaultA: 0.5,
  breaks: cosZeros,
}

export const cotangent: MathFunction = {
  id: 'cot',
  tex: '\\cot x',
  expression: 'cot(x)',
  f: (x) => Math.cos(x) / Math.sin(x),
  df: (x) => -1 / Math.sin(x) ** 2,
  derivativeTex: '-\\csc^2 x',
  viewBox: view,
  defaultA: 1,
  breaks: sinZeros,
}

export const cosecant: MathFunction = {
  id: 'csc',
  tex: '\\csc x',
  expression: 'csc(x)',
  f: (x) => 1 / Math.sin(x),
  df: (x) => -Math.cos(x) / Math.sin(x) ** 2,
  derivativeTex: '-\\csc x \\cot x',
  viewBox: view,
  defaultA: 1,
  breaks: sinZeros,
}
