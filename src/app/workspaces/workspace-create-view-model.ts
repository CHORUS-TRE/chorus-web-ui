'use server'

import { WorkspaceCreate } from '~/domain/use-cases'
import { WorkspaceDataSourceImpl } from '@/data/data-source/chorus-api'
import { WorkspaceRepositoryImpl } from '~/data/repository'
import { cookies } from 'next/headers'
import { env } from '@/env'
import { WorkspaceLocalStorageDataSourceImpl } from '~/data/data-source/local-storage'
import { workspaces } from '~/data/data-source/local-storage/mocks'

export async function workspaceCreateViewModel() {
  try {
    const session = cookies().get('session')?.value || ''
    const dataSource =
      env.DATA_SOURCE === 'local'
        ? await WorkspaceLocalStorageDataSourceImpl.getInstance(
            env.DATA_SOURCE_LOCAL_DIR
          )
        : new WorkspaceDataSourceImpl(session)
    const repository = new WorkspaceRepositoryImpl(dataSource)
    const useCase = new WorkspaceCreate(repository)

    return await useCase.execute(workspaces[Math.floor(Math.random() * 10)]!)
  } catch (error: any) {
    console.error(error)
    return { data: null, error: error.message }
  }
}
