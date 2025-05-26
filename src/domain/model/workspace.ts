import { z } from 'zod'

export enum WorkspaceState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}

export const WorkspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  ownerId: z.string(),
  memberIds: z.array(z.string()),
  tags: z.array(z.string()),
  status: z.nativeEnum(WorkspaceState),
  sessionIds: z.array(z.string()).optional(),
  serviceIds: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  archivedAt: z.date().optional()
})

export const WorkspaceCreateModelSchema = z.object({
  tenantId: z.string(),
  ownerId: z.string(),
  name: z.string().min(3),
  shortName: z.string().min(3).optional(),
  description: z.string().optional(),
  memberIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
})

export const WorkspaceUpdateModelSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  userId: z.string(),
  name: z.string().min(3),
  shortName: z.string().min(3).optional(),
  description: z.string().optional(),
  status: z.nativeEnum(WorkspaceState).optional(),
  memberIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
})

export type Workspace = z.infer<typeof WorkspaceSchema>
export type WorkspaceCreateModel = z.infer<typeof WorkspaceCreateModelSchema>
export type WorkspaceUpdateModel = z.infer<typeof WorkspaceUpdateModelSchema>

export interface WorkspaceResponse {
  data?: Workspace
  error?: string
}

export interface WorkspaceDeleteResponse {
  data?: boolean
  error?: string
}

export interface WorkspacesResponse {
  data?: Workspace[]
  error?: string
}
