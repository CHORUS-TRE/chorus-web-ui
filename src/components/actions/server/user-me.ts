'use server'

import { cookies } from 'next/headers'
import { env } from 'next-runtime-env'

import { UserApiDataSourceImpl } from '~/data/data-source'
import { UserRepositoryImpl } from '~/data/repository'
import { UserMe } from '~/domain/use-cases/user/user-me'

const getRepository = async () => {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value || ''
  const dataSource = new UserApiDataSourceImpl(session)

  return new UserRepositoryImpl(dataSource)
}

export async function userMe() {
  const userRepository = await getRepository()
  const useCase = new UserMe(userRepository)
  const user = await useCase.execute()

  if (user?.data) {
    return {
      ...(user.data as User),
      workspaceId:
        env('NEXT_PUBLIC_ALBERT_WORKSPACE_ID') ||
        localStorage.getItem('NEXT_PUBLIC_ALBERT_WORKSPACE_ID') ||
        undefined
    }
  }
}
