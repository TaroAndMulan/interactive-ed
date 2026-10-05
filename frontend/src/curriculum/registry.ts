import { math } from './math'
import type { Course, Lesson, Subject, Unit } from './types'

/** Every subject on the site. Register new subjects here. */
export const subjects: Subject[] = [math]

export function findSubject(subjectSlug: string | undefined): Subject | undefined {
  return subjects.find((s) => s.slug === subjectSlug)
}

export function findCourse(
  subjectSlug: string | undefined,
  courseSlug: string | undefined,
): { subject: Subject; course: Course } | undefined {
  const subject = findSubject(subjectSlug)
  const course = subject?.courses.find((c) => c.slug === courseSlug)
  return subject && course ? { subject, course } : undefined
}

export interface LessonLocation {
  subject: Subject
  course: Course
  unit: Unit
  lesson: Lesson
  /** Neighbouring lessons in the course that are available (have a component). */
  previous?: Lesson
  next?: Lesson
}

export function findLesson(
  subjectSlug: string | undefined,
  courseSlug: string | undefined,
  lessonSlug: string | undefined,
): LessonLocation | undefined {
  const found = findCourse(subjectSlug, courseSlug)
  if (!found) return undefined

  const available = found.course.units.flatMap((unit) =>
    unit.lessons.filter((l) => l.component).map((lesson) => ({ unit, lesson })),
  )
  const index = available.findIndex(({ lesson }) => lesson.slug === lessonSlug)
  if (index === -1) return undefined

  return {
    ...found,
    ...available[index],
    previous: available[index - 1]?.lesson,
    next: available[index + 1]?.lesson,
  }
}

export function lessonPath(subject: Subject, course: Course, lesson: Lesson): string {
  return `/${subject.slug}/${course.slug}/${lesson.slug}`
}
