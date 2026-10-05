import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/** useState that survives page reloads (per browser). Falls back to memory if storage is blocked. */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Private mode / storage disabled: keep the in-memory value only.
    }
  }, [key, value])

  return [value, setValue] as const
}

/** Calls `onFrame(secondsSinceLastFrame)` on every animation frame while `running` is true. */
export function useAnimationFrame(onFrame: (dt: number) => void, running: boolean) {
  const callback = useRef(onFrame)
  useLayoutEffect(() => {
    callback.current = onFrame
  })

  useEffect(() => {
    if (!running) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      callback.current(Math.min((now - last) / 1000, 0.1))
      last = now
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [running])
}
