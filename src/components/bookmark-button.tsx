'use client'

import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import { toast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { normalizeRoute } from '@/domain/model/bookmark'
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

  const { isBookmarked, toggleBookmark } = useBookmarks()
  const bookmarked = isBookmarked(route)

  const handleToggle = useCallback(async () => {
    const derived = deriveBookmarkLabel(route, context)
    const result = await toggleBookmark(route, derived.label, derived.icon)
    if (!result) return
    toast({
      title: result.added ? `Bookmarked: ${result.label}` : 'Bookmark removed'
    })
  }, [route, context, toggleBookmark])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this page'}
            aria-pressed={bookmarked}
            className={cn(
              'h-8 w-8 transition-colors hover:text-accent',
              bookmarked
                ? 'text-accent hover:bg-accent/15'
                : 'text-foreground/80',
              className
            )}
          >
            {bookmarked ? (
              <BookmarkCheck className="h-5 w-5 fill-accent" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {bookmarked ? 'Remove bookmark' : 'Bookmark this page'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
