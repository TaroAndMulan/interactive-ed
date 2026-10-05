import type { ServerResult } from '@/lib/useServerResult'

/** Loading / offline / error text for panels that depend on the API server. */
export function ServerMessage({ state }: { state: ServerResult<unknown> }) {
  if (state.status === 'loading') return <p className="mt-4 text-slate-400">Working it out…</p>
  if (state.status === 'ready') return null
  return (
    <p className="mt-4 text-sm text-slate-600">
      {state.offline ? (
        <>
          The math server isn&rsquo;t running. Start it with{' '}
          <code className="rounded bg-slate-100 px-1">npm run dev</code> from the project root to see this.
        </>
      ) : (
        state.message
      )}
    </p>
  )
}
