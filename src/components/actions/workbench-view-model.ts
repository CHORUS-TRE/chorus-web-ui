'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { env } from '@/env'

import { WorkbenchDataSourceImpl } from '~/data/data-source/chorus-api/workbench-api-data-source-impl'
import { WorkbenchLocalStorageDataSourceImpl } from '~/data/data-source/local-storage'
import { WorkbenchRepositoryImpl } from '~/data/repository'
import {
  WorkbenchCreate as WorkbenchCreateModel,
  WorkbenchesResponse,
  WorkbenchResponse
} from '~/domain/model'
import { WorkbenchCreateSchema } from '~/domain/model/workbench'
import { WorkbenchCreate } from '~/domain/use-cases/workbench/workbench-create'
import { WorkbenchDelete } from '~/domain/use-cases/workbench/workbench-delete'
import { WorkbenchGet } from '~/domain/use-cases/workbench/workbench-get'
import { WorkbenchList } from '~/domain/use-cases/workbench/workbench-list'

import { appInstanceCreate } from './app-instance-view-model'
import { IFormState } from './utils'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const getRepository = async () => {
  const session = cookies().get('session')?.value || ''
  const dataSource =
    env.DATA_SOURCE === 'local'
      ? await WorkbenchLocalStorageDataSourceImpl.getInstance(
          env.DATA_SOURCE_LOCAL_DIR
        )
      : new WorkbenchDataSourceImpl(session)

  return new WorkbenchRepositoryImpl(dataSource)
}

export async function workbenchDelete(
  prevState: IFormState,
  formData: FormData
): Promise<IFormState> {
  try {
    const id = formData.get('id') as string

    if (!id) {
      throw new Error('Invalid workbench id')
    }

    const repository = await getRepository()
    const useCase = new WorkbenchDelete(repository)

    const r = await useCase.execute(id)
    if (r.error) {
      return { error: r.error }
    }

    revalidatePath('/')

    return { data: 'Successfully deleted workbench' }
  } catch (error) {
    return { error: error.message }
  }
}

export async function workbenchCreate(
  prevState: IFormState,
  formData: FormData
): Promise<IFormState> {
  try {
    const repository = await getRepository()
    const useCase = new WorkbenchCreate(repository)

    const workbench: WorkbenchCreateModel = {
      name: formData.get('id') as string,
      tenantId: formData.get('tenantId') as string,
      ownerId: formData.get('ownerId') as string,
      description: formData.get('description') as string,
      memberIds: formData.getAll('memberIds') as string[],
      tags: formData.getAll('tags') as string[],
      workspaceId: formData.get('workspaceId') as string
    }

    const validation = WorkbenchCreateSchema.safeParse(workbench)

    if (!validation.success) {
      return { issues: validation.error.issues }
    }

    const nextWorkbench = WorkbenchCreateSchema.parse(workbench)
    const createdWorkbench = await useCase.execute(nextWorkbench)

    await delay(5 * 1000)

    if (createdWorkbench.error) {
      return { error: createdWorkbench.error }
    }

    revalidatePath(`/workspaces/${formData.get('workspaceId')}`)

    const appId = formData.get('id') as string

    const appFormData = new FormData()
    appFormData.set('tenantId', workbench.tenantId)
    appFormData.set('ownerId', workbench.ownerId)
    appFormData.set('id', appId)
    appFormData.set('workspaceId', workbench.workspaceId)
    appFormData.set('workbenchId', createdWorkbench?.data?.id || '')

    await appInstanceCreate(prevState, appFormData)

    return {
      ...prevState,
      data: 'Successfully created workbench',
      error: createdWorkbench.error
    }
  } catch (error) {
    console.error('Error creating workbench', error)
    return { error: error.message }
  }
}

export async function workbenchList(): Promise<WorkbenchesResponse> {
  try {
    const repository = await getRepository()
    const useCase = new WorkbenchList(repository)

    return await useCase.execute()
  } catch (error) {
    return { error: error.message }
  }
}

export async function workbenchGet(id: string): Promise<WorkbenchResponse> {
  try {
    const repository = await getRepository()
    const useCase = new WorkbenchGet(repository)

    return await useCase.execute(id)
  } catch (error) {
    return { error: error.message }
  }
}
