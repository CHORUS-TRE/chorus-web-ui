'use server'

import { UserApiDataSourceImpl } from '@/data/data-source/api'
import { UserRepositoryImpl } from '~/data/repository'
import { UserMe } from '~/domain/use-cases/user/user-me'
import { cookies } from 'next/headers'

export async function userMeViewModel() {
  try {
    const session = cookies().get('session')?.value || ''
    const userDataSource = new UserApiDataSourceImpl(session)
    const userRepository = new UserRepositoryImpl(userDataSource)
    const useCase = new UserMe(userRepository)

    return await useCase.execute()
  } catch (error: any) {
    throw new Error(error.message)
  }
}
