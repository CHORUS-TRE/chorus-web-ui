'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { env } from '@/env'

import { AppInstanceDataSourceImpl } from '~/data/data-source/chorus-api/app-instance-api-data-source-impl'
import { AppInstanceRepositoryImpl } from '~/data/repository'
import { AppInstanceCreateModel, AppInstanceResponse } from '~/domain/model'
import { AppInstanceCreateSchema } from '~/domain/model/app-instance'
import { AppInstanceCreate } from '~/domain/use-cases/app-instance/app-instance-create'
import { AppInstanceGet } from '~/domain/use-cases/app-instance/app-instance-get'

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

    revalidatePath(
      `/workspaces/${formData.get('workspaceId')}/${formData.get('workbenchId')}`
    )

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
