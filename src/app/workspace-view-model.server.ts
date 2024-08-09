'use server'

import { WorkspaceRepositoryImpl } from '~/data/repository'
import { WorkspaceDelete } from '@/domain/use-cases/workspace/workspace-delete'
import { cookies } from 'next/headers'
import { env } from '@/env'
import { WorkspaceLocalStorageDataSourceImpl } from '~/data/data-source/local-storage'
import { WorkspaceDataSourceImpl } from '~/data/data-source/chorus-api/workspace-api-data-source-impl'
import { WorkspacesList } from '~/domain/use-cases/workspace/workspaces-list'
import { WorkspaceCreate } from '~/domain/use-cases'
import { workspaces } from '~/data/data-source/local-storage/mocks'
import { WorkspaceGet } from '~/domain/use-cases/workspace/workspace-get'

export async function workspaceDelete(id: string) {
  try {
    if (!id) {
      throw new Error('Invalid workspace id')
    }

    const session = cookies().get('session')?.value || ''
    const dataSource =
      env.DATA_SOURCE === 'local'
        ? await WorkspaceLocalStorageDataSourceImpl.getInstance(
            env.DATA_SOURCE_LOCAL_DIR
          )
        : new WorkspaceDataSourceImpl(session)
    const repository = new WorkspaceRepositoryImpl(dataSource)
    const useCase = new WorkspaceDelete(repository)

    return await useCase.execute(id)
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export async function workspaceList() {
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

export async function workspaceCreate() {
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

export async function workspaceGet(workspaceId: string) {
  if (!workspaceId) {
    throw new Error('Invalid workspace id')
  }

  try {
    const session = cookies().get('session')?.value || ''
    const dataSource =
      env.DATA_SOURCE === 'local'
        ? await WorkspaceLocalStorageDataSourceImpl.getInstance(
            env.DATA_SOURCE_LOCAL_DIR
          )
        : new WorkspaceDataSourceImpl(session)

    const repository = new WorkspaceRepositoryImpl(dataSource)
    const useCase = new WorkspaceGet(repository)

    return await useCase.execute(workspaceId)
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}
