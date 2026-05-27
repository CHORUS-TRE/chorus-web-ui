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
  WorkspaceServiceInstanceUpdateSchema,
  WorkspaceServiceInstanceUpdateType
} from '@/domain/model'
import { WorkspaceServiceInstanceCreate } from '@/domain/use-cases/workspace-service-instance/workspace-service-instance-create'
import { WorkspaceServiceInstanceDelete } from '@/domain/use-cases/workspace-service-instance/workspace-service-instance-delete'
import { WorkspaceServiceInstanceGet } from '@/domain/use-cases/workspace-service-instance/workspace-service-instance-get'
import { WorkspaceServiceInstanceList } from '@/domain/use-cases/workspace-service-instance/workspace-service-instance-list'
import { WorkspaceServiceInstanceUpdate } from '@/domain/use-cases/workspace-service-instance/workspace-service-instance-update'

const getRepository = async () => {
  const dataSource = new WorkspaceServiceInstanceDataSourceImpl(
    env('NEXT_PUBLIC_API_URL') || ''
  )
  return new WorkspaceServiceInstanceRepositoryImpl(dataSource)
}

function parseJsonArrayField(
  raw: FormDataEntryValue | null
): string[] | undefined {
  if (raw === null || raw === '') return undefined
  if (typeof raw !== 'string') return undefined
  try {
    const parsed = JSON.parse(raw) as unknown
    if (Array.isArray(parsed)) return parsed.map((v) => String(v))
  } catch {
    // Fall through
  }
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export async function workspaceServiceInstanceList(
  filter?: WorkspaceServiceInstanceListFilter
): Promise<Result<WorkspaceServiceInstance[]>> {
  try {
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
  prevState: Result<WorkspaceServiceInstance>,
  formData: FormData
): Promise<Result<WorkspaceServiceInstance>> {
  try {
    const repository = await getRepository()
    const useCase = new WorkspaceServiceInstanceCreate(repository)

    const raw = Object.fromEntries(formData.entries())
    const instance = {
      ...raw,
      credentialsPaths: parseJsonArrayField(formData.get('credentialsPaths'))
    } as Record<string, unknown>

    const validation = WorkspaceServiceInstanceCreateSchema.safeParse(instance)
    if (!validation.success) {
      return { ...prevState, issues: validation.error.issues }
    }

    return await useCase.execute(
      validation.data as WorkspaceServiceInstanceCreateType
    )
  } catch (error) {
    console.error('Error creating workspace service instance', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceServiceInstanceUpdate(
  prevState: Result<WorkspaceServiceInstance>,
  formData: FormData
): Promise<Result<WorkspaceServiceInstance>> {
  try {
    const repository = await getRepository()
    const useCase = new WorkspaceServiceInstanceUpdate(repository)

    const raw = Object.fromEntries(formData.entries())
    const instance = {
      ...raw,
      credentialsPaths: parseJsonArrayField(formData.get('credentialsPaths'))
    } as Record<string, unknown>

    const validation = WorkspaceServiceInstanceUpdateSchema.safeParse(instance)
    if (!validation.success) {
      return { ...prevState, issues: validation.error.issues }
    }

    return await useCase.execute(
      validation.data as WorkspaceServiceInstanceUpdateType
    )
  } catch (error) {
    console.error('Error updating workspace service instance', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
