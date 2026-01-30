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
  checksum: string
  createdAt: Date
  expiresAt?: Date
}

export interface DataMovementRequest {
  id: string
  type: DataMovementType
  status: RequestStatus
  requestedBy: {
    id: string
    name: string
    email: string
  }
  requestedAt: Date
  files: FileSnapshot[]
  totalSize: number
  justification: string
  reviewedBy?: {
    id: string
    name: string
  }
  reviewedAt?: Date
  reviewNotes?: string
  sourceWorkspaceId?: string
  targetWorkspaceId?: string
  downloadLink?: string
  downloadExpiresAt?: Date
  downloadCount?: number
  maxDownloads?: number
}
