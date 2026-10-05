import type { ReactNode } from 'react'
import type { RealFunction } from '@/lib/calculus'
import type { Vector2 } from '@/curriculum/math/shared/functions'

/** Every case misbehaves (or not) at x = 1. */
export const C = 1

export interface GalleryCase {
  id: string
  label: string
  tex: string
  /** The function's actual value everywhere, including at x = 1. */
  f: RealFunction
  pieces: { y: RealFunction; domain: Vector2 }[]
  dots: { at: Vector2; open: boolean }[]
  continuous: boolean
  differentiable: boolean
  /** One-sided limits of the difference quotient, as displayed. */
  left: string
  right: string
  why: ReactNode
}

const all: Vector2 = [-Infinity, Infinity]

export const cases: GalleryCase[] = [
  {
    id: 'smooth',
    label: 'Smooth',
    tex: String.raw`\tfrac12(x-1)^2 + \tfrac12(x-1) + 1`,
    f: (x) => 0.5 * (x - 1) ** 2 + 0.5 * (x - 1) + 1,
    pieces: [{ y: (x) => 0.5 * (x - 1) ** 2 + 0.5 * (x - 1) + 1, domain: all }],
    dots: [],
    continuous: true,
    differentiable: true,
    left: '0.5',
    right: '0.5',
    why: 'Zoom in and the graph becomes a straight line of slope 0.5. Both one-sided slopes agree.',
  },
  {
    id: 'corner',
    label: 'Corner',
    tex: '|x - 1| + 1',
    f: (x) => Math.abs(x - 1) + 1,
    pieces: [{ y: (x) => Math.abs(x - 1) + 1, domain: all }],
    dots: [],
    continuous: true,
    differentiable: false,
    left: '-1',
    right: '1',
    why: 'The left slope is −1 and the right slope is +1. Zooming never removes the corner, so there is no single tangent line.',
  },
  {
    id: 'cusp',
    label: 'Cusp',
    tex: '(x - 1)^{2/3} + 1',
    f: (x) => Math.cbrt((x - 1) ** 2) + 1,
    pieces: [{ y: (x) => Math.cbrt((x - 1) ** 2) + 1, domain: all }],
    dots: [],
    continuous: true,
    differentiable: false,
    left: '-∞',
    right: '+∞',
    why: 'The secant slopes blow up in opposite directions: the two sides meet in a sharp point (a cusp).',
  },
  {
    id: 'vertical',
    label: 'Vertical tangent',
    tex: String.raw`\sqrt[3]{x - 1} + 1`,
    f: (x) => Math.cbrt(x - 1) + 1,
    pieces: [{ y: (x) => Math.cbrt(x - 1) + 1, domain: all }],
    dots: [],
    continuous: true,
    differentiable: false,
    left: '+∞',
    right: '+∞',
    why: 'The curve is smooth, but its tangent line is vertical. A vertical line has no slope, so f′(1) does not exist.',
  },
  {
    id: 'jump',
    label: 'Jump',
    tex: String.raw`\begin{cases} x & x < 1 \\ x + 1.5 & x \ge 1 \end{cases}`,
    f: (x) => (x < 1 ? x : x + 1.5),
    pieces: [
      { y: (x) => x, domain: [-Infinity, 1] },
      { y: (x) => x + 1.5, domain: [1, Infinity] },
    ],
    dots: [
      { at: [1, 1], open: true },
      { at: [1, 2.5], open: false },
    ],
    continuous: false,
    differentiable: false,
    left: '+∞',
    right: '1',
    why: 'Not continuous, so not differentiable. Secants from the left must climb the jump, so their slopes explode.',
  },
  {
    id: 'hole',
    label: 'Misplaced point',
    tex: String.raw`\begin{cases} x + 0.5 & x \ne 1 \\ 2.5 & x = 1 \end{cases}`,
    f: (x) => (x === 1 ? 2.5 : x + 0.5),
    pieces: [{ y: (x) => x + 0.5, domain: all }],
    dots: [
      { at: [1, 1.5], open: true },
      { at: [1, 2.5], open: false },
    ],
    continuous: false,
    differentiable: false,
    left: '+∞',
    right: '-∞',
    why: 'Even though the graph looks like a line, f(1) is in the wrong place. Every secant through (1, 2.5) is steep, and the slopes blow up.',
  },
]
