import { Suspense } from 'react'
import { Link, useParams } from 'react-router'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { findLesson, lessonPath } from '@/curriculum/registry'
import { NotFoundPage } from './NotFoundPage'

export function LessonPage() {
  const { subjectSlug, courseSlug, lessonSlug } = useParams()
  const location = findLesson(subjectSlug, courseSlug, lessonSlug)
  if (!location?.lesson.component) return <NotFoundPage />

  const { subject, course, unit, lesson, previous, next } = location
  const LessonContent = lesson.component!

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label: subject.title, to: `/${subject.slug}` },
          { label: course.title, to: `/${subject.slug}/${course.slug}` },
          { label: unit.number !== undefined ? `Unit ${unit.number}` : unit.title },
        ]}
      />
      <header className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>
        <span className="text-sm text-slate-500">
          {[lesson.standard, lesson.durationMinutes && `~${lesson.durationMinutes} min`]
            .filter(Boolean)
            .join(' · ')}
        </span>
      </header>

      <div className="mt-6">
        <Suspense fallback={<p className="py-20 text-center text-slate-400">Loading lesson…</p>}>
          <LessonContent key={lesson.slug} />
        </Suspense>
      </div>

      {(previous || next) && (
        <nav className="mt-12 flex justify-between border-t border-slate-200 pt-6 text-sm">
          {previous ? (
            <Link to={lessonPath(subject, course, previous)} className="text-blue-700 hover:underline">
              ← {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={lessonPath(subject, course, next)} className="text-blue-700 hover:underline">
              {next.title} →
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
