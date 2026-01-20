export type EventCategory =
  | 'Auth'
  | 'Workspace'
  | 'Data'
  | 'Session'
  | 'AppInstance'

export interface AnalyticsEvent {
  category: EventCategory
  action: string
  name: string
  value?: number | string // Generic value, mapped to specific dims if needed in the adapter
  customDimensions?: Record<string, string | number>
}

// Custom Dimension Indices (Must match Matomo Config)
export enum CustomDimension {
  UserRole = 1,
  WorkspaceID = 2,
  AppRef = 3,
  ErrorType = 4
}
