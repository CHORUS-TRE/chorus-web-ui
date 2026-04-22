import { z } from 'zod'

export const USER_BOOKMARKS_KEY = 'user.bookmarks'

export const BOOKMARK_LABEL_MIN = 1
export const BOOKMARK_LABEL_MAX = 50
export const BOOKMARKS_SOFT_CAP = 50

export const BookmarkItemSchema = z.object({
  route: z.string().min(1),
  label: z.string().min(BOOKMARK_LABEL_MIN).max(BOOKMARK_LABEL_MAX),
  icon: z.string().optional(),
  addedAt: z.string()
})

export type BookmarkItem = z.infer<typeof BookmarkItemSchema>

export const BookmarksSchema = z.array(BookmarkItemSchema)

export type Bookmarks = z.infer<typeof BookmarksSchema>

export function normalizeRoute(route: string): string {
  if (!route) return route
  // Strip query + hash
  let path = route.split('?')[0].split('#')[0]
  // Strip trailing slashes (but keep a single "/" for root)
  if (path.length > 1) path = path.replace(/\/+$/, '')
  return path
}

export function validateLabel(raw: string): string | null {
  const trimmed = raw.trim()
  if (trimmed.length < BOOKMARK_LABEL_MIN) return null
  if (trimmed.length > BOOKMARK_LABEL_MAX) return null
  return trimmed
}
