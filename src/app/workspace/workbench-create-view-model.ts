'use server'

import { WorkbenchCreate } from '~/domain/use-cases/workbench/workbench-create'
import { WorkbenchRepositoryImpl } from '~/data/repository'
import { cookies } from 'next/headers'
import { WorkbenchCreateModel } from '~/domain/model'
import { env } from '@/env'
import { WorkbenchDataSource } from '~/data/data-source'
import { WorkbenchLocalStorageDataSourceImpl } from '~/data/data-source/local-storage'
import { WorkbenchDataSourceImpl } from '~/data/data-source/chorus-api/workbench-api-data-source-impl'
import { apps } from '~/data/data-source/local-storage/mocks'
export async function workbenchCreateViewModel() {
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

    return await useCase.execute(apps[Math.floor(Math.random() * 10)]!)
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}