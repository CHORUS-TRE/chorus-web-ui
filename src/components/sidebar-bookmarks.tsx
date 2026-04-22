'use client'

import { X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import {
  type DragEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

import { toast } from '@/components/hooks/use-toast'
import { Separator } from '@/components/ui/separator'
import { BOOKMARK_LABEL_MAX, normalizeRoute } from '@/domain/model/bookmark'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { resolveBookmarkIcon } from '@/lib/bookmark-icons'
import { cn } from '@/lib/utils'

export function SidebarBookmarks() {
  const { bookmarks, removeBookmark, updateLabel, reorderBookmarks } =
    useBookmarks()
  const pathname = usePathname() || '/'
  const router = useRouter()
  const currentRoute = normalizeRoute(pathname)

  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const [editingRoute, setEditingRoute] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const editRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingRoute && editRef.current) {
      editRef.current.focus()
      editRef.current.select()
    }
  }, [editingRoute])

  const handleDragStart = (index: number) => (e: DragEvent<HTMLDivElement>) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }

  const handleDragOver = (index: number) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (overIndex !== index) setOverIndex(index)
  }

  const handleDrop =
    (index: number) => async (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const from = dragIndex
      setDragIndex(null)
      setOverIndex(null)
      if (from === null || from === index) return
      const ok = await reorderBookmarks(from, index)
      if (!ok) {
        toast({ title: 'Failed to reorder bookmarks', variant: 'destructive' })
      }
    }

  const handleDragEnd = () => {
    setDragIndex(null)
    setOverIndex(null)
  }

  const startEdit = useCallback((route: string, label: string) => {
    setEditingRoute(route)
    setEditValue(label)
  }, [])

  const commitEdit = useCallback(async () => {
    if (!editingRoute) return
    const current = bookmarks.find((b) => b.route === editingRoute)
    if (!current) {
      setEditingRoute(null)
      return
    }
    const trimmed = editValue.trim()
    if (trimmed === current.label) {
      setEditingRoute(null)
      return
    }
    const ok = await updateLabel(editingRoute, trimmed)
    if (ok) setEditingRoute(null)
  }, [editingRoute, editValue, bookmarks, updateLabel])

  const cancelEdit = useCallback(() => {
    setEditingRoute(null)
    setEditValue('')
  }, [])

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      commitEdit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancelEdit()
    }
  }

  if (bookmarks.length === 0) return null

  return (
    <>
      <Separator className="my-2" />
      <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/60">
        Bookmarks
      </div>
      <div className="flex flex-col gap-0.5">
        {bookmarks.map((bookmark, index) => {
          const Icon = resolveBookmarkIcon(bookmark.icon)
          const isActive = bookmark.route === currentRoute
          const isEditing = editingRoute === bookmark.route
          const isDragging = dragIndex === index
          const isDropTarget = overIndex === index && dragIndex !== index

          return (
            <div
              key={bookmark.route}
              draggable={!isEditing}
              onDragStart={handleDragStart(index)}
              onDragOver={handleDragOver(index)}
              onDrop={handleDrop(index)}
              onDragEnd={handleDragEnd}
              className={cn(
                'group relative flex items-center',
                isDragging && 'opacity-40',
                isDropTarget && 'ring-1 ring-accent/60'
              )}
            >
              {isEditing ? (
                <div className="flex w-full items-center gap-3 rounded-lg px-3 py-1.5">
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    ref={editRef}
                    value={editValue}
                    maxLength={BOOKMARK_LABEL_MAX}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleEditKeyDown}
                    onBlur={commitEdit}
                    className="w-full rounded bg-transparent px-1 text-sm font-medium outline-none ring-1 ring-accent/60"
                    aria-label="Rename bookmark"
                  />
                </div>
              ) : (
                <>
                  <a
                    href={bookmark.route}
                    onClick={(e) => {
                      e.preventDefault()
                      router.push(bookmark.route)
                    }}
                    onDoubleClick={(e) => {
                      e.preventDefault()
                      startEdit(bookmark.route, bookmark.label)
                    }}
                    title={bookmark.label}
                    className={cn(
                      'flex min-w-0 flex-1 items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:text-accent',
                      isActive
                        ? 'bg-accent/15 text-accent'
                        : 'text-muted-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{bookmark.label}</span>
                  </a>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeBookmark(bookmark.route)
                    }}
                    aria-label={`Remove bookmark ${bookmark.label}`}
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground/60 opacity-0 transition-opacity hover:bg-muted/40 hover:text-foreground focus:opacity-100 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
