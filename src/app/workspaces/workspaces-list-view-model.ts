'use server'

import { WorkspaceDataSourceImpl } from '@/data/data-source/chorus-api'
import { WorkspaceRepositoryImpl } from '~/data/repository'
import { WorkspacesList } from '~/domain/use-cases/workspace/workspaces-list'
import { cookies } from 'next/headers'
import { env } from '@/env'
import { WorkspaceLocalStorageDataSourceImpl } from '~/data/data-source/local-storage'

export async function workspacesListViewModel() {
  try {
    const session = cookies().get('session')?.value || ''
    const dataSource =
      env.DATA_SOURCE === 'local'
        ? await WorkspaceLocalStorageDataSourceImpl.getInstance(
            env.DATA_SOURCE_LOCAL_DIR
          )
        : new WorkspaceDataSourceImpl(session)
    const repository = new WorkspaceRepositoryImpl(dataSource)
    const useCase = new WorkspacesList(repository)

    return await useCase.execute()
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}
