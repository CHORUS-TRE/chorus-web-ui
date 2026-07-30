import type { XpraWebHandle, XpraWindow } from '@/components/xpra-web'

const sessions = new Map<string, XpraWebHandle>()

export function registerXpraSession(
  sessionId: string,
  handle: XpraWebHandle
): () => void {
  sessions.set(sessionId, handle)
  return () => {
    if (sessions.get(sessionId) === handle) sessions.delete(sessionId)
  }
}

export function listXpraWindows(sessionId: string): XpraWindow[] {
  return sessions.get(sessionId)?.listWindows() ?? []
}

export function focusXpraWindow(sessionId: string, windowId: number): boolean {
  const session = sessions.get(sessionId)
  if (!session?.focusWindow(windowId)) return false
  session.focus()
  return true
}

export function focusXpraApp(sessionId: string, candidates: string[]): boolean {
  const normalizedCandidates = candidates
    .map((value) => value.trim().toLocaleLowerCase())
    .filter(Boolean)
  const windows = listXpraWindows(sessionId)
  const match = windows.find((window) => {
    const haystack = `${window.title} ${window.appId}`.toLocaleLowerCase()
    return normalizedCandidates.some((candidate) =>
      haystack.includes(candidate)
    )
  })

  return match ? focusXpraWindow(sessionId, match.id) : false
}
