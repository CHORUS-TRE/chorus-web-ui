import { z } from 'zod'

export const WorkspaceSchema = z.object({
  id: z.string(),
  // edges: z.array(EdgeSchema).optional(),
  name: z.string(),
  shortName: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  ownerId: z.string(),
  memberIds: z.array(z.string()),
  tags: z.array(z.string()),
  status: z.string(),
  workbenchIds: z.array(z.string()).optional(),
  serviceIds: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  archivedAt: z.date().optional()
})

export type Workspace = z.infer<typeof WorkspaceSchema>

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

export const WorkspaceCreateModelSchema = z.object({
  tenantId: z.string(),
  ownerId: z.string(),
  name: z.string().min(3),
  shortName: z.string().min(3).optional(),
  description: z.string().min(5),
  memberIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
})

export type WorkspaceCreateModel = z.infer<typeof WorkspaceCreateModelSchema>
