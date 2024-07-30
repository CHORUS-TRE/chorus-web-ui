'use server'

import { WorkspaceDataSourceImpl } from '@/data/data-source/api'
import { WorkspaceRepositoryImpl } from '~/data/repository'
import { WorkspaceGet } from '~/domain/use-cases/workspace/workspace-get'
import { cookies } from 'next/headers'

export async function workspaceGetViewModel(workspaceId: string) {
  try {
    const session = cookies().get('session')?.value || ''
    const dataSource = new WorkspaceDataSourceImpl(session)
    const repository = new WorkspaceRepositoryImpl(dataSource)
    const useCase = new WorkspaceGet(repository)

    return await useCase.execute(workspaceId)
  } catch (error: any) {
    throw new Error(error.message)
  }
}
