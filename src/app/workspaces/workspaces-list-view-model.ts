'use server'

import { WorkspaceDataSourceImpl } from '@/data/data-source/api'
import { WorkspaceRepositoryImpl } from '~/data/repository'
import { WorkspacesList } from '~/domain/use-cases/workspace/workspaces-list'
import { cookies } from 'next/headers'

export async function workspacesListViewModel() {
  try {
    const session = cookies().get('session')?.value || ''
    const dataSource = new WorkspaceDataSourceImpl(session)
    const repository = new WorkspaceRepositoryImpl(dataSource)
    const useCase = new WorkspacesList(repository)

    return await useCase.execute()
  } catch (error: any) {
    throw new Error(error.message)
  }
}
