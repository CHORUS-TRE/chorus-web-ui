'use client'

import { useCallback, useMemo } from 'react'

import { toast } from '@/components/hooks/use-toast'
import {
  BOOKMARKS_SOFT_CAP,
  BookmarkItem,
  BookmarksSchema,
  normalizeRoute,
  USER_BOOKMARKS_KEY,
  validateLabel
} from '@/domain/model/bookmark'
import { useDevStoreCache } from '@/stores/dev-store-cache'

interface UseBookmarksReturn {
  bookmarks: BookmarkItem[]
  isBookmarked: (route: string) => boolean
  getBookmark: (route: string) => BookmarkItem | undefined
  addBookmark: (
    route: string,
    label: string,
    icon?: string
  ) => Promise<boolean>
  removeBookmark: (route: string) => Promise<boolean>
  toggleBookmark: (
    route: string,
    labelIfNew: string,
    iconIfNew?: string
  ) => Promise<{ added: boolean; label?: string } | null>
  updateLabel: (route: string, label: string) => Promise<boolean>
  reorderBookmarks: (fromIndex: number, toIndex: number) => Promise<boolean>
}

export function useBookmarks(): UseBookmarksReturn {
  const raw = useDevStoreCache((state) => state.user[USER_BOOKMARKS_KEY])
  const setUserBookmarks = useDevStoreCache((state) => state.setUserBookmarks)

  const bookmarks = useMemo<BookmarkItem[]>(() => {
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      const validated = BookmarksSchema.safeParse(parsed)
      if (validated.success) return validated.data
      return []
    } catch {
      return []
    }
  }, [raw])

  const isBookmarked = useCallback(
    (route: string) => {
      const n = normalizeRoute(route)
      return bookmarks.some((b) => b.route === n)
    },
    [bookmarks]
  )

  const getBookmark = useCallback(
    (route: string) => {
      const n = normalizeRoute(route)
      return bookmarks.find((b) => b.route === n)
    },
    [bookmarks]
  )

  const addBookmark = useCallback(
    async (route: string, label: string, icon?: string) => {
      const normalized = normalizeRoute(route)
      const trimmed = validateLabel(label)
      if (!trimmed) {
        toast({
          title: 'Invalid label',
          description: `Label must be 1-50 characters`,
          variant: 'destructive'
        })
        return false
      }
      if (bookmarks.some((b) => b.route === normalized)) return true
      if (bookmarks.length >= BOOKMARKS_SOFT_CAP) {
        toast({
          title: 'Bookmark limit reached',
          description: `Maximum ${BOOKMARKS_SOFT_CAP} bookmarks. Remove one to add another.`,
          variant: 'destructive'
        })
        return false
      }
      const next: BookmarkItem[] = [
        {
          route: normalized,
          label: trimmed,
          icon,
          addedAt: new Date().toISOString()
        },
        ...bookmarks
      ]
      const ok = await setUserBookmarks(next)
      if (!ok) {
        toast({
          title: 'Failed to save bookmark',
          variant: 'destructive'
        })
      }
      return ok
    },
    [bookmarks, setUserBookmarks]
  )

  const removeBookmark = useCallback(
    async (route: string) => {
      const normalized = normalizeRoute(route)
      if (!bookmarks.some((b) => b.route === normalized)) return true
      const next = bookmarks.filter((b) => b.route !== normalized)
      const ok = await setUserBookmarks(next)
      if (!ok) {
        toast({
          title: 'Failed to remove bookmark',
          variant: 'destructive'
        })
      }
      return ok
    },
    [bookmarks, setUserBookmarks]
  )

  const toggleBookmark = useCallback(
    async (route: string, labelIfNew: string, iconIfNew?: string) => {
      const normalized = normalizeRoute(route)
      const existing = bookmarks.find((b) => b.route === normalized)
      if (existing) {
        const ok = await removeBookmark(route)
        return ok ? { added: false, label: existing.label } : null
      }
      const ok = await addBookmark(route, labelIfNew, iconIfNew)
      if (!ok) return null
      const trimmed = validateLabel(labelIfNew)
      return { added: true, label: trimmed ?? labelIfNew }
    },
    [bookmarks, addBookmark, removeBookmark]
  )

  const updateLabel = useCallback(
    async (route: string, label: string) => {
      const normalized = normalizeRoute(route)
      const trimmed = validateLabel(label)
      if (!trimmed) {
        toast({
          title: 'Invalid label',
          description: `Label must be 1-50 characters`,
          variant: 'destructive'
        })
        return false
      }
      const idx = bookmarks.findIndex((b) => b.route === normalized)
      if (idx === -1) return false
      const next = bookmarks.slice()
      next[idx] = { ...next[idx], label: trimmed }
      return setUserBookmarks(next)
    },
    [bookmarks, setUserBookmarks]
  )

  const reorderBookmarks = useCallback(
    async (fromIndex: number, toIndex: number) => {
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= bookmarks.length ||
        toIndex >= bookmarks.length ||
        fromIndex === toIndex
      ) {
        return true
      }
      const next = bookmarks.slice()
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return setUserBookmarks(next)
    },
    [bookmarks, setUserBookmarks]
  )

  return {
    bookmarks,
    isBookmarked,
    getBookmark,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    updateLabel,
    reorderBookmarks
  }
}
