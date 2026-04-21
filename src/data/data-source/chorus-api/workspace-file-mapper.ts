import {
  WorkspaceFile,
  WorkspaceFileCreateType,
  WorkspaceFilePart,
  WorkspaceFileStore,
  WorkspaceFileStoreStatus,
  WorkspaceFileUpdateType
} from '@/domain/model/workspace-file'
import {
  ChorusWorkspaceFile,
  ChorusWorkspaceFilePart,
  ChorusWorkspaceFileStoreInfo
} from '@/internal/client'

/**
 * Maps domain workspace file types to API types
 * Used for both create and update operations since they have the same structure
 */
export const toChorusWorkspaceFile = (
  file: WorkspaceFileCreateType | WorkspaceFileUpdateType
): ChorusWorkspaceFile => {
  return {
    name: file.name,
    path: file.path,
    isDirectory: file.isDirectory,
    size: file.size,
    mimeType: file.mimeType,
    content: file.content
  }
}

/**
 * Maps API workspace file to domain type
 * Handles date parsing and provides defaults for optional fields
 */
export const fromChorusWorkspaceFile = (
  file: ChorusWorkspaceFile
): WorkspaceFile => {
  return {
    name: file.name || '',
    path: file.path || '',
    isDirectory: file.isDirectory || false,
    size: file.size,
    mimeType: file.mimeType,
    createdAt: file.updatedAt ? new Date(file.updatedAt) : new Date(),
    updatedAt: file.updatedAt ? new Date(file.updatedAt) : new Date(),
    content: file.content
  }
}

export const toChorusWorkspaceFilePart = (
  part: WorkspaceFilePart
): ChorusWorkspaceFilePart => {
  return {
    partNumber: part.partNumber,
    etag: part.etag,
    data: part.data || ''
  }
}

export const fromChorusWorkspaceFilePart = (
  part: ChorusWorkspaceFilePart
): WorkspaceFilePart => {
  return {
    partNumber: part.partNumber || '',
    etag: part.etag || '',
    data: part.data
  }
}

/**
 * Normalize the wire-format status string to the domain enum.
 * Accepts both the short form (`READY`) and the prefixed gRPC form
 * (`WORKSPACE_FILE_STORE_STATUS_READY`); unknown values fall back to UNKNOWN.
 */
const normalizeStoreStatus = (raw?: string): WorkspaceFileStoreStatus => {
  if (!raw) return 'UNKNOWN'
  const upper = raw.toUpperCase()
  if (upper.endsWith('READY')) return 'READY'
  if (upper.endsWith('DISCONNECTED')) return 'DISCONNECTED'
  if (upper.endsWith('DISABLED')) return 'DISABLED'
  console.warn(`[workspace-file-mapper] Unknown store status: ${raw}`)
  return 'UNKNOWN'
}

export const fromChorusWorkspaceFileStoreInfo = (
  store: ChorusWorkspaceFileStoreInfo
): WorkspaceFileStore => {
  return {
    name: store.name || '',
    type: store.type,
    description: store.description,
    status: normalizeStoreStatus(store.status)
  }
}
