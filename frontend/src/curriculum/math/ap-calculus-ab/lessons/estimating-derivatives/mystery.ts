import type { MathFunction } from '@/curriculum/math/shared/functions'

/** A smooth curve whose formula students never see: they must estimate slopes from the picture or table. */
export const mystery: MathFunction = {
  id: 'mystery',
  tex: '?',
  expression: '0.05x^3 - 0.6x^2 + 1.8x + 1',
  f: (x) => 0.05 * x ** 3 - 0.6 * x ** 2 + 1.8 * x + 1,
  df: (x) => 0.15 * x ** 2 - 1.2 * x + 1.8,
  viewBox: { x: [0, 8], y: [0, 4] },
  defaultA: 1,
}
