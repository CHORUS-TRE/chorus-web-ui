import { normalizeRoute } from '@/domain/model/bookmark'

export interface DeriveBookmarkContext {
  workspaceName?: string
  sessionName?: string
  entityName?: string
}

export interface DerivedBookmark {
  label: string
  icon: string
}

function titleCase(segment: string): string {
  if (!segment) return segment
  const words = segment.replace(/[-_]+/g, ' ').trim().split(/\s+/)
  return words
    .map((w) => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(' ')
}

export function deriveBookmarkLabel(
  route: string,
  context?: DeriveBookmarkContext
): DerivedBookmark {
  const normalized = normalizeRoute(route)

  // Root = Dashboard
  if (normalized === '/' || normalized === '/dashboard') {
    return { label: 'Dashboard', icon: 'GaugeCircle' }
  }

  const segments = normalized.split('/').filter(Boolean)

  // /workspaces, /workspaces/{id}, /workspaces/{id}/sessions/{id}
  if (segments[0] === 'workspaces') {
    if (segments.length === 1) {
      return { label: 'Workspaces', icon: 'Package' }
    }
    if (segments.length === 2) {
      return {
        label: context?.workspaceName || `Workspace ${segments[1]}`,
        icon: 'Package'
      }
    }
    if (segments[2] === 'sessions' && segments.length >= 4) {
      return {
        label: context?.sessionName || `Session ${segments[3]}`,
        icon: 'LaptopMinimal'
      }
    }
  }

  // /sessions
  if (segments[0] === 'sessions' && segments.length === 1) {
    return { label: 'Sessions', icon: 'LaptopMinimal' }
  }

  // /data, /data/{...path}
  if (segments[0] === 'data') {
    if (segments.length === 1) return { label: 'Data', icon: 'Database' }
    const last = segments[segments.length - 1]
    return { label: `Data > ${titleCase(last)}`, icon: 'Database' }
  }

  if (segments[0] === 'app-store' && segments.length === 1) {
    return { label: 'App Store', icon: 'Store' }
  }

  if (segments[0] === 'messages' && segments.length === 1) {
    return { label: 'Messages', icon: 'Mail' }
  }

  if (segments[0] === 'settings' && segments.length === 1) {
    return { label: 'Settings', icon: 'Settings' }
  }

  // /admin, /admin/{section}, /admin/{section}/{id}
  if (segments[0] === 'admin') {
    if (segments.length === 1) return { label: 'Admin', icon: 'Shield' }
    if (segments.length === 2) {
      return {
        label: `Admin > ${titleCase(segments[1])}`,
        icon: 'Shield'
      }
    }
    // /admin/{section}/{id}
    const entity = context?.entityName || segments[segments.length - 1]
    return {
      label: `Admin > ${titleCase(segments[1])} > ${entity}`,
      icon: 'Shield'
    }
  }

  // Unknown: title-case last path segment
  const last = segments[segments.length - 1] ?? ''
  return {
    label: titleCase(last) || 'Bookmark',
    icon: 'Bookmark'
  }
}
