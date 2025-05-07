'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { AppDataSourceImpl } from '~/data/data-source/chorus-api/app-api-data-source-impl'
import { AppRepositoryImpl } from '~/data/repository/app-repository-impl'
import { AppCreate, AppResponse, AppsResponse } from '~/domain/model'
import { AppType } from '~/domain/model/app'
import { AppCreate as AppCreateUseCase } from '~/domain/use-cases/app/app-create'
import { AppDelete } from '~/domain/use-cases/app/app-delete'
import { AppGet } from '~/domain/use-cases/app/app-get'
import { AppList } from '~/domain/use-cases/app/app-list'
import { AppUpdate } from '~/domain/use-cases/app/app-update'

import { AppCreateSchema } from './app-schema'
import { IFormState } from './utils'

const getRepository = async () => {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value || ''
  const dataSource = new AppDataSourceImpl(session)
  return new AppRepositoryImpl(dataSource)
}

export async function appList(): Promise<AppsResponse> {
  try {
    const repository = await getRepository()
    const useCase = new AppList(repository)
    return await useCase.execute()
  } catch (error) {
    console.error('Error listing apps', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function appCreate(
  prevState: IFormState,
  formData: FormData
): Promise<IFormState> {
  try {
    const repository = await getRepository()
    const useCase = new AppCreateUseCase(repository)

    const app: AppCreate = {
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || '',
      iconURL: (formData.get('iconURL') as string) || '',
      tenantId: formData.get('tenantId') as string,
      ownerId: formData.get('ownerId') as string,
      dockerImageRegistry:
        (formData.get('dockerImageRegistry') as string) || '',
      dockerImageName: formData.get('dockerImageName') as string,
      dockerImageTag: formData.get('dockerImageTag') as string,
      type: formData.get('type') === 'service' ? AppType.SERVICE : AppType.APP,
      shmSize: (formData.get('shmSize') as string) || '',
      minEphemeralStorage:
        (formData.get('minEphemeralStorage') as string) || '',
      maxEphemeralStorage:
        (formData.get('maxEphemeralStorage') as string) || '',
      kioskConfigURL: (formData.get('kioskConfigURL') as string) || '',
      maxCPU: (formData.get('maxCPU') as string) || '',
      minCPU: (formData.get('minCPU') as string) || '',
      maxMemory: (formData.get('maxMemory') as string) || '',
      minMemory: (formData.get('minMemory') as string) || ''
    }

    const validation = AppCreateSchema.safeParse(app)
    if (!validation.success) {
      return { issues: validation.error.issues }
    }

    const createdApp = await useCase.execute(app)

    if (createdApp.error) {
      return { error: createdApp.error }
    }

    revalidatePath('/app-store')
    return {
      data: 'Successfully created app',
      error: undefined
    }
  } catch (error) {
    console.error('Error creating app', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function appUpdate(
  prevState: IFormState,
  formData: FormData
): Promise<IFormState> {
  try {
    const repository = await getRepository()
    const useCase = new AppUpdate(repository)

    const app: AppCreate & { id: string } = {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || '',
      iconURL: (formData.get('iconURL') as string) || '',
      tenantId: formData.get('tenantId') as string,
      ownerId: formData.get('ownerId') as string,
      dockerImageRegistry:
        (formData.get('dockerImageRegistry') as string) || '',
      dockerImageName: formData.get('dockerImageName') as string,
      dockerImageTag: formData.get('dockerImageTag') as string,
      type: formData.get('type') === 'service' ? AppType.SERVICE : AppType.APP,
      shmSize: (formData.get('shmSize') as string) || '',
      minEphemeralStorage:
        (formData.get('minEphemeralStorage') as string) || '',
      maxEphemeralStorage:
        (formData.get('maxEphemeralStorage') as string) || '',
      kioskConfigURL: (formData.get('kioskConfigURL') as string) || '',
      maxCPU: (formData.get('maxCPU') as string) || '',
      minCPU: (formData.get('minCPU') as string) || '',
      maxMemory: (formData.get('maxMemory') as string) || '',
      minMemory: (formData.get('minMemory') as string) || ''
    }

    const validation = AppCreateSchema.safeParse(app)
    if (!validation.success) {
      return { issues: validation.error.issues }
    }

    const updatedApp = await useCase.execute(app)
    if (updatedApp.error) {
      return { error: updatedApp.error }
    }

    revalidatePath('/app-store')
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

    revalidatePath('/app-store')
    return {
      data: 'Successfully deleted app',
      error: undefined
    }
  } catch (error) {
    console.error('Error deleting app', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function appGet(id: string): Promise<AppResponse> {
  try {
    const repository = await getRepository()
    const useCase = new AppGet(repository)
    return await useCase.execute(id)
  } catch (error) {
    console.error('Error getting app', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
