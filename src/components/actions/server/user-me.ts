'use server'

import { cookies } from 'next/headers'
import { env } from 'next-runtime-env'

import { UserApiDataSourceImpl } from '~/data/data-source'
import { UserRepositoryImpl } from '~/data/repository'
import { Result } from '~/domain/model'
import { User } from '~/domain/model/user'
import { UserMe } from '~/domain/use-cases/user/user-me'

const getRepository = async () => {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value || ''
  const dataSource = new UserApiDataSourceImpl(session)

  return new UserRepositoryImpl(dataSource)
}

export async function userMe(): Promise<Result<User> | undefined> {
  const userRepository = await getRepository()
  const useCase = new UserMe(userRepository)
  const user = await useCase.execute()

  if (user?.data) {
    return {
      data: {
        ...(user.data as User),
        workspaceId:
          env('NEXT_PUBLIC_ALBERT_WORKSPACE_ID') ||
          localStorage.getItem('NEXT_PUBLIC_ALBERT_WORKSPACE_ID') ||
          undefined
      }
    }
  }
}
