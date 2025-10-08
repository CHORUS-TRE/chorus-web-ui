'use client'

import { env } from 'next-runtime-env'

import { AppDataSourceImpl } from '~/data/data-source'
import { AppRepositoryImpl } from '~/data/repository/app-repository-impl'
import {
  AppCreateSchema,
  AppCreateType,
  AppUpdateSchema,
  Result
} from '~/domain/model'
import { App, AppUpdateType } from '~/domain/model/app'
import { AppCreate as AppCreateUseCase } from '~/domain/use-cases/app/app-create'
import { AppDelete } from '~/domain/use-cases/app/app-delete'
import { AppGet } from '~/domain/use-cases/app/app-get'
import { AppList } from '~/domain/use-cases/app/app-list'
import { AppUpdate } from '~/domain/use-cases/app/app-update'

const getRepository = async () => {
  const dataSource = new AppDataSourceImpl(env('NEXT_PUBLIC_API_URL') || '')
  return new AppRepositoryImpl(dataSource)
}

export async function appGet(id: string): Promise<Result<App>> {
  try {
    const repository = await getRepository()
    const useCase = new AppGet(repository)
    return await useCase.execute(id)
  } catch (error) {
    console.error('Error getting app', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function appList(): Promise<Result<App[]>> {
  const repository = await getRepository()
  const useCase = new AppList(repository)

  return await useCase.execute()
}

export async function appCreate(
  prevState: Result<App>,
  formData: FormData
): Promise<Result<App>> {
  const app = Object.fromEntries(formData.entries()) as AppCreateType

  const validation = AppCreateSchema.safeParse(app)

  if (!validation.success) {
    return { issues: validation.error.issues }
  }

  const repository = await getRepository()
  const useCase = new AppCreateUseCase(repository)

  return await useCase.execute(app)
}

export async function appUpdate(
  prevState: Result<App>,
  formData: FormData
): Promise<Result<App>> {
  try {
    const repository = await getRepository()
    const useCase = new AppUpdate(repository)

    const app: AppUpdateType = Object.fromEntries(
      formData.entries()
    ) as AppUpdateType

    const validation = AppUpdateSchema.safeParse(app)
    if (!validation.success) {
      return { issues: validation.error.issues }
    }

    return await useCase.execute(app)
  } catch (error) {
    console.error('Error updating app', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function appDelete(id: string): Promise<Result<string>> {
  try {
    const repository = await getRepository()
    const useCase = new AppDelete(repository)

    return await useCase.execute(id)
  } catch (error) {
    console.error('Error deleting app', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
