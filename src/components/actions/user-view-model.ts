'use client'
import { env } from 'next-runtime-env'

import { UserApiDataSourceImpl } from '~/data/data-source'
import { UserRepositoryImpl } from '~/data/repository'
import { Result } from '~/domain/model'
import { User, UserEditFormSchema, UserUpdateSchema } from '~/domain/model/user'
import { UserCreate } from '~/domain/use-cases/user/user-create'
import { UserDelete } from '~/domain/use-cases/user/user-delete'
import { UserGet } from '~/domain/use-cases/user/user-get'
import { UserList } from '~/domain/use-cases/user/user-list'
import { UserMe } from '~/domain/use-cases/user/user-me'
import { UserUpdate } from '~/domain/use-cases/user/user-update'

import { getToken } from './authentication-view-model'
// import { useAppState } from '../store/app-state-context'

const getRepository = async () => {
  const token = await getToken()
  const dataSource = new UserApiDataSourceImpl(
    token || '',
    env('NEXT_PUBLIC_DATA_SOURCE_API_URL') || ''
  )

  return new UserRepositoryImpl(dataSource)
}

export async function userMe() {
  const userRepository = await getRepository()
  const useCase = new UserMe(userRepository)
  const user = await useCase.execute()
  // const { workspaces } = useAppState()

  if (user.error) {
    return {
      error: user.error
    }
  }

  if (user?.data) {
    return {
      data: {
        ...(user.data as User)
        // workspaceId: workspaces?.find((w) => w.isMain && w.userId === user.data?.id)?.id
      }
    }
  }
}

export async function createUser(
  prevState: Result<User>,
  formData: FormData
): Promise<Result<User>> {
  try {
    const userRepository = await getRepository()
    const useCase = new UserCreate(userRepository)

    const raw = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      roles: formData.getAll('roles') as string[]
    }

    const validation = UserEditFormSchema.safeParse(raw)

    if (!validation.success) {
      return {
        ...prevState,
        issues: validation.error.issues
      }
    }

    const result = await useCase.execute(validation.data)
    if (result.error) {
      return {
        ...prevState,
        error: result.error
      }
    }

    return result
  } catch (error) {
    console.error('Error creating user', error)
    return {
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

export async function getUser(id: string) {
  const userRepository = await getRepository()
  const useCase = new UserGet(userRepository)
  return await useCase.execute(id)
}

export async function listUsers() {
  const userRepository = await getRepository()
  const useCase = new UserList(userRepository)
  return await useCase.execute()
}

export async function deleteUser(id: string) {
  const userRepository = await getRepository()
  const useCase = new UserDelete(userRepository)
  return await useCase.execute(id)
}

export async function updateUser(
  prevState: Result<User>,
  formData: FormData
): Promise<Result<User>> {
  const userRepository = await getRepository()
  const useCase = new UserUpdate(userRepository)

  const raw = {
    id: formData.get('id') as string,
    username: formData.get('username') as string,
    password: formData.get('password') as string,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    roles: formData.getAll('roles') as string[]
  }

  const validation = UserUpdateSchema.safeParse(raw)

  if (!validation.success) {
    return {
      ...prevState,
      issues: validation.error.issues
    }
  }

  return await useCase.execute(validation.data)
}
