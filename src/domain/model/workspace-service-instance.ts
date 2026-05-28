import { z } from 'zod'

// Desired lifecycle state (matches backend WorkspaceServiceInstanceState)
export enum WorkspaceServiceInstanceState {
  RUNNING = 'Running',
  STOPPED = 'Stopped',
  DELETED = 'Deleted',
  UNKNOWN = ''
}

// Observed status (matches backend WorkspaceServiceInstanceStatus)
export enum WorkspaceServiceInstanceStatus {
  PROGRESSING = 'Progressing',
  RUNNING = 'Running',
  STOPPED = 'Stopped',
  DELETED = 'Deleted',
  FAILED = 'Failed',
  UNKNOWN = ''
}

export const WorkspaceServiceInstanceSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().optional(),
  workspaceId: z.string().optional(),
  name: z.string().optional(),
  state: z.preprocess(
    (val) => (val === undefined ? WorkspaceServiceInstanceState.UNKNOWN : val),
    z.nativeEnum(WorkspaceServiceInstanceState).optional()
  ),
  chartRegistry: z.string().optional(),
  chartRepository: z.string().optional(),
  chartTag: z.string().optional(),
  valuesOverrideJson: z.string().optional(),
  credentialsSecretName: z.string().optional(),
  credentialsPaths: z.array(z.string()).optional(),
  connectionInfoTemplate: z.string().optional(),
  computedValues: z.record(z.string(), z.string()).optional(),
  status: z.preprocess(
    (val) => (val === undefined ? WorkspaceServiceInstanceStatus.UNKNOWN : val),
    z.nativeEnum(WorkspaceServiceInstanceStatus).optional()
  ),
  statusMessage: z.string().optional(),
  connectionInfo: z.string().optional(),
  secretName: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export const WorkspaceServiceInstanceCreateSchema = z.object({
  tenantId: z.string().optional(),
  workspaceId: z.string().min(1, 'Workspace ID is required'),
  name: z.string().min(1, 'Name is required'),
  state: z.nativeEnum(WorkspaceServiceInstanceState).optional(),
  chartRegistry: z.string().min(1, 'Chart registry is required'),
  chartRepository: z.string().min(1, 'Chart repository is required'),
  chartTag: z.string().min(1, 'Chart tag is required'),
  valuesOverrideJson: z.string().optional(),
  credentialsSecretName: z.string().optional(),
  credentialsPaths: z.array(z.string()).optional(),
  connectionInfoTemplate: z.string().optional()
})

export const WorkspaceServiceInstanceUpdateSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  tenantId: z.string().optional(),
  workspaceId: z.string().optional(),
  name: z.string().optional(),
  state: z.nativeEnum(WorkspaceServiceInstanceState).optional(),
  chartRegistry: z.string().optional(),
  chartRepository: z.string().optional(),
  chartTag: z.string().optional(),
  valuesOverrideJson: z.string().optional(),
  credentialsSecretName: z.string().optional(),
  credentialsPaths: z.array(z.string()).optional(),
  connectionInfoTemplate: z.string().optional()
})

export const WorkspaceServiceInstanceListFilterSchema = z.object({
  workspaceIds: z.array(z.string()).optional(),
  paginationOffset: z.number().int().min(0).optional(),
  paginationLimit: z.number().int().min(1).optional(),
  paginationSortOrder: z.string().optional(),
  paginationSortType: z.string().optional(),
  paginationQuery: z.array(z.string()).optional()
})

export type WorkspaceServiceInstance = z.infer<
  typeof WorkspaceServiceInstanceSchema
>
export type WorkspaceServiceInstanceCreateType = z.infer<
  typeof WorkspaceServiceInstanceCreateSchema
>
export type WorkspaceServiceInstanceUpdateType = z.infer<
  typeof WorkspaceServiceInstanceUpdateSchema
>
export type WorkspaceServiceInstanceListFilter = z.infer<
  typeof WorkspaceServiceInstanceListFilterSchema
>
