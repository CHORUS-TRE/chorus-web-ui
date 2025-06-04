import { z } from 'zod'

export enum WorkbenchState {
  UNINITIALIZED = 'uninitialized',
  CREATED = 'created',
  LOADING = 'loading',
  ACTIVE = 'active',
  STOPPING = 'stopping',
  EXITED = 'exited'
}

export enum WorkbenchStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted'
}

export const WorkbenchSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  workspaceId: z.string().optional(),
  name: z.string().optional(),
  shortName: z.string().optional(),
  description: z.string().optional(),
  status: z.nativeEnum(WorkbenchStatus),
  initialResolutionWidth: z.number().optional(),
  initialResolutionHeight: z.number().optional(),
  appInsanceIds: z.array(z.string()).optional(),
  appInstances: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export const WorkbenchCreateSchema = z.object({
  tenantId: z.string(),
  userId: z.string(),
  workspaceId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.nativeEnum(WorkbenchStatus),
  initialResolutionWidth: z.number().optional(),
  initialResolutionHeight: z.number().optional()
})

export const WorkbenchUpdateSchema = WorkbenchCreateSchema.extend({
  id: z.string()
})

export type Workbench = z.infer<typeof WorkbenchSchema>
export type WorkbenchCreateType = z.infer<typeof WorkbenchCreateSchema>
export type WorkbenchUpdateType = z.infer<typeof WorkbenchUpdateSchema>
export interface WorkbenchResponse {
  data?: Workbench
  error?: string
}

export interface WorkbenchesResponse {
  data?: Workbench[]
  error?: string
}
