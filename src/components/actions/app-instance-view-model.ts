'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { AppInstanceDataSourceImpl } from '~/data/data-source/chorus-api/app-instance-api-data-source-impl'
import { AppInstanceRepositoryImpl } from '~/data/repository'
import {
  AppInstance,
  AppInstanceCreateModel,
  AppInstanceResponse,
  AppInstanceUpdateModel
} from '~/domain/model'
import { AppInstanceCreateSchema } from '~/domain/model/app-instance'
import { AppInstanceCreate } from '~/domain/use-cases/app-instance/app-instance-create'
import { AppInstanceDelete } from '~/domain/use-cases/app-instance/app-instance-delete'
import { AppInstanceGet } from '~/domain/use-cases/app-instance/app-instance-get'
import { AppInstanceList } from '~/domain/use-cases/app-instance/app-instance-list'
import { AppInstanceUpdate } from '~/domain/use-cases/app-instance/app-instance-update'

import { IFormState } from './utils'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const getRepository = async () => {
  const session = cookies().get('session')?.value || ''
  const dataSource = new AppInstanceDataSourceImpl(session)

  return new AppInstanceRepositoryImpl(dataSource)
}

export async function appInstanceCreate(
  prevState: IFormState,
  formData: FormData
): Promise<IFormState> {
  try {
    const repository = await getRepository()
    const useCase = new AppInstanceCreate(repository)

    const appInstance: AppInstanceCreateModel = {
      appId: formData.get('id') as string,
      tenantId: formData.get('tenantId') as string,
      ownerId: formData.get('ownerId') as string,
      workspaceId: formData.get('workspaceId') as string,
      workbenchId: formData.get('workbenchId') as string,
      status: 'active'
    }

    const validation = AppInstanceCreateSchema.safeParse(appInstance)

    if (!validation.success) {
      return { issues: validation.error.issues }
    }

    const nextAppInstance = AppInstanceCreateSchema.parse(appInstance)
    const createdAppInstance = await useCase.execute(nextAppInstance)

    if (createdAppInstance.error) {
      return { error: createdAppInstance.error }
    }

    return {
      ...prevState,
      data: 'Successfully created appInstance',
      error: createdAppInstance.error
    }
  } catch (error) {
    console.error('Error creating appInstance', error)
    return { error: error.message }
  }
}

export async function appInstanceGet(id: string): Promise<AppInstanceResponse> {
  try {
    const repository = await getRepository()
    const useCase = new AppInstanceGet(repository)

    return await useCase.execute(id)
  } catch (error) {
    return { error: error.message }
  }
}

export async function appInstanceDelete(
  prevState: IFormState,
  formData: FormData
): Promise<IFormState> {
  try {
    const id = formData.get('id') as string
    if (!id) throw new Error('Invalid app instance id')

    const repository = await getRepository()
    const useCase = new AppInstanceDelete(repository)

    const r = await useCase.execute(id)
    if (r.error) return { error: r.error }

    revalidatePath(
      `/workspaces/${formData.get('workspaceId')}/${formData.get('workbenchId')}`
    )
    return { data: 'Successfully deleted app instance' }
  } catch (error) {
    console.error(error)
    return { error: error.message }
  }
}

export async function appInstanceUpdate(
  prevState: IFormState,
  formData: FormData
): Promise<IFormState> {
  try {
    const repository = await getRepository()
    const useCase = new AppInstanceUpdate(repository)

    const appInstance: AppInstanceUpdateModel = {
      id: formData.get('id') as string,
      appId: formData.get('appId') as string,
      tenantId: formData.get('tenantId') as string,
      ownerId: formData.get('ownerId') as string,
      workspaceId: formData.get('workspaceId') as string,
      workbenchId: formData.get('workbenchId') as string,
      status: 'active'
    }

    const r = await useCase.execute(appInstance)
    if (r.error) return { error: r.error }

    revalidatePath(
      `/workspaces/${formData.get('workspaceId')}/${formData.get('workbenchId')}`
    )
    return { data: 'Successfully updated app instance' }
  } catch (error) {
    console.error(error)
    return { error: error.message }
  }
}

export async function appInstanceList(): Promise<AppInstance[]> {
  try {
    const repository = await getRepository()
    const useCase = new AppInstanceList(repository)

    const r = await useCase.execute()
    if (r.error) return []

    return r.data || []
  } catch (error) {
    console.error(error)
    return []
  }
}
