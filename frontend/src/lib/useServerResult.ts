import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ApiError } from './api'

export type ServerResult<T> =
  | { status: 'loading' }
  | { status: 'ready'; result: T }
  | { status: 'error'; message: string; offline: boolean }

/**
 * Runs `load()` whenever `key` changes. Results for an older key read as "loading",
 * so a slow response never shows up next to the wrong input.
 */
export function useServerResult<T>(key: string, load: (signal: AbortSignal) => Promise<T>): ServerResult<T> {
  const [response, setResponse] = useState<ServerResult<T> & { key: string }>()
  const loadRef = useRef(load)
  useLayoutEffect(() => {
    loadRef.current = load
  })

  useEffect(() => {
    const controller = new AbortController()
    loadRef
      .current(controller.signal)
      .then((result) => setResponse({ key, status: 'ready', result }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const offline = !(error instanceof ApiError) || error.unavailable
        const message = error instanceof Error ? error.message : String(error)
        setResponse({ key, status: 'error', offline, message })
      })
    return () => controller.abort()
  }, [key])

  return response?.key === key ? response : { status: 'loading' }
}
