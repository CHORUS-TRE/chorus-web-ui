'use server'

import { cookies } from 'next/headers'

import { WorkspaceDataSourceImpl } from '~/data/data-source/chorus-api/workspace-api-data-source-impl'
import { WorkspaceRepositoryImpl } from '~/data/repository'
import {
  WorkspaceCreateModel,
  WorkspaceResponse,
  WorkspacesResponse,
  WorkspaceState
} from '~/domain/model'
import { WorkspaceCreateModelSchema } from '~/domain/model/workspace'
import { WorkspaceUpdateModelSchema } from '~/domain/model/workspace'
import { WorkspaceCreate } from '~/domain/use-cases/workspace/workspace-create'
import { WorkspaceDelete } from '~/domain/use-cases/workspace/workspace-delete'
import { WorkspaceGet } from '~/domain/use-cases/workspace/workspace-get'
import { WorkspaceUpdate } from '~/domain/use-cases/workspace/workspace-update'
import { WorkspacesList } from '~/domain/use-cases/workspace/workspaces-list'

import { IFormState } from './utils'

const getRepository = async () => {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value || ''
  const dataSource = new WorkspaceDataSourceImpl(session)
  return new WorkspaceRepositoryImpl(dataSource)
}

export async function workspaceDelete(
  prevState: IFormState,
  formData: FormData
): Promise<IFormState> {
  try {
    const id = formData.get('id') as string
    if (!id) throw new Error('Invalid workspace id')

    const repository = await getRepository()
    const useCase = new WorkspaceDelete(repository)

    const r = await useCase.execute(id)
    if (r.error) return { error: r.error }

    return { data: 'Successfully deleted workspace' }
  } catch (error) {
    console.error('Error deleting workspace', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceList(): Promise<WorkspacesResponse> {
  try {
    const repository = await getRepository()
    const useCase = new WorkspacesList(repository)
    return await useCase.execute()
  } catch (error) {
    console.error('Error listing workspaces', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceCreate(
  prevState: IFormState,
  formData: FormData
): Promise<IFormState> {
  try {
    const repository = await getRepository()
    const useCase = new WorkspaceCreate(repository)

    const workspace: WorkspaceCreateModel = {
      name: formData.get('name') as string,
      tenantId: formData.get('tenantId') as string,
      ownerId: formData.get('ownerId') as string,
      description: formData.get('description') as string,
      shortName: formData.get('shortName') as string,
      memberIds: formData.getAll('memberIds') as string[],
      tags: formData.getAll('tags') as string[]
    }

    const validation = WorkspaceCreateModelSchema.safeParse(workspace)
    if (!validation.success) return { issues: validation.error.issues }

    const w = await useCase.execute(validation.data)

    return {
      ...prevState,
      data: 'Successfully created workspace',
      error: w.error
    }
  } catch (error) {
    console.error('Error creating workspace', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceGet(id: string): Promise<WorkspaceResponse> {
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
  prevState: IFormState,
  formData: FormData
): Promise<IFormState> {
  try {
    const repository = await getRepository()
    const useCase = new WorkspaceUpdate(repository)

    const workspace = {
      id: formData.get('id') as string,
      tenantId: formData.get('tenantId') as string,
      userId: formData.get('userId') as string,
      name: formData.get('name') as string,
      shortName: formData.get('shortName') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as WorkspaceState,
      memberIds: formData.getAll('memberIds') as string[],
      tags: formData.getAll('tags') as string[]
    }

    const validation = WorkspaceUpdateModelSchema.safeParse(workspace)
    if (!validation.success) return { issues: validation.error.issues }

    const w = await useCase.execute(validation.data)

    return {
      ...prevState,
      data: 'Successfully updated workspace',
      error: w.error
    }
  } catch (error) {
    console.error('Error updating workspace', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
