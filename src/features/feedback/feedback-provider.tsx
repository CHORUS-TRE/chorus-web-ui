'use client'

import {
  Camera,
  Command,
  Loader2,
  MousePointer2,
  Pencil,
  Send,
  Trash2,
  X
} from 'lucide-react'
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
import { createPortal } from 'react-dom'

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

type PickerTarget = {
  label: string
  rect: DOMRect
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
  onReview: (text: string, screenshot?: string) => void
  onSave: (text: string, screenshot?: string) => void
}) {
  const [text, setText] = useState(state.comment.text)
  const [screenshot, setScreenshot] = useState(state.comment.screenshot)
  const [captureOpen, setCaptureOpen] = useState(false)
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
      className="fixed z-[2147483000] w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-lg border border-amber-400 bg-background shadow-2xl"
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
        className="flex touch-none select-none items-center justify-between border-b border-amber-400/50 bg-amber-400/10 px-3 py-2"
      >
        <h2 className="text-sm font-semibold">Feedback</h2>
        <div className="flex items-center gap-2">
          <kbd className="flex items-center gap-0.5 rounded border border-muted-foreground/20 bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            <Command className="h-3 w-3" aria-hidden="true" />K
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
        <div className="rounded-md border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs text-muted-foreground">
          Write a comment for the selected area, then save it. You can select
          more areas and review all saved comments before sending them together.
        </div>
        <textarea
          autoFocus
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="What should change here?"
          className="min-h-28 w-full resize-y rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        {screenshot && (
          <div className="relative overflow-hidden rounded-md border border-amber-400/50 bg-muted/20 p-1">
            {/* A captured data URL is intentionally rendered with a regular img. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshot}
              alt="Selected screenshot area"
              className="max-h-40 w-full rounded object-contain"
            />
            <button
              type="button"
              onClick={() => setScreenshot(undefined)}
              className="absolute right-2 top-2 rounded-full bg-background/90 p-1 text-muted-foreground shadow hover:text-foreground"
              aria-label="Remove screenshot"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full border-amber-400/50"
          onClick={() => setCaptureOpen(true)}
        >
          <Camera /> {screenshot ? 'Replace screenshot area' : 'Capture area'}
        </Button>
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
              onClick={() => onSave(text.trim(), screenshot)}
            >
              Save
            </Button>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onReview(text.trim(), screenshot)}
        >
          <Send /> Review comments (
          {commentCount + (state.isNew && text.trim() ? 1 : 0)})
        </Button>
      </div>
      {captureOpen &&
        createPortal(
          <ZoneScreenshotCapture
            onCancel={() => setCaptureOpen(false)}
            onCapture={(image) => {
              setScreenshot(image)
              setCaptureOpen(false)
            }}
          />,
          document.body
        )}
    </section>
  )
}

function ZoneScreenshotCapture({
  onCancel,
  onCapture
}: {
  onCancel: () => void
  onCapture: (image: string) => void
}) {
  const [stream, setStream] = useState<MediaStream>()
  const [error, setError] = useState<string>()
  const [start, setStart] = useState<{ x: number; y: number }>()
  const [end, setEnd] = useState<{ x: number; y: number }>()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    let mounted = true
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setError('Screen capture is unavailable in this browser.')
      return () => {
        mounted = false
      }
    }
    const captureOptions = {
      video: true,
      audio: false,
      preferCurrentTab: true,
      selfBrowserSurface: 'include',
      surfaceSwitching: 'exclude'
    } as DisplayMediaStreamOptions
    void navigator.mediaDevices
      .getDisplayMedia(captureOptions)
      .then(async (nextStream) => {
        if (!mounted) {
          nextStream.getTracks().forEach((track) => track.stop())
          return
        }
        const video = document.createElement('video')
        video.srcObject = nextStream
        video.muted = true
        await video.play()
        videoRef.current = video
        streamRef.current = nextStream
        setStream(nextStream)
      })
      .catch((captureError: unknown) => {
        setError(
          captureError instanceof DOMException &&
            captureError.name === 'NotAllowedError'
            ? 'Screen capture was cancelled.'
            : 'Screen capture is unavailable in this browser.'
        )
      })

    return () => {
      mounted = false
      videoRef.current?.pause()
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const stop = useCallback(() => {
    stream?.getTracks().forEach((track) => track.stop())
  }, [stream])

  const finish = async (
    point: { x: number; y: number },
    overlay: HTMLDivElement
  ) => {
    if (!start || !videoRef.current) return
    const video = videoRef.current
    const left = Math.min(start.x, point.x)
    const top = Math.min(start.y, point.y)
    const width = Math.abs(point.x - start.x)
    const height = Math.abs(point.y - start.y)
    if (width < 8 || height < 8) {
      setStart(undefined)
      setEnd(undefined)
      return
    }
    overlay.style.visibility = 'hidden'
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    )
    await new Promise<void>((resolve) => setTimeout(resolve, 80))
    const scaleX = video.videoWidth / window.innerWidth
    const scaleY = video.videoHeight / window.innerHeight
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(width * scaleX)
    canvas.height = Math.round(height * scaleY)
    const context = canvas.getContext('2d')
    if (!context) return
    context.drawImage(
      video,
      Math.round(left * scaleX),
      Math.round(top * scaleY),
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height
    )
    stop()
    onCapture(canvas.toDataURL('image/png'))
  }

  const selection =
    start && end
      ? {
          height: Math.abs(end.y - start.y),
          left: Math.min(start.x, end.x),
          top: Math.min(start.y, end.y),
          width: Math.abs(end.x - start.x)
        }
      : undefined

  return (
    <div
      data-feedback-ui
      className={`fixed inset-0 z-[2147483600] cursor-crosshair ${selection ? 'bg-transparent' : 'bg-black/15'}`}
      onPointerDown={(event) => {
        if (!stream) return
        event.currentTarget.setPointerCapture(event.pointerId)
        const point = { x: event.clientX, y: event.clientY }
        setStart(point)
        setEnd(point)
      }}
      onPointerMove={(event) => {
        if (start) setEnd({ x: event.clientX, y: event.clientY })
      }}
      onPointerUp={(event) => {
        void finish({ x: event.clientX, y: event.clientY }, event.currentTarget)
      }}
    >
      <div className="pointer-events-none absolute left-1/2 top-4 z-10 w-[min(480px,calc(100vw-120px))] -translate-x-1/2 rounded-lg border-2 border-amber-400 bg-background px-4 py-3 text-center text-sm shadow-xl">
        {error ? (
          <span className="text-destructive">{error}</span>
        ) : stream ? (
          <div>
            <p className="font-semibold text-foreground">
              2. Drag around the area you want to capture
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Hold the mouse button, draw a rectangle, then release to capture.
            </p>
          </div>
        ) : (
          <div>
            <p className="flex items-center justify-center gap-2 font-semibold text-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> 1. Choose “This Tab”
              in the browser dialog
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              The current CHORUS tab is preferred. Browsers require you to
              confirm the choice for privacy.
            </p>
          </div>
        )}
      </div>
      {selection && (
        <div
          className="pointer-events-none fixed border-2 border-dashed border-amber-400 bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.38)]"
          style={selection}
        >
          <span className="absolute bottom-2 right-2 rounded bg-amber-400 px-2 py-1 text-[11px] font-semibold text-amber-950 shadow">
            {Math.round(selection.width)} × {Math.round(selection.height)} ·
            release to capture
          </span>
        </div>
      )}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="absolute right-4 top-4 cursor-pointer"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => {
          stop()
          onCancel()
        }}
      >
        Cancel
      </Button>
    </div>
  )
}

function FeedbackTarget({ comment }: { comment: FeedbackComment }) {
  const [rect, setRect] = useState<DOMRect>()

  const refresh = useCallback(() => {
    const element = findFeedbackElement(comment.sel)
    if (!element) return setRect(undefined)
    setRect(element.getBoundingClientRect())
  }, [comment.sel])

  useLayoutEffect(refresh, [refresh])
  useEffect(() => {
    window.addEventListener('resize', refresh)
    window.addEventListener('scroll', refresh, true)
    return () => {
      window.removeEventListener('resize', refresh)
      window.removeEventListener('scroll', refresh, true)
    }
  }, [refresh])

  if (!rect) return null

  return (
    <>
      <div
        data-feedback-ui
        data-feedback-target
        aria-hidden="true"
        className="pointer-events-none fixed z-[2147482400] rounded-[3px] border-2 border-dashed border-amber-400 bg-amber-400/5 shadow-[0_0_0_1px_rgba(0,0,0,0.18)]"
        style={{
          height: rect.height,
          left: rect.left,
          top: rect.top,
          width: rect.width
        }}
      />
      <div
        data-feedback-ui
        aria-hidden="true"
        className="pointer-events-none fixed z-[2147482500] h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-amber-400 bg-background shadow-lg"
        style={{
          left: rect.left + rect.width * comment.ox,
          top: rect.top + rect.height * comment.oy
        }}
      />
    </>
  )
}

function FeedbackPickerOverlay({ target }: { target?: PickerTarget }) {
  if (!target) return null

  const labelTop = Math.max(8, target.rect.top - 11)
  return (
    <>
      <div
        data-feedback-ui
        data-feedback-picker-target
        aria-hidden="true"
        className="pointer-events-none fixed z-[2147481500] rounded-[3px] border-2 border-dashed border-amber-400 bg-amber-400/5 shadow-[0_0_0_1px_rgba(0,0,0,0.18)]"
        style={{
          height: target.rect.height,
          left: target.rect.left,
          top: target.rect.top,
          width: target.rect.width
        }}
      />
      <div
        data-feedback-ui
        aria-hidden="true"
        className="pointer-events-none fixed z-[2147481600] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-semibold text-amber-950 shadow-md"
        style={{
          left: target.rect.left + target.rect.width / 2,
          top: labelTop
        }}
      >
        <span className="flex max-w-56 items-center gap-1 truncate">
          <MousePointer2 className="h-3 w-3 shrink-0" />
          {target.label}
        </span>
      </div>
    </>
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
      className="fixed z-[2147482000] flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-move items-center justify-center rounded-full border-[3px] border-amber-400 bg-background text-xs font-bold text-amber-600 shadow-lg"
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
  onDeleteComment,
  onUpdateComment,
  onSubmit
}: {
  comments: FeedbackComment[]
  metadata: Record<string, string>
  onClear: () => void
  onClose: () => void
  onDeleteComment: (id: string) => void
  onUpdateComment: (id: string, text: string) => void
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
      <section className="flex max-h-[calc(100vh-24px)] w-[min(560px,calc(100vw-24px))] flex-col overflow-hidden rounded-lg border border-amber-400 bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b border-amber-400/50 bg-amber-400/10 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold">Send feedback</h2>
            <p className="text-xs text-muted-foreground">
              {comments.length} comments across{' '}
              {new Set(comments.map((comment) => comment.path)).size} pages
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your saved comments are sent together in one batch.
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
              <FeedbackSubmissionComment
                key={comment.id}
                comment={comment}
                index={index}
                path={comment.path ?? metadata.path}
                onDelete={() => onDeleteComment(comment.id)}
                onUpdate={(text) => onUpdateComment(comment.id, text)}
              />
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
              variant="ghost"
              size="sm"
              disabled={submitting}
              onClick={onClose}
            >
              Later
            </Button>
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

function FeedbackSubmissionComment({
  comment,
  index,
  path,
  onDelete,
  onUpdate
}: {
  comment: FeedbackComment
  index: number
  path: string
  onDelete: () => void
  onUpdate: (text: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(comment.text)

  return (
    <article className="rounded-md border p-3 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium">
            {index + 1}. {comment.label}
          </p>
          <p className="mt-1 font-mono text-[10px] text-muted-foreground/70">
            {path}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setEditing(true)}
            aria-label={`Edit comment ${index + 1}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive"
            onClick={onDelete}
            aria-label={`Delete comment ${index + 1}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      {editing ? (
        <div className="mt-3 space-y-2">
          <textarea
            autoFocus
            value={text}
            onChange={(event) => setText(event.target.value)}
            aria-label={`Comment ${index + 1}`}
            className="min-h-24 w-full resize-y rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setText(comment.text)
                setEditing(false)
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!text.trim()}
              onClick={() => {
                onUpdate(text.trim())
                setEditing(false)
              }}
            >
              Save changes
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
            {comment.text}
          </p>
          {comment.screenshot && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={comment.screenshot}
              alt={`Screenshot for comment ${index + 1}`}
              className="mt-3 max-h-48 w-full rounded-md border border-amber-400/40 object-contain"
            />
          )}
        </>
      )}
    </article>
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
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>()
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
    setPickerTarget(undefined)
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
      setSubmissionOpen(false)
      setActive(true)
      setComposer(undefined)
      if (pointedAnchor) {
        setPickerTarget({
          label: describeElement(pointedAnchor),
          rect: pointedAnchor.getBoundingClientRect()
        })
      }
    },
    [enabled]
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
        event.key.toLowerCase() !== 'k' ||
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

    const hover = (event: MouseEvent) => {
      const target = event.target
      if (
        !(target instanceof Element) ||
        target.closest('[data-feedback-ui]')
      ) {
        return
      }
      const element = target.closest('[data-feedback-anchor]') ?? target
      setPickerTarget({
        label: describeElement(element),
        rect: element.getBoundingClientRect()
      })
    }

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
      setPickerTarget(undefined)
    }

    document.addEventListener('mousemove', hover, true)
    document.addEventListener('click', capture, true)
    return () => {
      document.removeEventListener('mousemove', hover, true)
      document.removeEventListener('click', capture, true)
    }
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
          className="pointer-events-none fixed inset-0 z-[2147481000] cursor-crosshair ring-2 ring-inset ring-amber-400/70"
        />
      )}
      {enabled && active && !composer && (
        <FeedbackPickerOverlay target={pickerTarget} />
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
            onClose={deactivate}
            onDeactivate={deactivate}
            onDelete={() => {
              persist(
                comments.filter((item) => item.id !== composer.comment.id)
              )
              deactivate()
            }}
            onReview={(text, screenshot) => {
              let nextComments = comments
              if (text) {
                const saved = { ...composer.comment, text, screenshot }
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
            onSave={(text, screenshot) => {
              const saved = { ...composer.comment, text, screenshot }
              persist(
                composer.isNew
                  ? [...comments, saved]
                  : comments.map((item) =>
                      item.id === saved.id ? saved : item
                    )
              )
              deactivate()
            }}
          />
        </>
      )}
      {enabled && submissionOpen && (
        <FeedbackSubmissionPanel
          comments={comments}
          metadata={{ reporter: displayName, path: pathname }}
          onClose={() => setSubmissionOpen(false)}
          onDeleteComment={(id) =>
            persist(comments.filter((comment) => comment.id !== id))
          }
          onUpdateComment={(id, text) =>
            persist(
              comments.map((comment) =>
                comment.id === id ? { ...comment, text } : comment
              )
            )
          }
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
