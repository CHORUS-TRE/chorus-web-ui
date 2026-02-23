'use client'
import { env } from 'next-runtime-env'

import { UserApiDataSourceImpl } from '@/data/data-source'
import { UserRepositoryImpl } from '@/data/repository'
import { Result } from '@/domain/model'
import {
  User,
  UserEditFormSchema,
  UserRoleCreateSchema,
  UserRoleCreateType,
  UserUpdateSchema,
  UserUpdateType
} from '@/domain/model/user'
import { UserCreate } from '@/domain/use-cases/user/user-create'
import { UserDelete } from '@/domain/use-cases/user/user-delete'
import { UserGet } from '@/domain/use-cases/user/user-get'
import { UserList } from '@/domain/use-cases/user/user-list'
import { UserMe } from '@/domain/use-cases/user/user-me'
import { UserRoleCreate } from '@/domain/use-cases/user/user-role-create'
import { UserUpdate } from '@/domain/use-cases/user/user-update'
import { UserServiceListUsersRequest } from '@/internal/client'

const getRepository = async () => {
  const dataSource = new UserApiDataSourceImpl(env('NEXT_PUBLIC_API_URL') || '')

  return new UserRepositoryImpl(dataSource)
}

export async function userMe() {
  const userRepository = await getRepository()
  const useCase = new UserMe(userRepository)
  const user = await useCase.execute()

  if (user.error) {
    return {
      error: user.error
    }
  }

  if (user?.data) {
    return {
      data: user.data as User
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

export async function listUsers(filters: UserServiceListUsersRequest = {}) {
  const userRepository = await getRepository()
  const useCase = new UserList(userRepository)
  return await useCase.execute(filters)
}

export async function deleteUser(id: string) {
  const userRepository = await getRepository()
  const useCase = new UserDelete(userRepository)
  return await useCase.execute(id)
}

// To update roles, use PUT to /api/rest/v1/workspaces/66/user/1/role
export async function updateUser(
  prevState: Result<User>,
  formData: FormData
): Promise<Result<User>> {
  const userRepository = await getRepository()
  const useCase = new UserUpdate(userRepository)

  const raw: UserUpdateType = {
    id: formData.get('id') as string,
    username: formData.get('username') as string,
    password: formData.get('password') as string,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string
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

export async function createUserRole(
  prevState: Result<User>,
  formData: FormData
): Promise<Result<User>> {
  const userRepository = await getRepository()
  const useCase = new UserRoleCreate(userRepository)

  // Build context object conditionally, only including keys that exist in FormData
  const context: Record<string, string> = {}
  const user = formData.get('user') as string
  const workspace = formData.get('workspace') as string
  const workbench = formData.get('workbench') as string

  if (user) context.user = user
  if (workspace) context.workspace = workspace
  if (workbench) context.workbench = workbench

  const raw: UserRoleCreateType = {
    userId: formData.get('userId') as string,
    role: {
      name: formData.get('roleName') as string,
      context
    }
  } as UserRoleCreateType

  const validation = UserRoleCreateSchema.safeParse(raw)

  if (!validation.success) {
    return {
      ...prevState,
      issues: validation.error.issues
    }
  }

  return await useCase.execute(validation.data)
}

export async function deleteUserRole(
  userId: string,
  roleId: string
): Promise<Result<User>> {
  const userRepository = await getRepository()
  return await userRepository.deleteRole(userId, roleId)
}
