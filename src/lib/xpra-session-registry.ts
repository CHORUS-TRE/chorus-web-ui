import type {
  XpraSessionInfo,
  XpraWebHandle,
  XpraWindow
} from '@/components/xpra-web'

const sessions = new Map<string, XpraWebHandle>()

// Manual stopgap for xpra WM_CLASS values that share no substring with either
// the Chorus app's catalog name or its Docker image name, so the heuristic
// matching in focusXpraApp() below would otherwise never find them. Add an
// entry here whenever click-to-focus fails to match a known app. Keys are
// the window's appId (WM_CLASS) as reported by xpra, lowercase.
const KNOWN_XPRA_APP_ALIASES: Record<string, string> = {
  kitty: 'robex',
  'pcmanfm-qt': 'file manager'
}

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

export function focusXpraApp(
  sessionId: string,
  candidates: string[],
  dockerImageName?: string
): boolean {
  // Docker image names are typically "registry/path/binary-name[:tag]" — the
  // last path segment (minus any tag) is the best guess at the program's
  // actual name, which is what tends to show up in the xpra window's
  // WM_CLASS. Not guaranteed to match (the image name is a Chorus catalog
  // choice, not derived from the binary), but it's another signal to try.
  const imageBaseName = dockerImageName?.split('/').pop()?.split(':')[0]

  const normalizedCandidates = [...candidates, imageBaseName]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.trim().toLocaleLowerCase())
    .filter(Boolean)
  const windows = listXpraWindows(sessionId)
  const match = windows.find((window) => {
    const alias = KNOWN_XPRA_APP_ALIASES[window.appId.toLocaleLowerCase()]
    const haystack =
      `${window.title} ${window.appId} ${alias ?? ''}`.toLocaleLowerCase()
    return normalizedCandidates.some((candidate) =>
      haystack.includes(candidate)
    )
  })

  return match ? focusXpraWindow(sessionId, match.id) : false
}

export function hasXpraBridge(sessionId: string): boolean {
  return sessions.has(sessionId)
}

export function setXpraAudio(sessionId: string, enabled: boolean): void {
  sessions.get(sessionId)?.setAudio(enabled)
}

export function setXpraKeyboard(sessionId: string, visible: boolean): void {
  console.log('[osk] 2. setXpraKeyboard', {
    sessionId,
    visible,
    hasSession: sessions.has(sessionId)
  })
  sessions.get(sessionId)?.setKeyboard(visible)
}

export function uploadXpraFile(sessionId: string): void {
  sessions.get(sessionId)?.uploadFile()
}

export function downloadXpraFile(sessionId: string): void {
  sessions.get(sessionId)?.downloadFile()
}

export function getXpraSessionInfo(
  sessionId: string
): XpraSessionInfo | undefined {
  return sessions.get(sessionId)?.getSessionInfo()
}

export function reconnectXpraSession(sessionId: string): void {
  sessions.get(sessionId)?.reconnect()
}
