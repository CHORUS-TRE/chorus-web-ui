import { z } from 'zod'

export enum WorkspaceState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted'
}

export const WorkspaceSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  userId: z.string(),
  name: z.string(),
  shortName: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  status: z.nativeEnum(WorkspaceState),
  appInsanceIds: z.array(z.string()).optional(),
  appInstances: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const WorkspaceCreateSchema = z.object({
  tenantId: z.string(),
  userId: z.string(),
  name: z.string().min(3),
  shortName: z.string().min(3).optional(),
  description: z.string().optional()
})

export const WorkspaceUpdateSchema = WorkspaceCreateSchema.extend({
  id: z.string()
})

export type Workspace = z.infer<typeof WorkspaceSchema>
export type WorkspaceCreateType = z.infer<typeof WorkspaceCreateSchema>
export type WorkspaceUpdatetype = z.infer<typeof WorkspaceUpdateSchema>

export interface WorkspaceResponse {
  data?: Workspace
  error?: string
}

export interface WorkspacesResponse {
  data?: Workspace[]
  error?: string
}
