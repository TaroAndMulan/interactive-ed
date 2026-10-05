/**
 * Minimal client for the FastAPI backend. In development Vite proxies /api to
 * localhost:8787; in production set VITE_API_URL if the API lives elsewhere.
 */
const API_BASE: string = import.meta.env.VITE_API_URL ?? ''

export class ApiError extends Error {
  /** HTTP status, or 0 when the server could not be reached. */
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }

  /** True when the server is down/unreachable rather than rejecting the request. */
  get unavailable(): boolean {
    return this.status === 0 || this.status >= 500
  }
}

export async function postJson<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new ApiError('Could not reach the server', 0)
  }

  if (!response.ok) {
    let detail = response.statusText
    try {
      const data = await response.json()
      if (typeof data.detail === 'string') detail = data.detail
    } catch {
      // Non-JSON error body (e.g. the dev proxy's "connection refused" page).
    }
    throw new ApiError(detail, response.status)
  }
  return (await response.json()) as T
}
