import { z } from 'zod'

export enum WorkspaceServiceInstanceState {
  RUNNING = 'Running',
  STOPPED = 'Stopped',
  DELETED = 'Deleted'
}

export enum WorkspaceServiceInstanceStatus {
  PROGRESSING = 'Progressing',
  RUNNING = 'Running',
  STOPPED = 'Stopped',
  DELETED = 'Deleted',
  FAILED = 'Failed',
  UNKNOWN = ''
}

export const WorkspaceServiceInstanceSchema = z.object({
  id: z.string(),
  tenantId: z.string().optional(),
  workspaceId: z.string(),
  name: z.string(),
  state: z.nativeEnum(WorkspaceServiceInstanceState).optional(),
  chartRegistry: z.string().optional(),
  chartRepository: z.string().optional(),
  chartTag: z.string().optional(),
  valuesOverrideJson: z.string().optional(),
  credentialsSecretName: z.string().optional(),
  credentialsPaths: z.array(z.string()).optional(),
  connectionInfoTemplate: z.string().optional(),
  computedValues: z.record(z.string(), z.string()).optional(),
  status: z.preprocess(
    (val) => (val === '' ? WorkspaceServiceInstanceStatus.UNKNOWN : val),
    z.nativeEnum(WorkspaceServiceInstanceStatus).optional()
  ),
  statusMessage: z.string().optional(),
  connectionInfo: z.string().optional(),
  secretName: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
})

export const WorkspaceServiceInstanceCreateSchema = z.object({
  workspaceId: z.string(),
  name: z.string().min(1),
  state: z.nativeEnum(WorkspaceServiceInstanceState),
  chartRegistry: z.string().min(1),
  chartRepository: z.string().min(1),
  chartTag: z.string().min(1),
  valuesOverrideJson: z.string().optional(),
  credentialsSecretName: z.string().optional(),
  credentialsPaths: z.array(z.string()).optional(),
  connectionInfoTemplate: z.string().optional()
})

export const WorkspaceServiceInstanceUpdateSchema =
  WorkspaceServiceInstanceCreateSchema.extend({
    id: z.string()
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
