'use server'

import { cookies } from 'next/headers'

import { env } from '@/env'

import { UserApiDataSourceImpl } from '~/data/data-source/chorus-api'
import { UserLocalStorageDataSourceImpl } from '~/data/data-source/local-storage/user-local-storage-data-source-impl'
import { UserRepositoryImpl } from '~/data/repository'
import { UserResponse } from '~/domain/model'
import { UserCreateSchema } from '~/domain/model/user'
import { UserCreate } from '~/domain/use-cases/user/user-create'
import { UserMe } from '~/domain/use-cases/user/user-me'

import { IFormState } from './utils'

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
  prevState: IFormState,
  formData: FormData
): Promise<IFormState> {
  try {
    const dataSource =
      env.DATA_SOURCE === 'local'
        ? await UserLocalStorageDataSourceImpl.getInstance(
            env.DATA_SOURCE_LOCAL_DIR
          )
        : new UserApiDataSourceImpl('')
    const userRepository = new UserRepositoryImpl(dataSource)
    const useCase = new UserCreate(userRepository)

    const user = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string
    }

    const validation = UserCreateSchema.safeParse(user)
    if (!validation.success) {
      return { issues: validation.error.issues }
    }

    const nextUser = UserCreateSchema.parse(user)
    const u = await useCase.execute(nextUser)

    return { data: nextUser.email, error: u.error }
  } catch (error) {
    return { error: error.message }
  }
}
