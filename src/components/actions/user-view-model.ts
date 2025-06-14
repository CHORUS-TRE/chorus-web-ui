'use server'

import { cookies } from 'next/headers'

import { UserApiDataSourceImpl } from '~/data/data-source/chorus-api'
import { UserRepositoryImpl } from '~/data/repository'
import { UserResponse } from '~/domain/model'
import { UserCreateSchema } from '~/domain/model/user'
import { UserCreate } from '~/domain/use-cases/user/user-create'
import { UserGet } from '~/domain/use-cases/user/user-get'
import { UserMe } from '~/domain/use-cases/user/user-me'

import { IFormState } from './utils'

const getRepository = async () => {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value || ''
  const dataSource = new UserApiDataSourceImpl(session)

  return new UserRepositoryImpl(dataSource)
}

export async function userMe(): Promise<UserResponse> {
  try {
    const userRepository = await getRepository()
    const useCase = new UserMe(userRepository)

    return await useCase.execute()
  } catch (error) {
    console.error('Error getting user', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function userCreate(
  prevState: IFormState,
  formData: FormData
): Promise<IFormState> {
  try {
    const userRepository = await getRepository()
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
    const result = await useCase.execute(nextUser)

    if (result.error) {
      return { error: result.error }
    }

    return { data: nextUser.email }
  } catch (error) {
    console.error('Error creating user', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function userGet(id: string): Promise<UserResponse> {
  try {
    const userRepository = await getRepository()
    const useCase = new UserGet(userRepository)

    return await useCase.execute(id)
  } catch (error) {
    console.error('Error getting user', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
