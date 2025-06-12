import { z } from 'zod'

export enum WorkbenchState {
  UNINITIALIZED = 'uninitialized',
  CREATED = 'created',
  LOADING = 'loading',
  ACTIVE = 'active',
  STOPPING = 'stopping',
  EXITED = 'exited'
}

export const WorkbenchCreateSchema = z.object({
  tenantId: z.string(),
  ownerId: z.string(),
  workspaceId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  memberIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  initialResolutionWidth: z.number().optional(),
  initialResolutionHeight: z.number().optional()
})

export const WorkbenchUpdateSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  ownerId: z.string(),
  workspaceId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  memberIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  initialResolutionWidth: z.number().optional(),
  initialResolutionHeight: z.number().optional()
})

export const WorkbenchSchema = WorkbenchCreateSchema.extend({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  description: z.string().optional(),
  tenantId: z.string(),
  ownerId: z.string(),
  workspaceId: z.string(),
  status: z.nativeEnum(WorkbenchState),

  memberIds: z.array(z.string()),
  tags: z.array(z.string()),

  createdAt: z.date(),
  updatedAt: z.date(),
  archivedAt: z.date().optional()
  // parentId: z.string().optional(),
  // edges: z.array(EdgeSchema).optional(),
})

export type Workbench = z.infer<typeof WorkbenchSchema>
export type WorkbenchCreateModel = z.infer<typeof WorkbenchCreateSchema>
export type WorkbenchUpdateModel = z.infer<typeof WorkbenchUpdateSchema>
export interface WorkbenchResponse {
  data?: Workbench
  error?: string
}

export interface WorkbenchDeleteResponse {
  data?: boolean
  error?: string
}

export interface WorkbenchesResponse {
  data?: Workbench[]
  error?: string
}
