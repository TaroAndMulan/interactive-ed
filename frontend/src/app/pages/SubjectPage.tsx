import { Link, useParams } from 'react-router'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { findSubject } from '@/curriculum/registry'
import { NotFoundPage } from './NotFoundPage'

export function SubjectPage() {
  const { subjectSlug } = useParams()
  const subject = findSubject(subjectSlug)
  if (!subject) return <NotFoundPage />

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: subject.title }]} />
      <h1 className="mt-4 text-3xl font-bold text-slate-900">{subject.title}</h1>
      <p className="mt-2 text-lg text-slate-600">{subject.description}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {subject.courses.map((course) => {
          const lessons = course.units.flatMap((u) => u.lessons)
          const ready = lessons.filter((l) => l.component).length
          return (
            <Link
              key={course.slug}
              to={`/${subject.slug}/${course.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                {course.level && (
                  <span className="rounded-md bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
                    {course.level}
                  </span>
                )}
                <h2 className="text-lg font-semibold text-slate-900 group-hover:underline">
                  {course.title}
                </h2>
              </div>
              <p className="mt-2 text-slate-600">{course.description}</p>
              <p className="mt-4 text-sm text-slate-500">
                {course.units.length} units · {ready} interactive {ready === 1 ? 'lesson' : 'lessons'}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
