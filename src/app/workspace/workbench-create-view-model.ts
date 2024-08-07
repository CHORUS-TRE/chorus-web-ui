'use server'

import { WorkbenchCreate } from '~/domain/use-cases/workbench/workbench-create'
import { WorkbenchRepositoryImpl } from '~/data/repository'
import { cookies } from 'next/headers'
import { WorkbenchCreateModel } from '~/domain/model'
import { env } from '@/env'
import { WorkbenchDataSource } from '~/data/data-source'
import { WorkbenchLocalStorageDataSourceImpl } from '~/data/data-source/local-storage'
import { WorkbenchDataSourceImpl } from '~/data/data-source/chorus-api/workbench-api-data-source-impl'

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

    const mockWorkbench: WorkbenchCreateModel = {
      name: 'Innovative Solutions Lab',
      description:
        'A collaborative space for developing cutting-edge biomedical solutions.',
      ownerId: 'user12345',
      memberIds: ['user23456', 'user34567', 'user45678'],
      tags: ['biomedical', 'innovation', 'collaboration', 'research'],
      workspaceId: 'workspace12345',
      appId: 'app12345',
      tenantId: 'tenant12345'
    }

    return await useCase.execute(mockWorkbench)
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}
