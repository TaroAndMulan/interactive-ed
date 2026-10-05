import type { ComponentType, LazyExoticComponent } from 'react'

/**
 * The curriculum is a tree:  Subject → Course → Unit → Lesson.
 *
 * Adding a new subject or course never touches the app shell: create a folder
 * under src/curriculum/, describe it with these types, and register the
 * subject in src/curriculum/registry.ts.
 */

export interface Lesson {
  /** URL segment, unique within its course. */
  slug: string
  title: string
  summary: string
  /** Reference to an external framework, e.g. an AP CED topic ("2.1"). */
  standard?: string
  durationMinutes?: number
  /**
   * Lazily loaded so each lesson ships in its own bundle chunk.
   * Leave undefined for planned lessons; they are listed as "coming soon".
   */
  component?: LazyExoticComponent<ComponentType>
}

export interface Unit {
  slug: string
  number?: number
  title: string
  lessons: Lesson[]
}

export interface Course {
  slug: string
  title: string
  description: string
  /** Short label such as "AP" or "Grade 9". */
  level?: string
  units: Unit[]
}

export interface Subject {
  slug: string
  title: string
  description: string
  /** One or two characters shown on the subject card, e.g. "∫". */
  glyph: string
  courses: Course[]
}
