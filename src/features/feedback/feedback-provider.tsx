'use client'

import { Command, Crosshair, Send, Trash2, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import {
  createContext,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import { Button } from '@/components/ui/button'
import { type FeedbackComment, feedbackCommentSchema } from '@/domain/model'
import { useAuthentication } from '@/providers/authentication-provider'
import { submitFeedback } from '@/view-model/feedback-view-model'

import {
  createFeedbackId,
  describeElement,
  feedbackMarkdown,
  findFeedbackElement,
  selectorFor
} from './feedback-dom'

type ComposerState = {
  comment: FeedbackComment
  isNew: boolean
  left: number
  top: number
}

type FeedbackContextValue = {
  active: boolean
  toggle: () => void
}

const FeedbackContext = createContext<FeedbackContextValue | undefined>(
  undefined
)

export function useFeedback(): FeedbackContextValue {
  const context = useContext(FeedbackContext)
  if (!context) {
    throw new Error('useFeedback must be used within FeedbackProvider')
  }
  return context
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum))
}

function composerPosition(
  x: number,
  y: number
): Pick<ComposerState, 'left' | 'top'> {
  const gap = 12
  const margin = 12
  const width = Math.min(360, window.innerWidth - margin * 2)
  const height = Math.min(320, window.innerHeight - margin * 2)
  const right = x + gap
  const below = y + gap

  return {
    left: clamp(
      right + width <= window.innerWidth - margin ? right : x - width - gap,
      margin,
      window.innerWidth - width - margin
    ),
    top: clamp(
      below + height <= window.innerHeight - margin ? below : y - height - gap,
      margin,
      window.innerHeight - height - margin
    )
  }
}

function readDraft(storageKey: string): FeedbackComment[] {
  try {
    const value = localStorage.getItem(storageKey)
    if (!value) return []
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((item) => {
      const result = feedbackCommentSchema.safeParse(item)
      return result.success ? [result.data] : []
    })
  } catch {
    return []
  }
}

function FeedbackComposer({
  commentCount,
  state,
  onClose,
  onDeactivate,
  onDelete,
  onReview,
  onSave
}: {
  commentCount: number
  state: ComposerState
  onClose: () => void
  onDeactivate: () => void
  onDelete: () => void
  onReview: (text: string) => void
  onSave: (text: string) => void
}) {
  const [text, setText] = useState(state.comment.text)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const panelRef = useRef<HTMLElement>(null)
  const frameRef = useRef<number | undefined>(undefined)
  const previousUserSelectRef = useRef('')
  const dragRef = useRef<
    | {
        maxX: number
        maxY: number
        minX: number
        minY: number
        originX: number
        originY: number
        pointerId: number
        startX: number
        startY: number
        x: number
        y: number
      }
    | undefined
  >(undefined)

  const paintDrag = useCallback((x: number, y: number) => {
    const panel = panelRef.current
    if (!panel) return
    if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      panel.style.transform = `translate3d(${x}px, ${y}px, 0)`
      frameRef.current = undefined
    })
  }, [])

  const finishDrag = useCallback(() => {
    const drag = dragRef.current
    if (!drag) return
    dragRef.current = undefined
    if (frameRef.current !== undefined) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = undefined
    }
    setOffset({ x: drag.x, y: drag.y })
    setDragging(false)
    document.body.style.userSelect = previousUserSelectRef.current
  }, [])

  useEffect(
    () => () => {
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current)
      if (dragRef.current) {
        document.body.style.userSelect = previousUserSelectRef.current
      }
    },
    []
  )

  const startDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if ((event.target as Element).closest('button')) return
    const panel = panelRef.current
    if (!panel) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    const rect = panel.getBoundingClientRect()
    previousUserSelectRef.current = document.body.style.userSelect
    document.body.style.userSelect = 'none'
    dragRef.current = {
      maxX: window.innerWidth - rect.width - 12 - state.left,
      maxY: window.innerHeight - rect.height - 12 - state.top,
      minX: 12 - state.left,
      minY: 12 - state.top,
      originX: offset.x,
      originY: offset.y,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: offset.x,
      y: offset.y
    }
    setDragging(true)
  }

  const moveDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    drag.x = clamp(
      drag.originX + event.clientX - drag.startX,
      drag.minX,
      drag.maxX
    )
    drag.y = clamp(
      drag.originY + event.clientY - drag.startY,
      drag.minY,
      drag.maxY
    )
    paintDrag(drag.x, drag.y)
  }

  return (
    <section
      ref={panelRef}
      data-feedback-ui
      className="fixed z-[2147483000] w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-lg border bg-background shadow-2xl"
      style={{
        left: state.left,
        top: state.top,
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        willChange: dragging ? 'transform' : undefined
      }}
    >
      <header
        data-feedback-drag-handle
        data-dragging={dragging}
        title="Drag feedback window"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        className="flex touch-none select-none items-center justify-between border-b bg-muted/60 px-3 py-2"
      >
        <h2 className="text-sm font-semibold">Feedback</h2>
        <div className="flex items-center gap-2">
          <kbd className="flex items-center gap-0.5 rounded border border-muted-foreground/20 bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            <Command className="h-3 w-3" aria-hidden="true" />F
          </kbd>
          <button
            type="button"
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={onDeactivate}
            aria-label="Close feedback mode"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>
      <p className="truncate border-b bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground">
        {state.comment.label}
      </p>
      <div className="space-y-3 p-3">
        <textarea
          autoFocus
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="What should change here?"
          className="min-h-28 w-full resize-y rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="flex items-center justify-between gap-2">
          {!state.isNew ? (
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 /> Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!text.trim()}
              onClick={() => onSave(text.trim())}
            >
              Save
            </Button>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onReview(text.trim())}
        >
          <Send /> See/Send feedbacks (
          {commentCount + (state.isNew && text.trim() ? 1 : 0)})
        </Button>
      </div>
    </section>
  )
}

function FeedbackTarget({ comment }: { comment: FeedbackComment }) {
  const [position, setPosition] = useState<{ left: number; top: number }>()

  const refresh = useCallback(() => {
    const element = findFeedbackElement(comment.sel)
    if (!element) return setPosition(undefined)
    const rect = element.getBoundingClientRect()
    setPosition({
      left: rect.left + rect.width * comment.ox,
      top: rect.top + rect.height * comment.oy
    })
  }, [comment.ox, comment.oy, comment.sel])

  useLayoutEffect(refresh, [refresh])
  useEffect(() => {
    window.addEventListener('resize', refresh)
    window.addEventListener('scroll', refresh, true)
    return () => {
      window.removeEventListener('resize', refresh)
      window.removeEventListener('scroll', refresh, true)
    }
  }, [refresh])

  if (!position) return null

  return (
    <div
      data-feedback-ui
      data-feedback-target
      aria-hidden="true"
      className="pointer-events-none fixed z-[2147482500] -translate-x-1/2 -translate-y-1/2 text-accent drop-shadow-md"
      style={position}
    >
      <Crosshair className="h-8 w-8 stroke-[2.5]" />
    </div>
  )
}

function FeedbackPin({
  comment,
  index,
  onMove,
  onOpen
}: {
  comment: FeedbackComment
  index: number
  onMove: (ox: number, oy: number) => void
  onOpen: (left: number, top: number) => void
}) {
  const [position, setPosition] = useState<{ left: number; top: number }>()
  const drag = useRef<
    | {
        moved: boolean
        originLeft: number
        originTop: number
        startX: number
        startY: number
      }
    | undefined
  >(undefined)

  const refresh = useCallback(() => {
    const element = findFeedbackElement(comment.sel)
    if (!element) return setPosition(undefined)
    const rect = element.getBoundingClientRect()
    setPosition({
      left: rect.left + rect.width * comment.ox,
      top: rect.top + rect.height * comment.oy
    })
  }, [comment.ox, comment.oy, comment.sel])

  useLayoutEffect(refresh, [refresh])
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (!findFeedbackElement(comment.sel)) return
      refresh()
      observer.disconnect()
    })
    if (!findFeedbackElement(comment.sel)) {
      observer.observe(document.body, { childList: true, subtree: true })
    }
    window.addEventListener('resize', refresh)
    window.addEventListener('scroll', refresh, true)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', refresh)
      window.removeEventListener('scroll', refresh, true)
    }
  }, [comment.sel, refresh])

  const onMouseDown = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (!position) return
    drag.current = {
      moved: false,
      originLeft: position.left,
      originTop: position.top,
      startX: event.clientX,
      startY: event.clientY
    }

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!drag.current) return
      const dx = moveEvent.clientX - drag.current.startX
      const dy = moveEvent.clientY - drag.current.startY
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.current.moved = true
      setPosition({
        left: drag.current.originLeft + dx,
        top: drag.current.originTop + dy
      })
    }

    const onMouseUp = (upEvent: MouseEvent) => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      const currentDrag = drag.current
      drag.current = undefined
      if (!currentDrag) return

      if (!currentDrag.moved) {
        onOpen(upEvent.clientX, upEvent.clientY)
        return
      }

      const element = findFeedbackElement(comment.sel)
      if (!element) return
      const rect = element.getBoundingClientRect()
      onMove(
        clamp((upEvent.clientX - rect.left) / Math.max(rect.width, 1), 0, 1),
        clamp((upEvent.clientY - rect.top) / Math.max(rect.height, 1), 0, 1)
      )
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  if (!position) return null

  return (
    <button
      data-feedback-ui
      type="button"
      onMouseDown={onMouseDown}
      className="fixed z-[2147482000] flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-move items-center justify-center rounded-full border-2 border-white bg-accent text-xs font-bold text-accent-foreground shadow-lg"
      style={position}
      aria-label={`Edit feedback ${index + 1}`}
      title={comment.text}
    >
      {index + 1}
    </button>
  )
}

function FeedbackSubmissionPanel({
  comments,
  metadata,
  onClear,
  onClose,
  onSubmit
}: {
  comments: FeedbackComment[]
  metadata: Record<string, string>
  onClear: () => void
  onClose: () => void
  onSubmit: () => Promise<void>
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>()
  const [submitted, setSubmitted] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(
      feedbackMarkdown('CHORUS feedback', comments, metadata)
    )
  }

  const submit = async () => {
    setSubmitting(true)
    setError(undefined)
    try {
      await onSubmit()
      setSubmitted(true)
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Feedback could not be submitted.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      data-feedback-ui
      className="fixed inset-0 z-[2147483000] flex items-center justify-center bg-black/20 p-3"
    >
      <section className="flex max-h-[calc(100vh-24px)] w-[min(560px,calc(100vw-24px))] flex-col overflow-hidden rounded-lg border bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b bg-muted/60 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold">Send feedback</h2>
            <p className="text-xs text-muted-foreground">
              {comments.length} comments across{' '}
              {new Set(comments.map((comment) => comment.path)).size} pages
            </p>
          </div>
          <button
            type="button"
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={onClose}
            aria-label="Close feedback summary"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4">
          {submitted ? (
            <p className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">
              Feedback sent. Thank you.
            </p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Add feedback pins before sending.
            </p>
          ) : (
            comments.map((comment, index) => (
              <article
                key={comment.id}
                className="rounded-md border p-3 text-sm"
              >
                <p className="font-medium">
                  {index + 1}. {comment.label}
                </p>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground/70">
                  {comment.path ?? metadata.path}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                  {comment.text}
                </p>
              </article>
            ))
          )}
          {error && (
            <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t p-3">
          <Button
            variant="destructive"
            size="sm"
            disabled={comments.length === 0 || submitting}
            onClick={onClear}
          >
            Clear
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={comments.length === 0 || submitting}
              onClick={copy}
            >
              Copy
            </Button>
            <Button
              size="sm"
              disabled={comments.length === 0 || submitting || submitted}
              onClick={submit}
            >
              <Send /> {submitting ? 'Sending…' : 'Send'}
            </Button>
          </div>
        </footer>
      </section>
    </div>
  )
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthentication()
  const pathname = usePathname()
  const enabled = Boolean(user)
  const storageKey = user ? `chorus.feedback.draft.${user.id}` : undefined
  const [active, setActive] = useState(false)
  const [comments, setComments] = useState<FeedbackComment[]>([])
  const [composer, setComposer] = useState<ComposerState>()
  const [submissionOpen, setSubmissionOpen] = useState(false)
  const lastPointerPosition = useRef({ x: 396, y: 372 })

  useEffect(() => {
    setActive(false)
    setComposer(undefined)
    setSubmissionOpen(false)
    setComments(storageKey ? readDraft(storageKey) : [])
  }, [storageKey])

  useEffect(() => {
    if (!storageKey || !user) return
    const legacyKey = `chorus.feedback.draft.${user.id}.${encodeURIComponent(pathname)}`
    const legacyComments = readDraft(legacyKey).map((comment) => ({
      ...comment,
      path: comment.path ?? pathname
    }))
    if (legacyComments.length === 0) return

    const merged = [...readDraft(storageKey)]
    for (const comment of legacyComments) {
      if (!merged.some((item) => item.id === comment.id)) merged.push(comment)
    }
    localStorage.setItem(storageKey, JSON.stringify(merged))
    localStorage.removeItem(legacyKey)
    setComments(merged)
  }, [pathname, storageKey, user])

  const persist = useCallback(
    (nextComments: FeedbackComment[]) => {
      setComments(nextComments)
      if (!storageKey) return
      if (nextComments.length === 0) localStorage.removeItem(storageKey)
      else localStorage.setItem(storageKey, JSON.stringify(nextComments))
    },
    [storageKey]
  )

  const deactivate = useCallback(() => {
    setActive(false)
    setComposer(undefined)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const rememberPointer = (event: MouseEvent) => {
      if (!Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) {
        return
      }
      lastPointerPosition.current = { x: event.clientX, y: event.clientY }
    }
    document.addEventListener('mousemove', rememberPointer, { passive: true })
    return () => document.removeEventListener('mousemove', rememberPointer)
  }, [enabled])

  const openFeedback = useCallback(
    (anchorAtPointer = false) => {
      if (!enabled) return
      const cursor = lastPointerPosition.current
      const pointedElement = anchorAtPointer
        ? document.elementFromPoint?.(cursor.x, cursor.y)
        : null
      const pointedAnchor =
        pointedElement && !pointedElement.closest('[data-feedback-ui]')
          ? (pointedElement.closest('[data-feedback-anchor]') ?? pointedElement)
          : null
      const element =
        pointedAnchor ?? document.querySelector('main') ?? document.body
      const rect = element.getBoundingClientRect()
      setSubmissionOpen(false)
      setActive(true)
      setComposer({
        comment: {
          id: createFeedbackId(),
          path: pathname,
          sel: element === document.body ? 'body' : selectorFor(element),
          ox: pointedAnchor
            ? clamp((cursor.x - rect.left) / Math.max(rect.width, 1), 0, 1)
            : 0.5,
          oy: pointedAnchor
            ? clamp((cursor.y - rect.top) / Math.max(rect.height, 1), 0, 1)
            : 0.15,
          label: pointedAnchor ? describeElement(element) : 'Page feedback',
          text: ''
        },
        isNew: true,
        ...composerPosition(cursor.x, cursor.y)
      })
    },
    [enabled, pathname]
  )

  const toggle = useCallback(() => {
    if (!enabled) return
    if (active) deactivate()
    else openFeedback()
  }, [active, deactivate, enabled, openFeedback])

  useEffect(() => {
    if (!enabled) return
    const onShortcut = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== 'f' ||
        (!event.metaKey && !event.ctrlKey)
      ) {
        return
      }
      event.preventDefault()
      if (!event.repeat) {
        if (active) deactivate()
        else openFeedback(true)
      }
    }
    document.addEventListener('keydown', onShortcut)
    return () => document.removeEventListener('keydown', onShortcut)
  }, [active, deactivate, enabled, openFeedback])

  useEffect(() => {
    if (!active || !enabled) return
    document.body.dataset.feedbackMode = 'active'
    return () => {
      delete document.body.dataset.feedbackMode
    }
  }, [active, enabled])

  useEffect(() => {
    if (!active || !enabled) return

    const capture = (event: MouseEvent) => {
      const target = event.target
      if (
        !(target instanceof Element) ||
        target.closest('[data-feedback-ui]')
      ) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      const element = target.closest('[data-feedback-anchor]') ?? target
      const rect = element.getBoundingClientRect()
      const comment: FeedbackComment = {
        id: createFeedbackId(),
        path: pathname,
        sel: selectorFor(element),
        ox: clamp((event.clientX - rect.left) / Math.max(rect.width, 1), 0, 1),
        oy: clamp((event.clientY - rect.top) / Math.max(rect.height, 1), 0, 1),
        label: describeElement(element),
        text: ''
      }
      setComposer({
        comment,
        isNew: true,
        ...composerPosition(event.clientX, event.clientY)
      })
    }

    document.addEventListener('click', capture, true)
    return () => document.removeEventListener('click', capture, true)
  }, [active, enabled, pathname])

  useEffect(() => {
    if (!active) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') deactivate()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [active, deactivate])

  const context = useMemo<FeedbackContextValue>(
    () => ({
      active: enabled && active,
      toggle
    }),
    [active, enabled, toggle]
  )

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim() || user.username
    : ''

  const submit = async () => {
    if (!user || comments.length === 0) return
    const pages = [
      ...new Set(comments.map((comment) => comment.path ?? pathname))
    ]
    const result = await submitFeedback({
      source: {
        path: pages[0] ?? pathname,
        pages,
        title: document.title,
        workspaceId: user.workspaceId
      },
      reporter: { userId: user.id, displayName },
      comments
    })
    if (result.error) {
      throw new Error(
        result.error.message || 'Feedback could not be submitted.'
      )
    }
    persist([])
    deactivate()
  }

  const pageComments = comments.filter(
    (comment) => (comment.path ?? pathname) === pathname
  )

  return (
    <FeedbackContext.Provider value={context}>
      {children}
      <style data-feedback-ui>{`
        body[data-feedback-mode='active'],
        body[data-feedback-mode='active'] * {
          cursor: crosshair !important;
        }
        body[data-feedback-mode='active'] [data-feedback-ui],
        body[data-feedback-mode='active'] [data-feedback-ui] * {
          cursor: auto !important;
        }
        body [data-feedback-ui] [data-feedback-drag-handle],
        body [data-feedback-ui] [data-feedback-drag-handle] * {
          cursor: grab !important;
        }
        body [data-feedback-ui] [data-feedback-drag-handle][data-dragging='true'],
        body [data-feedback-ui] [data-feedback-drag-handle][data-dragging='true'] * {
          cursor: grabbing !important;
        }
      `}</style>
      {enabled && active && (
        <div
          data-feedback-ui
          className="pointer-events-none fixed inset-0 z-[2147481000] cursor-crosshair ring-2 ring-inset ring-accent/60"
        />
      )}
      {enabled &&
        pageComments.map((comment) => {
          const index = comments.findIndex((item) => item.id === comment.id)
          return (
            <FeedbackPin
              key={comment.id}
              comment={comment}
              index={index}
              onMove={(ox, oy) =>
                persist(
                  comments.map((item) =>
                    item.id === comment.id ? { ...item, ox, oy } : item
                  )
                )
              }
              onOpen={(left, top) => {
                setComposer({
                  comment,
                  isNew: false,
                  ...composerPosition(left, top)
                })
              }}
            />
          )
        })}
      {enabled && composer && (
        <>
          <FeedbackTarget comment={composer.comment} />
          <FeedbackComposer
            key={composer.comment.id}
            commentCount={comments.length}
            state={composer}
            onClose={() => setComposer(undefined)}
            onDeactivate={deactivate}
            onDelete={() => {
              persist(
                comments.filter((item) => item.id !== composer.comment.id)
              )
              setComposer(undefined)
            }}
            onReview={(text) => {
              let nextComments = comments
              if (text) {
                const saved = { ...composer.comment, text }
                nextComments = composer.isNew
                  ? [...comments, saved]
                  : comments.map((item) =>
                      item.id === saved.id ? saved : item
                    )
                persist(nextComments)
              }
              setActive(false)
              setComposer(undefined)
              setSubmissionOpen(true)
            }}
            onSave={(text) => {
              const saved = { ...composer.comment, text }
              persist(
                composer.isNew
                  ? [...comments, saved]
                  : comments.map((item) =>
                      item.id === saved.id ? saved : item
                    )
              )
              setComposer(undefined)
            }}
          />
        </>
      )}
      {enabled && submissionOpen && (
        <FeedbackSubmissionPanel
          comments={comments}
          metadata={{ reporter: displayName, path: pathname }}
          onClose={() => setSubmissionOpen(false)}
          onClear={() => {
            if (
              !window.confirm(
                'Clear all feedback comments? This action cannot be undone.'
              )
            ) {
              return
            }
            persist([])
            setActive(false)
          }}
          onSubmit={submit}
        />
      )}
    </FeedbackContext.Provider>
  )
}
