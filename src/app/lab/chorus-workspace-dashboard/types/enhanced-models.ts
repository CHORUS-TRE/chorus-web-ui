/**
 * Enhanced CHORUS Workspace Models
 *
 * Extended TypeScript interfaces for workspace dashboard with data movement controls
 *
 * @accessibility
 * - Type-safe props for accessible component development
 * - Semantic status enums for clear UI states
 *
 * @eco-design
 * - Minimal type overhead
 * - Tree-shakeable exports
 */

import type {
  ChorusWorkspace,
  ChorusWorkspaceFile
} from '../../../knowledge/chorus-source-code/CHORUS-TRE/chorus-web-ui/src/internal/client/models'

// ============================================================================
// Network Configuration Types
// ============================================================================

export type NetworkType = 'air-gapped' | 'whitelisted' | 'open'

export interface NetworkConfig {
  type: NetworkType
  whitelistedDomains?: string[]
  lastVerified?: Date
  description: string
}

// ============================================================================
// Resource Allocation Types
// ============================================================================

export interface ResourceAllocation {
  gpu: {
    allocated: number
    used: number
    model?: string
    unit: 'cores' | 'devices'
  }
  cpu: {
    allocated: number
    used: number
    unit: 'cores'
  }
  ram: {
    allocated: number
    used: number
    unit: 'GB'
  }
  storage: {
    allocated: number
    used: number
    unit: 'TB' | 'GB'
  }
}

// ============================================================================
// Member & Role Types
// ============================================================================

export type WorkspaceRole =
  | 'workspace-admin'
  | 'pi' // Principal Investigator
  | 'data-manager'
  | 'researcher'
  | 'analyst'
  | 'viewer'

export interface WorkspaceMember {
  id: string
  userId: string
  email: string
  name: string
  role: WorkspaceRole
  permissions: WorkspacePermissions
  joinedAt: Date
  lastActive?: Date
}

export interface WorkspacePermissions {
  listFiles: boolean
  upload: boolean
  download: boolean
  modify: boolean
  transfer: boolean // Move between workspaces
  approve: boolean // Approve data movement requests
  manageMembers: boolean
  configureServices: boolean
}

// ============================================================================
// Service Integration Types
// ============================================================================

export type ServiceType = 'gitlab' | 'jupyter' | 'rstudio' | 'vscode'

export interface ServiceInstance {
  id: string
  type: ServiceType
  name: string
  url: string
  status: 'running' | 'stopped' | 'error' | 'provisioning'
  version?: string
  lastHealthCheck?: Date
}

// ============================================================================
// Data Movement Request Types
// ============================================================================

export type DataMovementType = 'download' | 'transfer' | 'upload'
export type RequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'downloaded'
  | 'cancelled'

export interface FileSnapshot {
  snapshotId: string
  originalFileId: string
  path: string
  name: string
  size: number
  mimeType: string
  checksum: string // SHA-256 for integrity verification
  createdAt: Date
  expiresAt?: Date
}

export interface DataMovementRequest {
  id: string
  type: DataMovementType
  status: RequestStatus
  requestedBy: WorkspaceMember
  requestedAt: Date

  // Files included in request
  files: FileSnapshot[]
  totalSize: number

  // Justification & approval
  justification: string
  reviewedBy?: WorkspaceMember
  reviewedAt?: Date
  reviewNotes?: string

  // For transfers between workspaces
  sourceWorkspaceId?: string
  targetWorkspaceId?: string

  // For downloads (exiting platform)
  downloadLink?: string
  downloadExpiresAt?: Date
  downloadCount?: number
  maxDownloads?: number
}

// ============================================================================
// Enhanced Workspace Interface
// ============================================================================

export interface EnhancedChorusWorkspace extends ChorusWorkspace {
  // Network configuration
  network: NetworkConfig

  // Resource allocation
  resources: ResourceAllocation

  // Members and roles
  members: WorkspaceMember[]

  // Integrated services
  services: ServiceInstance[]

  // Data movement tracking
  pendingRequests: DataMovementRequest[]
  requestHistory: DataMovementRequest[]
}

// ============================================================================
// UI State Types
// ============================================================================

export interface FileSelectionState {
  selectedFiles: ChorusWorkspaceFile[]
  totalSize: number
  selectionMode: 'download' | 'transfer' | null
}

export interface DashboardViewState {
  activeTab:
    | 'overview'
    | 'files'
    | 'data-movement'
    | 'resources'
    | 'members'
    | 'services'
  fileSelectionBasket: FileSelectionState
  filterBy?: {
    requestType?: DataMovementType
    requestStatus?: RequestStatus
    dateRange?: { start: Date; end: Date }
  }
}

// ============================================================================
// Permission Helper Functions
// ============================================================================

export function canApproveRequests(member: WorkspaceMember): boolean {
  return (
    member.permissions.approve ||
    member.role === 'pi' ||
    member.role === 'workspace-admin'
  )
}

export function canDownloadFiles(member: WorkspaceMember): boolean {
  return member.permissions.download
}

export function canTransferFiles(member: WorkspaceMember): boolean {
  return member.permissions.transfer
}

export function getNetworkStatusColor(networkType: NetworkType): string {
  switch (networkType) {
    case 'air-gapped':
      return 'red'
    case 'whitelisted':
      return 'yellow'
    case 'open':
      return 'green'
  }
}

export function getRequestStatusColor(status: RequestStatus): string {
  switch (status) {
    case 'pending':
      return 'yellow'
    case 'approved':
      return 'green'
    case 'rejected':
      return 'red'
    case 'expired':
      return 'gray'
    case 'downloaded':
      return 'blue'
    case 'cancelled':
      return 'gray'
  }
}

// ============================================================================
// Accessibility Labels
// ============================================================================

export function getNetworkTypeLabel(networkType: NetworkType): string {
  switch (networkType) {
    case 'air-gapped':
      return 'Air-gapped network - No internet access'
    case 'whitelisted':
      return 'Restricted network - Whitelisted domains only'
    case 'open':
      return 'Open network - Full internet access'
  }
}

export function getRoleLabel(role: WorkspaceRole): string {
  switch (role) {
    case 'workspace-admin':
      return 'Workspace Administrator'
    case 'pi':
      return 'Principal Investigator'
    case 'data-manager':
      return 'Data Manager'
    case 'researcher':
      return 'Researcher'
    case 'analyst':
      return 'Data Analyst'
    case 'viewer':
      return 'Viewer'
  }
}
