'use client'

import { AppDataSourceImpl } from '~/data/data-source/chorus-api/app-data-source'
import { AppRepositoryImpl } from '~/data/repository/app-repository-impl'
import { AppCreateSchema, AppCreateType, Result } from '~/domain/model'
import { App, AppUpdateType } from '~/domain/model/app'
import { AppCreate as AppCreateUseCase } from '~/domain/use-cases/app/app-create'
import { AppDelete } from '~/domain/use-cases/app/app-delete'
import { AppGet } from '~/domain/use-cases/app/app-get'
import { AppList } from '~/domain/use-cases/app/app-list'
import { AppUpdate } from '~/domain/use-cases/app/app-update'

import { getCookie } from './server-cookie'
import { IFormState } from './utils'

const getRepository = async () => {
  const session = await getCookie()
  const dataSource = new AppDataSourceImpl(session)
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
  prevState: IFormState,
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
  prevState: IFormState,
  formData: FormData
): Promise<IFormState> {
  try {
    const repository = await getRepository()
    const useCase = new AppUpdate(repository)

    const app: AppUpdateType = Object.fromEntries(
      formData.entries()
    ) as AppUpdateType

    const validation = AppCreateSchema.safeParse(app)
    if (!validation.success) {
      return { issues: validation.error.issues }
    }

    const updatedApp = await useCase.execute(app)
    if (updatedApp.error) {
      return { error: updatedApp.error }
    }

    return {
      data: 'Successfully updated app',
      error: undefined
    }
  } catch (error) {
    console.error('Error updating app', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function appDelete(id: string): Promise<IFormState> {
  try {
    const repository = await getRepository()
    const useCase = new AppDelete(repository)

    const result = await useCase.execute(id)
    if (result.error) {
      return { error: result.error }
    }

    return {
      data: 'Successfully deleted app',
      error: undefined
    }
  } catch (error) {
    console.error('Error deleting app', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
