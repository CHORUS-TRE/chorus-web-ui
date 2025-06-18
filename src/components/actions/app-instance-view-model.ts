'use client'

import { AppInstanceDataSourceImpl } from '~/data/data-source'
import { AppInstanceRepositoryImpl } from '~/data/repository'
import { Result } from '~/domain/model'
import {
  AppInstance,
  AppInstanceCreateSchema,
  AppInstanceUpdateSchema
} from '~/domain/model/app-instance'
import { AppInstanceCreate } from '~/domain/use-cases/app-instance/app-instance-create'
import { AppInstanceDelete } from '~/domain/use-cases/app-instance/app-instance-delete'
import { AppInstanceGet } from '~/domain/use-cases/app-instance/app-instance-get'
import { AppInstanceList } from '~/domain/use-cases/app-instance/app-instance-list'
import { AppInstanceUpdate } from '~/domain/use-cases/app-instance/app-instance-update'

import { getSession } from './server/session'

const getRepository = async () => {
  const session = await getSession()
  const dataSource = new AppInstanceDataSourceImpl(session)

  return new AppInstanceRepositoryImpl(dataSource)
}

export async function createAppInstance(
  prevState: Result<AppInstance>,
  formData: FormData
): Promise<Result<AppInstance>> {
  try {
    const repository = await getRepository()
    const useCase = new AppInstanceCreate(repository)

    const raw = {
      tenantId: formData.get('tenantId') as string,
      userId: formData.get('userId') as string,
      appId: formData.get('appId') as string,
      workspaceId: formData.get('workspaceId') as string,
      workbenchId: formData.get('workbenchId') as string,
      status: formData.get('status') as string
    }

    const validation = AppInstanceCreateSchema.safeParse(raw)
    if (!validation.success) {
      return {
        ...prevState,
        issues: validation.error.issues
      }
    }

    const result = await useCase.execute(validation.data)

    if (result.error) {
      return { ...prevState, error: result.error }
    }
    return {
      ...prevState,
      data: result.data
    }
  } catch (error) {
    return {
      ...prevState,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

export async function getAppInstance(id: string) {
  const repository = await getRepository()
  const useCase = new AppInstanceGet(repository)
  return await useCase.execute(id)
}

export async function listAppInstances() {
  const repository = await getRepository()
  const useCase = new AppInstanceList(repository)
  return await useCase.execute()
}

export async function deleteAppInstance(id: string, workspaceId: string) {
  const repository = await getRepository()
  const useCase = new AppInstanceDelete(repository)
  const result = await useCase.execute(id)

  return result
}

export async function updateAppInstance(
  prevState: Result<AppInstance>,
  formData: FormData
): Promise<Result<AppInstance>> {
  try {
    const repository = await getRepository()
    const useCase = new AppInstanceUpdate(repository)

    const raw = {
      id: formData.get('id') as string,
      tenantId: formData.get('tenantId') as string,
      userId: formData.get('userId') as string,
      appId: formData.get('appId') as string,
      workspaceId: formData.get('workspaceId') as string,
      workbenchId: formData.get('workbenchId') as string,
      status: formData.get('status') as string
    }

    const validation = AppInstanceUpdateSchema.safeParse(raw)
    if (!validation.success) {
      return {
        ...prevState,
        issues: validation.error.issues
      }
    }

    return await useCase.execute(validation.data)
  } catch (error) {
    return {
      ...prevState,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}
