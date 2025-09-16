'use client'

import { env } from 'next-runtime-env'

import { WorkspaceFileDataSourceImpl } from '~/data/data-source'
import { WorkspaceFileRepositoryImpl } from '~/data/repository'
import { Result } from '~/domain/model'
import {
  WorkspaceFile,
  WorkspaceFileCreateType,
  WorkspaceFileUpdateType
} from '~/domain/model/workspace-file'
import { WorkspaceFileCreate } from '~/domain/use-cases/workspace-file/workspace-file-create'
import { WorkspaceFileDelete } from '~/domain/use-cases/workspace-file/workspace-file-delete'
import { WorkspaceFileGet } from '~/domain/use-cases/workspace-file/workspace-file-get'
import { WorkspaceFileList } from '~/domain/use-cases/workspace-file/workspace-file-list'
import { WorkspaceFileUpdate } from '~/domain/use-cases/workspace-file/workspace-file-update'

const getRepository = async () => {
  const dataSource = new WorkspaceFileDataSourceImpl(
    env('NEXT_PUBLIC_DATA_SOURCE_API_URL') || ''
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
