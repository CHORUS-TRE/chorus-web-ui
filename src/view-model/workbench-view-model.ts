'use client'

import { env } from 'next-runtime-env'

import {
  Workbench,
  WorkbenchCreateSchema,
  WorkbenchCreateType,
  WorkbenchUpdateSchema,
  WorkbenchUpdateType
} from '@/domain/model/workbench'
import { WorkbenchDataSourceImpl } from '~/data/data-source'
import { WorkbenchRepositoryImpl } from '~/data/repository'
import { Result } from '~/domain/model'
import { User } from '~/domain/model/user'
import { WorkbenchCreate } from '~/domain/use-cases/workbench/workbench-create'
import { WorkbenchDelete } from '~/domain/use-cases/workbench/workbench-delete'
import { WorkbenchGet } from '~/domain/use-cases/workbench/workbench-get'
import { WorkbenchList } from '~/domain/use-cases/workbench/workbench-list'
import { WorkbenchStreamProbe } from '~/domain/use-cases/workbench/workbench-stream-probe'
import { WorkbenchStreamUrl } from '~/domain/use-cases/workbench/workbench-stream-url'
import { WorkbenchUpdate } from '~/domain/use-cases/workbench/workbench-update'
import { FetchError, ResponseError } from '~/internal/client/runtime'

const getRepository = async () => {
  const dataSource = new WorkbenchDataSourceImpl(
    env('NEXT_PUBLIC_API_URL') || ''
  )
  return new WorkbenchRepositoryImpl(dataSource)
}

export async function workbenchStreamUrl(id: string): Promise<Result<string>> {
  try {
    const repository = await getRepository()
    const useCase = new WorkbenchStreamUrl(repository)
    return await useCase.execute(id)
  } catch (error) {
    console.error('Error getting workbench stream url', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workbenchStreamProbe(
  id: string
): Promise<Result<boolean>> {
  try {
    const repository = await getRepository()
    const useCase = new WorkbenchStreamProbe(repository)

    const result = await useCase.execute(id)

    return { data: result.data ? true : false, error: result.error }
  } catch (error) {
    if (error instanceof ResponseError) {
      // Handle HTTP errors like 502, 404, etc.
      return {
        error: `API Error: ${error.response.status}`
      }
    }
    if (error instanceof FetchError) {
      // Handle network errors, including CORS issues
      return {
        error: `Network Error: ${error.message}. Check browser console for CORS details.`
      }
    }
    console.error('Error probing workbench stream', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workbenchDelete(id: string): Promise<Result<string>> {
  try {
    if (!id) {
      throw new Error('Invalid workbench id')
    }
    const repository = await getRepository()
    const useCase = new WorkbenchDelete(repository)
    return await useCase.execute(id)
  } catch (error) {
    console.error('Error deleting workbench', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workbenchCreate(
  prevState: Result<Workbench>,
  formData: FormData
): Promise<Result<Workbench>> {
  try {
    const repository = await getRepository()
    const useCase = new WorkbenchCreate(repository)

    const rawData = Object.fromEntries(formData.entries())
    const workbench: WorkbenchCreateType = {
      ...rawData,
      initialResolutionWidth: Number(rawData.initialResolutionWidth),
      initialResolutionHeight: Number(rawData.initialResolutionHeight)
    } as WorkbenchCreateType

    const validation = WorkbenchCreateSchema.safeParse(workbench)

    if (!validation.success) {
      return {
        ...prevState,
        issues: validation.error.issues
      }
    }

    return await useCase.execute(validation.data)
  } catch (error) {
    console.error('Error creating workbench', error)
    return {
      ...prevState,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

export async function workbenchList(): Promise<Result<Workbench[]>> {
  try {
    const repository = await getRepository()
    const useCase = new WorkbenchList(repository)
    return await useCase.execute()
  } catch (error) {
    console.error('Error listing workbenches', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function getWorkbench(id: string): Promise<Result<Workbench>> {
  try {
    const repository = await getRepository()
    const useCase = new WorkbenchGet(repository)
    return await useCase.execute(id)
  } catch (error) {
    console.error('Error getting workbench', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workbenchUpdate(
  prevState: Result<Workbench>,
  formData: FormData
): Promise<Result<Workbench>> {
  try {
    const repository = await getRepository()
    const useCase = new WorkbenchUpdate(repository)

    const rawData = Object.fromEntries(formData.entries())
    const workbench: WorkbenchUpdateType = {
      ...rawData,
      initialResolutionWidth: Number(rawData.initialResolutionWidth),
      initialResolutionHeight: Number(rawData.initialResolutionHeight)
    } as WorkbenchUpdateType

    const validation = WorkbenchUpdateSchema.safeParse(workbench)

    if (!validation.success) {
      return { issues: validation.error.issues }
    }

    return await useCase.execute(validation.data)
  } catch (error) {
    console.error('Error updating workbench', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workbenchAddUserRole(
  prevState: Result<User>,
  formData: FormData
): Promise<Result<User>> {
  try {
    const repository = await getRepository()

    const workbenchId = formData.get('workbenchId') as string
    const userId = formData.get('userId') as string
    const roleName = formData.get('roleName') as string

    if (!workbenchId || !userId || !roleName) {
      return {
        error: 'Missing required fields: workbenchId, userId, or roleName'
      }
    }

    return await repository.addUserRole(workbenchId, userId, roleName)
  } catch (error) {
    console.error('Error adding user role to workbench', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workbenchRemoveUserRole(
  prevState: Result<User>,
  formData: FormData
): Promise<Result<User>> {
  try {
    const repository = await getRepository()

    const workbenchId = formData.get('workbenchId') as string
    const userId = formData.get('userId') as string

    if (!workbenchId || !userId) {
      return {
        error: 'Missing required fields: workbenchId, userId'
      }
    }

    return await repository.removeUserFromWorkbench(workbenchId, userId)
  } catch (error) {
    console.error('Error adding user role to workbench', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
