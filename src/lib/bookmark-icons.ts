import {
  Bookmark,
  Database,
  GaugeCircle,
  LaptopMinimal,
  type LucideIcon,
  Mail,
  Package,
  Settings,
  Shield,
  Store
} from 'lucide-react'

/**
 * Name → lucide component registry for BookmarkItem.icon.
 * Unknown names resolve to `Bookmark`. Keep in sync with
 * `deriveBookmarkLabel` in `@/lib/derive-bookmark-label`.
 */
const REGISTRY: Record<string, LucideIcon> = {
  Bookmark,
  Database,
  GaugeCircle,
  LaptopMinimal,
  Mail,
  Package,
  Settings,
  Shield,
  Store
}

export function resolveBookmarkIcon(name?: string): LucideIcon {
  if (!name) return Bookmark
  return REGISTRY[name] ?? Bookmark
}
