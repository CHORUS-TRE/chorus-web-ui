'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import { WorkspaceDelete } from '@/domain/use-cases/workspace/workspace-delete'
import { env } from '@/env'

import { WorkspaceDataSourceImpl } from '~/data/data-source/chorus-api/workspace-api-data-source-impl'
import { WorkspaceRepositoryImpl } from '~/data/repository'
import {
  WorkspaceCreateModel,
  WorkspaceResponse,
  WorkspacesResponse
} from '~/domain/model'
import { WorkspaceCreateModelSchema } from '~/domain/model/workspace'
import { WorkspaceCreate } from '~/domain/use-cases'
import { WorkspaceGet } from '~/domain/use-cases/workspace/workspace-get'
import { WorkspacesList } from '~/domain/use-cases/workspace/workspaces-list'

import { IFormState } from './utils'

const getRepository = async () => {
  const session = cookies().get('session')?.value || ''
  const dataSource = new WorkspaceDataSourceImpl(session)
  return new WorkspaceRepositoryImpl(dataSource)
}

export async function workspaceDelete(
  prevState: IFormState,
  formData: FormData
): Promise<IFormState> {
  try {
    const id = formData.get('id') as string

    if (!id) {
      throw new Error('Invalid workspace id')
    }
    const repository = await getRepository()
    const useCase = new WorkspaceDelete(repository)

    const r = await useCase.execute(id)
    if (r.error) {
      return { error: r.error }
    }

    revalidatePath('/')
    return { data: 'Successfully deleted workspace' }
  } catch (error) {
    console.error(error)
    return { error: error.message }
  }
}

export async function workspaceList(): Promise<WorkspacesResponse> {
  try {
    const repository = await getRepository()
    const useCase = new WorkspacesList(repository)

    return await useCase.execute()
  } catch (error) {
    return { error: error.message }
  }
}

export async function workspaceCreate(
  prevState: IFormState,
  formData: FormData
): Promise<IFormState> {
  try {
    const repository = await getRepository()
    const useCase = new WorkspaceCreate(repository)

    // const rawFormData = Object.fromEntries(formData)
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

    if (!validation.success) {
      return { issues: validation.error.issues }
    }

    const nextWorkspace = WorkspaceCreateModelSchema.parse(workspace)
    const w = await useCase.execute(nextWorkspace)

    revalidatePath('/')

    return {
      ...prevState,
      data: 'Successfully created workspace',
      error: w.error
    }
  } catch (error) {
    console.error(error)
    return { error: error.message }
  }
}

export async function workspaceGet(
  workspaceId: string
): Promise<WorkspaceResponse> {
  if (!workspaceId) {
    throw new Error('Invalid workspace id')
  }

  try {
    const repository = await getRepository()
    const useCase = new WorkspaceGet(repository)

    return await useCase.execute(workspaceId)
  } catch (error) {
    return { error: error.message }
  }
}
