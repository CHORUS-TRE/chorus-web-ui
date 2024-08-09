'use server'

import { env } from '@/env'
import { cookies } from 'next/headers'
import { WorkbenchDataSourceImpl } from '~/data/data-source/chorus-api/workbench-api-data-source-impl'
import { WorkbenchLocalStorageDataSourceImpl } from '~/data/data-source/local-storage'
import { workbenches } from '~/data/data-source/local-storage/mocks'
import { WorkbenchRepositoryImpl } from '~/data/repository'
import {
  WorkbenchDeleteResponse,
  WorkbenchesResponse,
  WorkbenchResponse
} from '~/domain/model'
import { WorkbenchCreate } from '~/domain/use-cases/workbench/workbench-create'
import { WorkbenchDelete } from '~/domain/use-cases/workbench/workbench-delete'
import { WorkbenchList } from '~/domain/use-cases/workbench/workbench-list'

export async function workbenchDelete(
  id?: string
): Promise<WorkbenchDeleteResponse> {
  try {
    // const id = formData.get('id') as string
    if (!id) {
      console.error('No id provided', id)
      return { error: 'No id provided' }
    }

    const session = cookies().get('session')?.value || ''
    const dataSource =
      env.DATA_SOURCE === 'local'
        ? await WorkbenchLocalStorageDataSourceImpl.getInstance(
            env.DATA_SOURCE_LOCAL_DIR
          )
        : new WorkbenchDataSourceImpl(session)
    const repository = new WorkbenchRepositoryImpl(dataSource)
    const useCase = new WorkbenchDelete(repository)

    return await useCase.execute(id)
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function workbenchCreate(
  formData: FormData
): Promise<WorkbenchResponse> {
  try {
    const session = cookies().get('session')?.value || ''
    const dataSource =
      env.DATA_SOURCE === 'local'
        ? await WorkbenchLocalStorageDataSourceImpl.getInstance(
            env.DATA_SOURCE_LOCAL_DIR
          )
        : new WorkbenchDataSourceImpl(session)

    const repository = new WorkbenchRepositoryImpl(dataSource)
    const useCase = new WorkbenchCreate(repository)

    return await useCase.execute(
      workbenches[Math.floor(Math.random() * workbenches.length)]!
    )
  } catch (error: any) {
    console.error('Error creating workbench', error)
    return { error: error.message }
  }
}

export async function workbenchList(): Promise<WorkbenchesResponse> {
  try {
    const session = cookies().get('session')?.value || ''
    const dataSource =
      env.DATA_SOURCE === 'local'
        ? await WorkbenchLocalStorageDataSourceImpl.getInstance(
            env.DATA_SOURCE_LOCAL_DIR
          )
        : new WorkbenchDataSourceImpl(session)
    const repository = new WorkbenchRepositoryImpl(dataSource)
    const useCase = new WorkbenchList(repository)

    return await useCase.execute()
  } catch (error: any) {
    return { error: error.message }
  }
}
