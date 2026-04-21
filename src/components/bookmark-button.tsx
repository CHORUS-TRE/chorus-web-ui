'use client'

import { Bookmark, BookmarkCheck, Pencil } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import { toast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { BOOKMARK_LABEL_MAX, normalizeRoute } from '@/domain/model/bookmark'
import { useBookmarks } from '@/hooks/use-bookmarks'
import {
  type DeriveBookmarkContext,
  deriveBookmarkLabel
} from '@/lib/derive-bookmark-label'
import { cn } from '@/lib/utils'
import { useAppState } from '@/stores/app-state-store'

interface BookmarkButtonProps {
  className?: string
}

export function BookmarkButton({ className }: BookmarkButtonProps) {
  const pathname = usePathname() || '/'
  const route = useMemo(() => normalizeRoute(pathname), [pathname])
  const params = useParams<{ workspaceId?: string; sessionId?: string }>()
  const { workspaces, workbenches } = useAppState()

  const context = useMemo<DeriveBookmarkContext>(() => {
    const ctx: DeriveBookmarkContext = {}
    if (params?.workspaceId) {
      const ws = workspaces?.find((w) => w.id === params.workspaceId)
      if (ws?.name) ctx.workspaceName = ws.name
    }
    if (params?.sessionId) {
      const wb = workbenches?.find((w) => w.id === params.sessionId)
      if (wb?.name) ctx.sessionName = wb.name
    }
    return ctx
  }, [params?.workspaceId, params?.sessionId, workspaces, workbenches])

  const { isBookmarked, getBookmark, toggleBookmark, updateLabel } =
    useBookmarks()

  const bookmarked = isBookmarked(route)
  const current = getBookmark(route)

  const handleToggle = useCallback(async () => {
    const derived = deriveBookmarkLabel(route, context)
    const result = await toggleBookmark(route, derived.label, derived.icon)
    if (!result) return
    toast({
      title: result.added ? `Bookmarked: ${result.label}` : 'Bookmark removed'
    })
  }, [route, context, toggleBookmark])

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this page'}
            aria-pressed={bookmarked}
            className="h-8 w-8"
          >
            {bookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-accent" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {bookmarked ? 'Remove bookmark' : 'Bookmark this page'}
        </TooltipContent>
      </Tooltip>

      {bookmarked && current && (
        <BookmarkRenamePopover
          route={route}
          currentLabel={current.label}
          onRename={updateLabel}
        />
      )}
    </div>
  )
}

interface BookmarkRenamePopoverProps {
  route: string
  currentLabel: string
  onRename: (route: string, label: string) => Promise<boolean>
}

function BookmarkRenamePopover({
  route,
  currentLabel,
  onRename
}: BookmarkRenamePopoverProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(currentLabel)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setValue(currentLabel)
  }, [open, currentLabel])

  useEffect(() => {
    if (open) {
      // Focus + select on open
      requestAnimationFrame(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      })
    }
  }, [open])

  const commit = useCallback(async () => {
    const trimmed = value.trim()
    if (trimmed === currentLabel) {
      setOpen(false)
      return
    }
    const ok = await onRename(route, trimmed)
    if (ok) setOpen(false)
  }, [value, currentLabel, route, onRename])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      commit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Rename bookmark"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Rename bookmark</TooltipContent>
      </Tooltip>
      <PopoverContent
        className="w-64 p-2"
        align="end"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <Input
          ref={inputRef}
          value={value}
          maxLength={BOOKMARK_LABEL_MAX}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          aria-label="Bookmark label"
        />
      </PopoverContent>
    </Popover>
  )
}
