'use client'

import {
  Result,
  Workbench,
  WorkbenchCreateSchema,
  WorkbenchCreateType,
  WorkbenchUpdateSchema,
  WorkbenchUpdateType
} from '@/domain/model/workbench'
import { WorkbenchDataSourceImpl } from '~/data/data-source'
import { WorkbenchRepositoryImpl } from '~/data/repository'
import { WorkbenchCreate } from '~/domain/use-cases/workbench/workbench-create'
import { WorkbenchDelete } from '~/domain/use-cases/workbench/workbench-delete'
import { WorkbenchGet } from '~/domain/use-cases/workbench/workbench-get'
import { WorkbenchList } from '~/domain/use-cases/workbench/workbench-list'
import { WorkbenchUpdate } from '~/domain/use-cases/workbench/workbench-update'

import { getSession } from './server/session'

const getRepository = async () => {
  const session = await getSession()
  const dataSource = new WorkbenchDataSourceImpl(session)
  return new WorkbenchRepositoryImpl(dataSource)
}

export async function workbenchDelete(id: string): Promise<Result<boolean>> {
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

export async function workbenchGet(id: string): Promise<Result<Workbench>> {
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
