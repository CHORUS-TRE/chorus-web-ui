import { z } from 'zod'

export enum K8sWorkbenchStatus {
  RUNNING = 'Running',
  PROGRESSING = 'Progressing',
  FAILED = 'Failed',
  UNKNOWN = ''
}

export enum WorkbenchStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
  UNKNOWN = ''
}

export const WorkbenchSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  workspaceId: z.string().optional(),
  name: z.string().optional(),
  shortName: z.string().optional(),
  description: z.string().optional(),
  status: z.nativeEnum(WorkbenchStatus).optional(),
  k8sStatus: z.nativeEnum(K8sWorkbenchStatus).optional(),
  initialResolutionWidth: z.number().optional(),
  initialResolutionHeight: z.number().optional(),
  appInsanceIds: z.array(z.string()).optional(),
  appInstances: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export const WorkbenchCreateSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  workspaceId: z.string().min(1, 'Workspace ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  status: z.nativeEnum(WorkbenchStatus),
  initialResolutionWidth: z.number().optional(),
  initialResolutionHeight: z.number().optional()
})

export const WorkbenchEditFormSchema = WorkbenchCreateSchema

export const WorkbenchUpdateSchema = WorkbenchCreateSchema.extend({
  id: z.string()
})

export type Workbench = z.infer<typeof WorkbenchSchema>
export type WorkbenchCreateType = z.infer<typeof WorkbenchCreateSchema>
export type WorkbenchUpdateType = z.infer<typeof WorkbenchUpdateSchema>
