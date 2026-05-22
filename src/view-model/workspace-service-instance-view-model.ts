'use client'

import { env } from 'next-runtime-env'

import { WorkspaceServiceInstanceDataSourceImpl } from '@/data/data-source'
import { WorkspaceServiceInstanceRepositoryImpl } from '@/data/repository'
import { Result } from '@/domain/model'
import {
  WorkspaceServiceInstance,
  WorkspaceServiceInstanceCreateType,
  WorkspaceServiceInstanceUpdateType
} from '@/domain/model/workspace-service-instance'
import { WorkspaceServiceInstanceCreate } from '@/domain/use-cases/workspace-service-instance/workspace-service-instance-create'
import { WorkspaceServiceInstanceDelete } from '@/domain/use-cases/workspace-service-instance/workspace-service-instance-delete'
import { WorkspaceServiceInstanceGet } from '@/domain/use-cases/workspace-service-instance/workspace-service-instance-get'
import { WorkspaceServiceInstanceList } from '@/domain/use-cases/workspace-service-instance/workspace-service-instance-list'
import { WorkspaceServiceInstanceUpdate } from '@/domain/use-cases/workspace-service-instance/workspace-service-instance-update'

const getRepository = () => {
  const dataSource = new WorkspaceServiceInstanceDataSourceImpl(
    env('NEXT_PUBLIC_API_URL') || ''
  )
  return new WorkspaceServiceInstanceRepositoryImpl(dataSource)
}

export async function workspaceServiceInstanceGet(
  id: string
): Promise<Result<WorkspaceServiceInstance>> {
  const useCase = new WorkspaceServiceInstanceGet(getRepository())
  return useCase.execute(id)
}

export async function workspaceServiceInstanceList(
  workspaceId: string
): Promise<Result<WorkspaceServiceInstance[]>> {
  const useCase = new WorkspaceServiceInstanceList(getRepository())
  return useCase.execute(workspaceId)
}

export async function workspaceServiceInstanceCreate(
  instance: WorkspaceServiceInstanceCreateType
): Promise<Result<WorkspaceServiceInstance>> {
  const useCase = new WorkspaceServiceInstanceCreate(getRepository())
  return useCase.execute(instance)
}

export async function workspaceServiceInstanceUpdate(
  instance: WorkspaceServiceInstanceUpdateType
): Promise<Result<WorkspaceServiceInstance>> {
  const useCase = new WorkspaceServiceInstanceUpdate(getRepository())
  return useCase.execute(instance)
}

export async function workspaceServiceInstanceDelete(
  id: string
): Promise<Result<string>> {
  const useCase = new WorkspaceServiceInstanceDelete(getRepository())
  return useCase.execute(id)
}
