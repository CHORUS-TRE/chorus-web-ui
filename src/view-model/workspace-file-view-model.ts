'use client'

import { env } from 'next-runtime-env'

import { Analytics } from '@/lib/analytics/service'
import { WorkspaceFileDataSourceImpl } from '~/data/data-source'
import { WorkspaceFileRepositoryImpl } from '~/data/repository'
import { Result } from '~/domain/model'
import {
  WorkspaceFile,
  WorkspaceFileCreateType,
  WorkspaceFilePart,
  WorkspaceFileUpdateType
} from '~/domain/model/workspace-file'
import { WorkspaceFileAbortUpload } from '~/domain/use-cases/workspace-file/workspace-file-abort-upload'
import { WorkspaceFileCompleteUpload } from '~/domain/use-cases/workspace-file/workspace-file-complete-upload'
import { WorkspaceFileCreate } from '~/domain/use-cases/workspace-file/workspace-file-create'
import { WorkspaceFileDelete } from '~/domain/use-cases/workspace-file/workspace-file-delete'
import { WorkspaceFileGet } from '~/domain/use-cases/workspace-file/workspace-file-get'
import { WorkspaceFileInitUpload } from '~/domain/use-cases/workspace-file/workspace-file-init-upload'
import { WorkspaceFileList } from '~/domain/use-cases/workspace-file/workspace-file-list'
import { WorkspaceFileUpdate } from '~/domain/use-cases/workspace-file/workspace-file-update'
import { WorkspaceFileUploadPart } from '~/domain/use-cases/workspace-file/workspace-file-upload-part'
import { FetchError, ResponseError } from '~/internal/client/runtime'

const getRepository = async () => {
  const dataSource = new WorkspaceFileDataSourceImpl(
    env('NEXT_PUBLIC_API_URL') || ''
  )
  return new WorkspaceFileRepositoryImpl(dataSource)
}

export async function workspaceFileCreate(
  workspaceId: string,
  file: WorkspaceFileCreateType
): Promise<Result<WorkspaceFile>> {
  try {
    if (!workspaceId) throw new Error('Invalid workspace id')
    const repository = await getRepository()
    const useCase = new WorkspaceFileCreate(repository)
    return await useCase.execute(workspaceId, file)
  } catch (error) {
    console.error('Error creating workspace file', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceFileGet(
  workspaceId: string,
  path: string
): Promise<Result<WorkspaceFile>> {
  try {
    if (!workspaceId) throw new Error('Invalid workspace id')
    if (!path) throw new Error('Invalid file path')
    const repository = await getRepository()
    const useCase = new WorkspaceFileGet(repository)
    return await useCase.execute(workspaceId, path)
  } catch (error) {
    console.error('Error getting workspace file', error)
    if (error instanceof ResponseError) {
      // Handle HTTP errors like 502, 404, etc.
      return {
        error: `API Error: ${error.response.status} ${error.response.statusText}`
      }
    }
    if (error instanceof FetchError) {
      // Handle network errors, including CORS issues
      return {
        error: `Network Error: ${error.message}. Check browser console for CORS details.`
      }
    }
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceFileList(
  workspaceId: string,
  path: string
): Promise<Result<WorkspaceFile[]>> {
  try {
    if (!workspaceId) throw new Error('Invalid workspace id')
    const repository = await getRepository()
    const useCase = new WorkspaceFileList(repository)
    return await useCase.execute(workspaceId, path)
  } catch (error) {
    console.error('Error listing workspace files', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceFileUpdate(
  workspaceId: string,
  oldPath: string,
  file: WorkspaceFileUpdateType
): Promise<Result<WorkspaceFile>> {
  try {
    if (!workspaceId) throw new Error('Invalid workspace id')
    if (!oldPath) throw new Error('Invalid old file path')
    const repository = await getRepository()
    const useCase = new WorkspaceFileUpdate(repository)
    return await useCase.execute(workspaceId, oldPath, file)
  } catch (error) {
    console.error('Error updating workspace file', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceFileDelete(
  workspaceId: string,
  path: string
): Promise<Result<string>> {
  try {
    if (!workspaceId) throw new Error('Invalid workspace id')
    if (!path) throw new Error('Invalid file path')
    const repository = await getRepository()
    const useCase = new WorkspaceFileDelete(repository)
    return await useCase.execute(workspaceId, path)
  } catch (error) {
    console.error('Error deleting workspace file', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceFileInitUpload(
  workspaceId: string,
  path: string,
  file: WorkspaceFileCreateType
): Promise<Result<{ uploadId: string; partSize: number; totalParts: number }>> {
  try {
    if (!workspaceId) throw new Error('Invalid workspace id')
    if (!path) throw new Error('Invalid file path')
    const repository = await getRepository()
    const useCase = new WorkspaceFileInitUpload(repository)
    const result = await useCase.execute(workspaceId, path, file)

    if (result.data) {
      const size = file.size ? parseInt(file.size, 10) : 0
      Analytics.Data.uploadStart(isNaN(size) ? 0 : size)
    }

    return result
  } catch (error) {
    Analytics.Data.uploadError()
    console.error('Error initializing workspace file upload', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceFileUploadPart(
  workspaceId: string,
  path: string,
  uploadId: string,
  part: WorkspaceFilePart
): Promise<Result<WorkspaceFilePart>> {
  try {
    if (!workspaceId) throw new Error('Invalid workspace id')
    if (!path) throw new Error('Invalid file path')
    if (!uploadId) throw new Error('Invalid upload id')
    const repository = await getRepository()
    const useCase = new WorkspaceFileUploadPart(repository)
    return await useCase.execute(workspaceId, path, uploadId, part)
  } catch (error) {
    Analytics.Data.uploadError()
    console.error('Error uploading workspace file part', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceFileCompleteUpload(
  workspaceId: string,
  path: string,
  uploadId: string,
  parts: WorkspaceFilePart[]
): Promise<Result<WorkspaceFile>> {
  try {
    if (!workspaceId) throw new Error('Invalid workspace id')
    if (!path) throw new Error('Invalid file path')
    if (!uploadId) throw new Error('Invalid upload id')
    const repository = await getRepository()
    const useCase = new WorkspaceFileCompleteUpload(repository)
    const result = await useCase.execute(workspaceId, path, uploadId, parts)

    if (result.data) {
      Analytics.Data.uploadSuccess()
    } else if (result.error) {
      Analytics.Data.uploadError()
    }

    return result
  } catch (error) {
    Analytics.Data.uploadError()
    console.error('Error completing workspace file upload', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceFileAbortUpload(
  workspaceId: string,
  path: string,
  uploadId: string
): Promise<Result<string>> {
  try {
    if (!workspaceId) throw new Error('Invalid workspace id')
    if (!path) throw new Error('Invalid file path')
    if (!uploadId) throw new Error('Invalid upload id')
    const repository = await getRepository()
    const useCase = new WorkspaceFileAbortUpload(repository)
    return await useCase.execute(workspaceId, path, uploadId)
  } catch (error) {
    console.error('Error aborting workspace file upload', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
