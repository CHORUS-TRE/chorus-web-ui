'use server'

import { UserRepositoryImpl } from '~/data/repository'
import { UserCreateModel } from '~/domain/model'
import { cookies } from 'next/headers'
import { UserApiDataSourceImpl } from '~/data/data-source/chorus-api'
import { env } from '@/env'
import { UserLocalStorageDataSourceImpl } from '~/data/data-source/local-storage/user-local-storage-data-source-impl'
import { UserCreate } from '~/domain/use-cases/user/user-create'

export async function userCreateViewModel(prevState: any, formData: FormData) {
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

    const u = await useCase.execute({ email, password })
    // console.log(u.error)
    return u
  } catch (error: any) {
    console.log(error)
    return { data: null, error: error.message }
  }
}
