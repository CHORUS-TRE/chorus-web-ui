interface AnalyticsEvent {
  type: string
  timestamp: number
  data: Record<string, unknown>
}

export function trackOfflineEvent(eventData: AnalyticsEvent) {
  if (!navigator.onLine) {
    localStorage.setItem('offline_events', JSON.stringify(eventData))
  }
}
