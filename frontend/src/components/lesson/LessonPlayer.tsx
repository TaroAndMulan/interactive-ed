import { type ReactNode, type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Button } from '@/components/ui/Button'
import { usePersistentState } from '@/lib/hooks'

export interface LessonStep {
  id: string
  title: string
  content: ReactNode
  /** Facilitation tips shown only when "Teacher notes" is switched on. */
  teacherNotes?: ReactNode
}

/**
 * Runs a lesson as a sequence of steps, built for teaching in front of a class:
 * - the current step lives in the URL (?step=3) so it survives refreshes and can be shared
 * - ←/→ and PageUp/PageDown (presentation clickers) move between steps
 * - "Present" makes the lesson fill the screen for a projector
 */
export function LessonPlayer({ steps }: { steps: LessonStep[] }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = Number.parseInt(searchParams.get('step') ?? '1', 10) - 1
  const index = Number.isNaN(requested) ? 0 : Math.min(Math.max(requested, 0), steps.length - 1)
  const step = steps[index]

  const [showNotes, setShowNotes] = usePersistentState('lesson:teacherNotes', false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isFullscreen = useIsFullscreen(containerRef)

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next >= steps.length) return
      setSearchParams(
        (params) => {
          params.set('step', String(next + 1))
          return params
        },
        { replace: true },
      )
      const container = containerRef.current
      if (!container) return
      if (document.fullscreenElement === container) container.scrollTo({ top: 0 })
      else if (container.getBoundingClientRect().top < 0) container.scrollIntoView({ behavior: 'smooth' })
    },
    [setSearchParams, steps.length],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
      const target = event.target as HTMLElement
      const typing = target.closest('input:not([type=range]), textarea, select, [contenteditable]')
      // Arrow keys also drive sliders and draggable graph points, so leave those alone.
      const arrowsTaken = typing || target.closest('input, .MafsView, [role=radiogroup]')

      let delta = 0
      if (event.key === 'PageDown' && !typing) delta = 1
      else if (event.key === 'PageUp' && !typing) delta = -1
      else if (event.key === 'ArrowRight' && !arrowsTaken) delta = 1
      else if (event.key === 'ArrowLeft' && !arrowsTaken) delta = -1
      if (delta === 0) return

      event.preventDefault()
      goTo(index + delta)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goTo, index])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void containerRef.current?.requestFullscreen()
  }

  return (
    <div ref={containerRef} className="lesson-player scroll-mt-4">
      <div className="flex flex-wrap items-start justify-between gap-3 lg:flex-nowrap">
        <ol className="flex flex-wrap gap-1">
          {steps.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === index ? 'step' : undefined}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-sm transition ${
                  i === index
                    ? 'bg-slate-900 text-white'
                    : i < index
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-900'
                }`}
              >
                {i + 1}. {s.title}
              </button>
            </li>
          ))}
        </ol>
        <div className="flex shrink-0 flex-wrap justify-end gap-1">
          <Button variant="ghost" onClick={() => setShowNotes(!showNotes)} aria-pressed={showNotes}>
            {showNotes ? 'Hide' : 'Show'} teacher notes
          </Button>
          <Button variant="ghost" onClick={toggleFullscreen}>
            {isFullscreen ? 'Exit presentation' : 'Present'}
          </Button>
        </div>
      </div>

      <section className="mt-6" aria-labelledby={`step-${step.id}`}>
        <h2 id={`step-${step.id}`} className="text-2xl font-semibold text-slate-900">
          <span className="text-slate-400">{index + 1}.</span> {step.title}
        </h2>
        <div className="mt-4 space-y-6">{step.content}</div>
      </section>

      {showNotes && step.teacherNotes && (
        <aside className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-950">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Teacher notes</p>
          <div className="mt-2 space-y-2 leading-relaxed">{step.teacherNotes}</div>
        </aside>
      )}

      <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-4">
        <Button onClick={() => goTo(index - 1)} disabled={index === 0}>
          ← Previous
        </Button>
        <span className="text-sm text-slate-500">
          Step {index + 1} of {steps.length}
        </span>
        <Button variant="primary" onClick={() => goTo(index + 1)} disabled={index === steps.length - 1}>
          Next →
        </Button>
      </div>
    </div>
  )
}

function useIsFullscreen(ref: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === ref.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [ref])
  return isFullscreen
}
