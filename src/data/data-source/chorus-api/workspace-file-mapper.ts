import {
  WorkspaceFile,
  WorkspaceFileCreateType,
  WorkspaceFilePart,
  WorkspaceFileUpdateType
} from '~/domain/model/workspace-file'
import { ChorusWorkspaceFile, ChorusWorkspaceFilePart } from '~/internal/client'

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
