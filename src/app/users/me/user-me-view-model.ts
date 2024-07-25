'use client'

import { UserApiDataSourceImpl } from '@/data/data-source/api'
import { UserRepositoryImpl } from '~/data/repository'
import { UserMe } from '~/domain/use-cases/user/user-me'

export function userMeViewModel() {
  const userDataSource = new UserApiDataSourceImpl()
  const userRepository = new UserRepositoryImpl(userDataSource)
  const useCase = new UserMe(userRepository)

  const me = async () => {
    return await useCase.execute()
  }

  return { me }
}
