'use server'

import { WorkspaceRepositoryImpl } from '~/data/repository'
import { WorkspacesList } from '~/domain/use-cases/workspace/workspaces-list'
import { cookies } from 'next/headers'

export async function workspacesListViewModel() {
  try {
    const session = cookies().get('session')?.value || ''
    const repository = new WorkspaceRepositoryImpl(session)
    const useCase = new WorkspacesList(repository)

    return await useCase.execute()
  } catch (error: any) {
    throw new Error(error.message)
  }
}
