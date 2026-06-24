'use client'

import { env } from 'next-runtime-env'

import { WorkspaceServiceInstanceDataSourceImpl } from '@/data/data-source'
import { WorkspaceServiceInstanceRepositoryImpl } from '@/data/repository'
import {
  Result,
  WorkspaceServiceInstance,
  WorkspaceServiceInstanceCreateSchema,
  WorkspaceServiceInstanceCreateType,
  WorkspaceServiceInstanceListFilter,
  WorkspaceServiceInstanceSecrets,
  WorkspaceServiceInstanceUpdateSchema,
  WorkspaceServiceInstanceUpdateType
} from '@/domain/model'
import { WorkspaceServiceInstanceCreate } from '@/domain/use-cases/workspace-service-instance/workspace-service-instance-create'
import { WorkspaceServiceInstanceDelete } from '@/domain/use-cases/workspace-service-instance/workspace-service-instance-delete'
import { WorkspaceServiceInstanceGet } from '@/domain/use-cases/workspace-service-instance/workspace-service-instance-get'
import { WorkspaceServiceInstanceGetSecrets } from '@/domain/use-cases/workspace-service-instance/workspace-service-instance-get-secrets'
import { WorkspaceServiceInstanceList } from '@/domain/use-cases/workspace-service-instance/workspace-service-instance-list'
import { WorkspaceServiceInstanceUpdate } from '@/domain/use-cases/workspace-service-instance/workspace-service-instance-update'

const getRepository = async () => {
  const dataSource = new WorkspaceServiceInstanceDataSourceImpl(
    env('NEXT_PUBLIC_API_URL') || ''
  )
  return new WorkspaceServiceInstanceRepositoryImpl(dataSource)
}

export async function workspaceServiceInstanceList(
  filterOrWorkspaceId?: string | WorkspaceServiceInstanceListFilter
): Promise<Result<WorkspaceServiceInstance[]>> {
  try {
    const filter: WorkspaceServiceInstanceListFilter | undefined =
      typeof filterOrWorkspaceId === 'string'
        ? { workspaceIds: [filterOrWorkspaceId] }
        : filterOrWorkspaceId

    const repository = await getRepository()
    const useCase = new WorkspaceServiceInstanceList(repository)
    return await useCase.execute(filter)
  } catch (error) {
    console.error('Error listing workspace service instances', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceServiceInstanceGet(
  id: string
): Promise<Result<WorkspaceServiceInstance>> {
  try {
    if (!id) throw new Error('Invalid workspace service instance id')
    const repository = await getRepository()
    const useCase = new WorkspaceServiceInstanceGet(repository)
    return await useCase.execute(id)
  } catch (error) {
    console.error('Error getting workspace service instance', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceServiceInstanceGetSecrets(
  id: string
): Promise<Result<WorkspaceServiceInstanceSecrets>> {
  try {
    if (!id) throw new Error('Invalid workspace service instance id')
    const repository = await getRepository()
    const useCase = new WorkspaceServiceInstanceGetSecrets(repository)
    return await useCase.execute(id)
  } catch (error) {
    console.error('Error getting workspace service instance secrets', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceServiceInstanceDelete(
  id: string
): Promise<Result<string>> {
  try {
    if (!id) throw new Error('Invalid workspace service instance id')
    const repository = await getRepository()
    const useCase = new WorkspaceServiceInstanceDelete(repository)
    return await useCase.execute(id)
  } catch (error) {
    console.error('Error deleting workspace service instance', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceServiceInstanceCreate(
  input: WorkspaceServiceInstanceCreateType
): Promise<Result<WorkspaceServiceInstance>> {
  try {
    const validation = WorkspaceServiceInstanceCreateSchema.safeParse(input)
    if (!validation.success) {
      return { issues: validation.error.issues }
    }

    const repository = await getRepository()
    const useCase = new WorkspaceServiceInstanceCreate(repository)
    return await useCase.execute(validation.data)
  } catch (error) {
    console.error('Error creating workspace service instance', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceServiceInstanceUpdate(
  input: WorkspaceServiceInstanceUpdateType
): Promise<Result<WorkspaceServiceInstance>> {
  try {
    const validation = WorkspaceServiceInstanceUpdateSchema.safeParse(input)
    if (!validation.success) {
      return { issues: validation.error.issues }
    }

    const repository = await getRepository()
    const useCase = new WorkspaceServiceInstanceUpdate(repository)
    return await useCase.execute(validation.data)
  } catch (error) {
    console.error('Error updating workspace service instance', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
