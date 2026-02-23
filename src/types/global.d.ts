interface MatomoTagManagerEvent {
  'mtm.startTime'?: number
  event?: string
  [key: string]: unknown
}

interface Window {
  _mtm: MatomoTagManagerEvent[]
  _paq?: unknown[]
}
