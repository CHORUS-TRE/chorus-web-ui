'use server'

import { cookies } from 'next/headers'

import { AppDataSourceImpl } from '~/data/data-source/chorus-api/app-api-data-source-impl'
import { AppRepositoryImpl } from '~/data/repository/app-repository-impl'
import { AppsResponse } from '~/domain/model'
import { AppList } from '~/domain/use-cases/app/app-list'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const getRepository = async () => {
  const session = cookies().get('session')?.value || ''
  const dataSource = new AppDataSourceImpl(session)

  return new AppRepositoryImpl(dataSource)
}

export async function appList(): Promise<AppsResponse> {
  try {
    const repository = await getRepository()
    const useCase = new AppList(repository)

    return await useCase.execute()
  } catch (error) {
    return { error: error.message }
  }
}
