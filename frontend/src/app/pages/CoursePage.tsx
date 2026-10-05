import { Link, useParams } from 'react-router'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { findCourse, lessonPath } from '@/curriculum/registry'
import { NotFoundPage } from './NotFoundPage'

export function CoursePage() {
  const { subjectSlug, courseSlug } = useParams()
  const found = findCourse(subjectSlug, courseSlug)
  if (!found) return <NotFoundPage />
  const { subject, course } = found

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: subject.title, to: `/${subject.slug}` },
          { label: course.title },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold text-slate-900">{course.title}</h1>
      <p className="mt-2 text-lg text-slate-600">{course.description}</p>

      <ol className="mt-8 space-y-4">
        {course.units.map((unit) => (
          <li key={unit.slug} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">
              {unit.number !== undefined && <span className="text-slate-400">Unit {unit.number} · </span>}
              {unit.title}
            </h2>
            {unit.lessons.length === 0 ? (
              <p className="mt-2 text-sm text-slate-400">Lessons coming soon</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100">
                {unit.lessons.map((lesson) => {
                  const meta = (
                    <>
                      {lesson.standard && (
                        <span className="w-16 shrink-0 font-mono text-xs text-slate-400">{lesson.standard}</span>
                      )}
                      <span className="flex-1">
                        <span className="block font-medium">{lesson.title}</span>
                        <span className="block text-sm text-slate-500">{lesson.summary}</span>
                      </span>
                    </>
                  )
                  return (
                    <li key={lesson.slug}>
                      {lesson.component ? (
                        <Link
                          to={lessonPath(subject, course, lesson)}
                          className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 text-slate-900 hover:bg-slate-50"
                        >
                          {meta}
                          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                            Open
                          </span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 py-3 text-slate-400">
                          {meta}
                          <span className="text-xs">Coming soon</span>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
