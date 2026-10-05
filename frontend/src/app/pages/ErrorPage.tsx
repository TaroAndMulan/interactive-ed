import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

export function ErrorPage() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unknown error'

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Something went wrong.</h1>
      <p className="mt-3 font-mono text-sm text-slate-500">{message}</p>
      <Link to="/" className="mt-6 inline-block text-blue-700 hover:underline">
        Back to all subjects
      </Link>
    </div>
  )
}
