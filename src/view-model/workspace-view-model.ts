'use client'

import { env } from 'next-runtime-env'
import { ZodIssue } from 'zod'

import { Analytics } from '@/lib/analytics/service'
import { WorkspaceDataSourceImpl } from '~/data/data-source'
import { WorkspaceRepositoryImpl } from '~/data/repository'
import {
  Result,
  Workspace,
  WorkspaceCreateType,
  WorkspaceDev,
  WorkspaceDevFormSchema,
  WorkspaceDevFormType,
  WorkspaceUpdatetype,
  WorkspaceWithDev
} from '~/domain/model'
import { User } from '~/domain/model/user'
import { Workbench } from '~/domain/model/workbench'
import {
  WorkspaceCreateSchema,
  WorkspaceUpdateSchema
} from '~/domain/model/workspace'
import {
  WorkspaceConfig,
  WorkspaceConfigSchema
} from '~/domain/model/workspace-config'
import { WorkspaceCreate } from '~/domain/use-cases/workspace/workspace-create'
import { WorkspaceDelete } from '~/domain/use-cases/workspace/workspace-delete'
import { WorkspaceGet } from '~/domain/use-cases/workspace/workspace-get'
import { WorkspaceUpdate } from '~/domain/use-cases/workspace/workspace-update'
import { WorkspacesList } from '~/domain/use-cases/workspace/workspaces-list'
import { useDevStoreCache } from '~/stores/dev-store-cache'
import { listUsers } from '~/view-model/user-view-model'
import { workbenchList } from '~/view-model/workbench-view-model'

const getRepository = async () => {
  const dataSource = new WorkspaceDataSourceImpl(
    env('NEXT_PUBLIC_API_URL') || ''
  )
  return new WorkspaceRepositoryImpl(dataSource)
}

// ============================================
// Enrichment helpers
// ============================================

async function enrichWorkspaceWithDev(
  workspace: Workspace,
  workbenches?: Workbench[]
): Promise<WorkspaceWithDev> {
  const devStore = useDevStoreCache.getState()

  const image = devStore.getWorkspace(workspace.id, 'image')
  const tagValue = devStore.getWorkspace(workspace.id, 'tag')
  const tag: 'center' | 'project' =
    tagValue === 'center' || tagValue === 'project' ? tagValue : 'project'
  const config = devStore.getWorkspaceConfig(workspace.id)

  const usersResult = await listUsers({ filterWorkspaceIDs: [workspace.id] })
  const users = usersResult.data || []
  const owner = users.find((user) => user.id === workspace.userId)

  let workbenchCount = 0
  if (workbenches) {
    workbenchCount = workbenches.filter(
      (wb) => wb.workspaceId === workspace.id
    ).length
  } else {
    const wbResult = await workbenchList()
    if (wbResult.data) {
      workbenchCount = wbResult.data.filter(
        (wb) => wb.workspaceId === workspace.id
      ).length
    }
  }

  const dev: WorkspaceDev = {
    image: image || undefined,
    tag,
    config,
    owner: owner ? `${owner.firstName} ${owner.lastName}` : undefined,
    memberCount: users.length,
    members: users,
    workbenchCount,
    files: 0
  }

  return { ...workspace, dev }
}

// ============================================
// API/DevStore validation helpers
// ============================================

function extractAndValidateApiFields(
  data: Record<string, unknown>,
  isUpdate = false
): { data?: WorkspaceCreateType | WorkspaceUpdatetype; issues?: ZodIssue[] } {
  const apiData: WorkspaceCreateType | WorkspaceUpdatetype = {
    tenantId: data.tenantId as string,
    userId: data.userId as string,
    name: data.name as string,
    shortName: data.shortName as string,
    description: data.description as string | undefined,
    isMain: data.isMain as boolean | undefined,
    ...(isUpdate ? { id: data.id as string } : {})
  }

  const validation = (
    isUpdate ? WorkspaceUpdateSchema : WorkspaceCreateSchema
  ).safeParse(apiData)
  if (!validation.success) {
    return { issues: validation.error.issues }
  }
  return { data: validation.data }
}

function buildWorkspaceConfigFromDevForm(
  data: WorkspaceDevFormType
): WorkspaceConfig | undefined {
  const hasConfig =
    data.descriptionMarkdown !== undefined ||
    data.network !== undefined ||
    data.allowCopyPaste !== undefined ||
    data.resourcePreset !== undefined ||
    data.gpu !== undefined ||
    data.cpu !== undefined ||
    data.memory !== undefined ||
    data.coldStorageEnabled !== undefined ||
    data.coldStorageSize !== undefined ||
    data.hotStorageEnabled !== undefined ||
    data.hotStorageSize !== undefined ||
    data.serviceGitlab !== undefined ||
    data.serviceK8s !== undefined ||
    data.serviceHpc !== undefined

  if (!hasConfig) return undefined

  // Build partial config object with only defined values
  const partialConfig: Partial<WorkspaceConfig> = {}

  if (data.descriptionMarkdown !== undefined) {
    partialConfig.descriptionMarkdown = data.descriptionMarkdown
  }

  const security: Partial<WorkspaceConfig['security']> = {}
  if (data.network !== undefined) {
    security.network = data.network
  }
  if (data.allowCopyPaste !== undefined) {
    security.allowCopyPaste = data.allowCopyPaste
  }
  if (Object.keys(security).length > 0) {
    partialConfig.security = security as WorkspaceConfig['security']
  }

  const resources: Partial<WorkspaceConfig['resources']> = {}
  if (data.resourcePreset !== undefined) {
    resources.preset = data.resourcePreset
  }
  if (data.gpu !== undefined) {
    resources.gpu = data.gpu
  }
  if (data.cpu !== undefined) {
    resources.cpu = data.cpu
  }
  if (data.memory !== undefined) {
    resources.memory = data.memory
  }
  const coldStorage: Partial<WorkspaceConfig['resources']['coldStorage']> = {}
  if (data.coldStorageEnabled !== undefined) {
    coldStorage.enabled = data.coldStorageEnabled
  }
  if (data.coldStorageSize !== undefined) {
    coldStorage.size = data.coldStorageSize
  }
  if (Object.keys(coldStorage).length > 0) {
    resources.coldStorage =
      coldStorage as WorkspaceConfig['resources']['coldStorage']
  }
  const hotStorage: Partial<WorkspaceConfig['resources']['hotStorage']> = {}
  if (data.hotStorageEnabled !== undefined) {
    hotStorage.enabled = data.hotStorageEnabled
  }
  if (data.hotStorageSize !== undefined) {
    hotStorage.size = data.hotStorageSize
  }
  if (Object.keys(hotStorage).length > 0) {
    resources.hotStorage =
      hotStorage as WorkspaceConfig['resources']['hotStorage']
  }
  if (Object.keys(resources).length > 0) {
    partialConfig.resources = resources as WorkspaceConfig['resources']
  }

  const services: Partial<WorkspaceConfig['services']> = {}
  if (data.serviceGitlab !== undefined) {
    services.gitlab = data.serviceGitlab
  }
  if (data.serviceK8s !== undefined) {
    services.k8s = data.serviceK8s
  }
  if (data.serviceHpc !== undefined) {
    services.hpc = data.serviceHpc
  }
  if (Object.keys(services).length > 0) {
    partialConfig.services = services as WorkspaceConfig['services']
  }

  // Use Zod schema to parse and apply defaults for type safety
  const parsed = WorkspaceConfigSchema.safeParse(partialConfig)
  if (parsed.success) {
    return parsed.data
  }
  // If parsing fails, return undefined (shouldn't happen with defaults)
  console.error('Failed to parse workspace config:', parsed.error)
  return undefined
}

function extractAndValidateDevFields(data: Record<string, unknown>): {
  data?: Partial<WorkspaceDev>
  issues?: ZodIssue[]
} {
  const devValidation = WorkspaceDevFormSchema.safeParse(data)
  if (!devValidation.success) {
    const prefixedIssues = devValidation.error.issues.map((issue) => ({
      ...issue,
      path: ['dev', ...issue.path]
    }))
    return { issues: prefixedIssues }
  }

  const devForm = devValidation.data
  const config = buildWorkspaceConfigFromDevForm(devForm)

  return {
    data: {
      image: devForm.image,
      tag: devForm.tag,
      config
    }
  }
}

function combineValidationIssues(
  apiIssues?: ZodIssue[],
  devIssues?: ZodIssue[]
): ZodIssue[] {
  const all: ZodIssue[] = []
  if (apiIssues) all.push(...apiIssues)
  if (devIssues) all.push(...devIssues)
  return all
}

// ============================================
// CRUD
// ============================================

export async function workspaceDelete(id: string): Promise<Result<string>> {
  try {
    if (!id) throw new Error('Invalid workspace id')
    const repository = await getRepository()
    const useCase = new WorkspaceDelete(repository)
    const result = await useCase.execute(id)

    if (result.data) {
      Analytics.Workspace.deleteSuccess()
    }

    return result
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

export async function workspaceListWithDev(): Promise<
  Result<WorkspaceWithDev[]>
> {
  const [workspacesResult, workbenchesResult] = await Promise.all([
    workspaceList(),
    workbenchList()
  ])

  if (workspacesResult.error) return { error: workspacesResult.error }
  if (workbenchesResult.error) return { error: workbenchesResult.error }
  if (!workspacesResult.data) return { data: [] }

  const workbenches = workbenchesResult.data || []
  const enriched = await Promise.all(
    workspacesResult.data.map((ws) => enrichWorkspaceWithDev(ws, workbenches))
  )

  return { data: enriched }
}

export async function workspaceCreate(
  prevState: Result<Workspace>,
  formData: FormData
): Promise<Result<Workspace>> {
  try {
    Analytics.Workspace.createStart()
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
      Analytics.Workspace.createError('Validation Issues')
      return { issues: validation.error.issues }
    }

    const result = await useCase.execute(validation.data)

    if (result.error) {
      Analytics.Workspace.createError(result.error)
    } else if (result.data) {
      Analytics.Workspace.createSuccess(result.data.id)
    }

    return result
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    Analytics.Workspace.createError(errorMessage)
    console.error('Error creating workspace', error)
    return { error: errorMessage }
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

export async function workspaceGetWithDev(
  id: string
): Promise<Result<WorkspaceWithDev>> {
  const workspaceResult = await workspaceGet(id)
  if (workspaceResult.error) return { error: workspaceResult.error }
  if (!workspaceResult.data) return { error: 'Not found' }

  const enriched = await enrichWorkspaceWithDev(workspaceResult.data)
  return { data: enriched }
}

export async function workspaceCreateWithDev(
  prevState: Result<WorkspaceWithDev>,
  formData: FormData
): Promise<Result<WorkspaceWithDev>> {
  try {
    const repository = await getRepository()

    const raw = Object.fromEntries(formData.entries())
    const normalized: Record<string, unknown> = {
      ...raw,
      isMain: raw.isMain === 'true',
      allowCopyPaste: raw.allowCopyPaste === 'true',
      coldStorageEnabled: raw.coldStorageEnabled === 'true',
      hotStorageEnabled: raw.hotStorageEnabled === 'true',
      serviceGitlab: raw.serviceGitlab === 'true',
      serviceK8s: raw.serviceK8s === 'true',
      serviceHpc: raw.serviceHpc === 'true',
      gpu: raw.gpu ? parseInt(raw.gpu as string, 10) : undefined
    }

    const apiValidation = extractAndValidateApiFields(normalized)
    const devValidation = extractAndValidateDevFields(normalized)

    if (apiValidation.issues || devValidation.issues) {
      Analytics.Workspace.createError('Validation Issues')
      return {
        issues: combineValidationIssues(
          apiValidation.issues,
          devValidation.issues
        )
      }
    }

    const useCase = new WorkspaceCreate(repository)
    const createResult = await useCase.execute(
      apiValidation.data as WorkspaceCreateType
    )
    if (createResult.error) {
      Analytics.Workspace.createError(createResult.error)
      return { error: createResult.error }
    }
    if (createResult.issues) {
      Analytics.Workspace.createError('Validation Issues')
      return { issues: createResult.issues }
    }
    if (!createResult.data) {
      Analytics.Workspace.createError('Failed to create workspace')
      return { error: 'Failed to create workspace' }
    }

    Analytics.Workspace.createSuccess(createResult.data.id)

    if (devValidation.data && createResult.data.id) {
      const { setWorkspace, setWorkspaceConfig } = useDevStoreCache.getState()
      const dev = devValidation.data

      if (dev.image) {
        if (dev.image instanceof FileList && dev.image.length > 0) {
          const file = dev.image[0]
          const imageBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
          await setWorkspace(createResult.data.id, 'image', imageBase64)
        } else if (typeof dev.image === 'string') {
          await setWorkspace(createResult.data.id, 'image', dev.image)
        }
      }

      if (dev.tag) {
        await setWorkspace(createResult.data.id, 'tag', dev.tag)
      }

      if (dev.config) {
        await setWorkspaceConfig(createResult.data.id, dev.config)
      }
    }

    const enriched = await enrichWorkspaceWithDev(createResult.data)
    return { data: enriched }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    Analytics.Workspace.createError(errorMessage)
    console.error('Error creating workspace with dev fields', error)
    return { error: errorMessage }
  }
}

export async function workspaceUpdateWithDev(
  prevState: Result<WorkspaceWithDev>,
  formData: FormData
): Promise<Result<WorkspaceWithDev>> {
  try {
    const repository = await getRepository()

    const raw = Object.fromEntries(formData.entries())
    const removeImage = raw.removeImage === 'true'
    const normalized: Record<string, unknown> = {
      ...raw,
      isMain: raw.isMain === 'true',
      allowCopyPaste: raw.allowCopyPaste === 'true',
      coldStorageEnabled: raw.coldStorageEnabled === 'true',
      hotStorageEnabled: raw.hotStorageEnabled === 'true',
      serviceGitlab: raw.serviceGitlab === 'true',
      serviceK8s: raw.serviceK8s === 'true',
      serviceHpc: raw.serviceHpc === 'true',
      gpu: raw.gpu ? parseInt(raw.gpu as string, 10) : undefined,
      image: removeImage ? null : raw.image
    }

    const apiValidation = extractAndValidateApiFields(normalized, true)
    const devValidation = extractAndValidateDevFields(normalized)

    if (apiValidation.issues || devValidation.issues) {
      return {
        issues: combineValidationIssues(
          apiValidation.issues,
          devValidation.issues
        )
      }
    }

    const useCase = new WorkspaceUpdate(repository)
    const updateResult = await useCase.execute(
      apiValidation.data as WorkspaceUpdatetype
    )
    if (updateResult.error) return { error: updateResult.error }
    if (updateResult.issues) return { issues: updateResult.issues }
    if (!updateResult.data) return { error: 'Failed to update workspace' }

    if (devValidation.data && updateResult.data.id) {
      const { setWorkspace, deleteWorkspace, setWorkspaceConfig } =
        useDevStoreCache.getState()
      const dev = devValidation.data

      if (dev.image === null) {
        await deleteWorkspace(updateResult.data.id, 'image')
      } else if (dev.image) {
        if (dev.image instanceof FileList && dev.image.length > 0) {
          const file = dev.image[0]
          const imageBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
          await setWorkspace(updateResult.data.id, 'image', imageBase64)
        } else if (typeof dev.image === 'string') {
          await setWorkspace(updateResult.data.id, 'image', dev.image)
        }
      }

      if (dev.tag) {
        await setWorkspace(updateResult.data.id, 'tag', dev.tag)
      }

      if (dev.config) {
        await setWorkspaceConfig(updateResult.data.id, dev.config)
      }
    }

    const enriched = await enrichWorkspaceWithDev(updateResult.data)
    return { data: enriched }
  } catch (error) {
    console.error('Error updating workspace with dev fields', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceAddUserRole(
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

    return await repository.addUserRole(workspaceId, userId, roleName)
  } catch (error) {
    console.error('Error adding user role to workspace', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function workspaceRemoveUserFromWorkspace(
  prevState: Result<User>,
  formData: FormData
): Promise<Result<User>> {
  try {
    const repository = await getRepository()

    const workspaceId = formData.get('workspaceId') as string
    const userId = formData.get('userId') as string

    if (!workspaceId || !userId) {
      return {
        error: 'Missing required fields: workspaceId, userId'
      }
    }

    return await repository.removeUserFromWorkspace(workspaceId, userId)
  } catch (error) {
    console.error('Error removing user from workspace', error)
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
