'use server'

import { cookies } from 'next/headers'

import { env } from '@/env'

import { UserApiDataSourceImpl } from '~/data/data-source/chorus-api'
import { UserLocalStorageDataSourceImpl } from '~/data/data-source/local-storage/user-local-storage-data-source-impl'
import { UserRepositoryImpl } from '~/data/repository'
import { UserResponse } from '~/domain/model'
import { UserCreate } from '~/domain/use-cases/user/user-create'
import { UserMe } from '~/domain/use-cases/user/user-me'

export async function userMe(): Promise<UserResponse> {
  try {
    const session = cookies().get('session')?.value || ''
    const dataSource =
      env.DATA_SOURCE === 'local'
        ? await UserLocalStorageDataSourceImpl.getInstance(
            env.DATA_SOURCE_LOCAL_DIR
          )
        : new UserApiDataSourceImpl(session)
    const userRepository = new UserRepositoryImpl(dataSource)
    const useCase = new UserMe(userRepository)

    return await useCase.execute()
  } catch (error) {
    return { error: error.message }
  }
}

export async function userCreate(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  formData: FormData
): Promise<UserResponse> {
  try {
    const dataSource =
      env.DATA_SOURCE === 'local'
        ? await UserLocalStorageDataSourceImpl.getInstance(
            env.DATA_SOURCE_LOCAL_DIR
          )
        : new UserApiDataSourceImpl('')
    const userRepository = new UserRepositoryImpl(dataSource)
    const useCase = new UserCreate(userRepository)

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    return await useCase.execute({ email, password })
  } catch (error) {
    return { error: error.message }
  }
}
