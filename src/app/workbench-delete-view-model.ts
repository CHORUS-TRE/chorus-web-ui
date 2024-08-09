'use server'

import { WorkbenchRepositoryImpl } from '~/data/repository'
import { WorkbenchDelete } from '~/domain/use-cases/workbench/workbench-delete'
import { cookies } from 'next/headers'
import { env } from '@/env'
import { WorkbenchLocalStorageDataSourceImpl } from '~/data/data-source/local-storage'
import { WorkbenchDataSourceImpl } from '~/data/data-source/chorus-api/workbench-api-data-source-impl'

export async function workbenchDeleteViewModel(id: string) {
  try {
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
    return { data: null, error: error.message }
  }
}
