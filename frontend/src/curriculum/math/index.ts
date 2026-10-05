import type { Subject } from '../types'
import { apCalculusAB } from './ap-calculus-ab'

export const math: Subject = {
  slug: 'math',
  title: 'Mathematics',
  description: 'See the ideas move: drag, zoom, and experiment with functions, graphs, and limits.',
  glyph: '∫',
  courses: [apCalculusAB],
}
