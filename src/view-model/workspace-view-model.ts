'use client'

import { env } from 'next-runtime-env'

import { WorkspaceDataSourceImpl } from '~/data/data-source'
import { WorkspaceRepositoryImpl } from '~/data/repository'
import {
  Result,
  Workspace,
  WorkspaceCreateType,
  WorkspaceUpdatetype
} from '~/domain/model'
import { User } from '~/domain/model/user'
import {
  WorkspaceCreateSchema,
  WorkspaceUpdateSchema
} from '~/domain/model/workspace'
import { WorkspaceCreate } from '~/domain/use-cases/workspace/workspace-create'
import { WorkspaceDelete } from '~/domain/use-cases/workspace/workspace-delete'
import { WorkspaceGet } from '~/domain/use-cases/workspace/workspace-get'
import { WorkspaceUpdate } from '~/domain/use-cases/workspace/workspace-update'
import { WorkspacesList } from '~/domain/use-cases/workspace/workspaces-list'

const getRepository = async () => {
  const dataSource = new WorkspaceDataSourceImpl(
    env('NEXT_PUBLIC_API_URL') || ''
  )
  return new WorkspaceRepositoryImpl(dataSource)
}

export async function workspaceDelete(id: string): Promise<Result<string>> {
  try {
    if (!id) throw new Error('Invalid workspace id')
    const repository = await getRepository()
    const useCase = new WorkspaceDelete(repository)
    return await useCase.execute(id)
  } catch (error) {
    console.error('Error deleting workspace', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceList(): Promise<Result<Workspace[]>> {
  const repository = await getRepository()
  const useCase = new WorkspacesList(repository)
  return await useCase.execute()
}

export async function workspaceCreate(
  prevState: Result<Workspace>,
  formData: FormData
): Promise<Result<Workspace>> {
  try {
    const repository = await getRepository()
    const useCase = new WorkspaceCreate(repository)

    const formValues = Object.fromEntries(formData.entries())

    const workspace: WorkspaceCreateType = {
      ...formValues,
      isMain: formValues.isMain === 'true',
      shortName:
        formValues.shortName ||
        (formValues.name.slice(0, 3) as string).toLowerCase()
    } as WorkspaceCreateType

    const validation = WorkspaceCreateSchema.safeParse(workspace)
    if (!validation.success) {
      return { issues: validation.error.issues }
    }

    return await useCase.execute(validation.data)
  } catch (error) {
    console.error('Error creating workspace', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceGet(id: string): Promise<Result<Workspace>> {
  try {
    const repository = await getRepository()
    const useCase = new WorkspaceGet(repository)
    return await useCase.execute(id)
  } catch (error) {
    console.error('Error getting workspace', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceUpdate(
  prevState: Result<Workspace>,
  formData: FormData
): Promise<Result<Workspace>> {
  try {
    const repository = await getRepository()
    const useCase = new WorkspaceUpdate(repository)

    const formValues = Object.fromEntries(formData.entries())
    const workspace: WorkspaceUpdatetype = {
      ...formValues,
      isMain: formValues.isMain === 'true',
      shortName:
        formValues.shortName ||
        (formValues.name.slice(0, 3) as string).toLowerCase()
    } as WorkspaceUpdatetype

    const validation = WorkspaceUpdateSchema.safeParse(workspace)
    if (!validation.success) {
      return { issues: validation.error.issues }
    }

    return await useCase.execute(validation.data)
  } catch (error) {
    console.error('Error updating workspace', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceManageUserRole(
  prevState: Result<User>,
  formData: FormData
): Promise<Result<User>> {
  try {
    const repository = await getRepository()

    const workspaceId = formData.get('workspaceId') as string
    const userId = formData.get('userId') as string
    const roleName = formData.get('roleName') as string

    if (!workspaceId || !userId || !roleName) {
      return {
        error: 'Missing required fields: workspaceId, userId, or roleName'
      }
    }

    return await repository.manageUserRole(workspaceId, userId, roleName)
  } catch (error) {
    console.error('Error adding user role to workspace', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
