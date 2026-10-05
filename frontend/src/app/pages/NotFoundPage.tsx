import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-mono text-sm text-slate-400">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">We couldn&rsquo;t find that page.</h1>
      <Link to="/" className="mt-6 inline-block text-blue-700 hover:underline">
        Back to all subjects
      </Link>
    </div>
  )
}
