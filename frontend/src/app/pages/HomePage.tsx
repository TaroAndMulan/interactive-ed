import { Link } from 'react-router'
import { subjects } from '@/curriculum/registry'

export function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Learn by moving the math.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        Interactive lessons built for the classroom. Project them, drag the graphs, ask
        &ldquo;what happens if…?&rdquo;, and let students find the idea themselves.
      </p>

      <h2 className="mt-12 text-sm font-semibold uppercase tracking-wider text-slate-500">
        Subjects
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {subjects.map((subject) => (
          <Link
            key={subject.slug}
            to={`/${subject.slug}`}
            className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-2xl text-white">
              {subject.glyph}
            </span>
            <span>
              <span className="block text-lg font-semibold text-slate-900 group-hover:underline">
                {subject.title}
              </span>
              <span className="mt-1 block text-slate-600">{subject.description}</span>
              <span className="mt-3 block text-sm text-slate-500">
                {subject.courses.map((c) => c.title).join(' · ')}
              </span>
            </span>
          </Link>
        ))}
        <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 text-slate-400">
          More subjects coming soon
        </div>
      </div>
    </div>
  )
}
