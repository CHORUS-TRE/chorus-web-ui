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
  data: Workspace | null
  error: string | null
}

export interface WorkspacesResponse {
  data: Workspace[] | null
  error: string | null
}

export const WorkspaceCreateModelSchema = z.object({
  tenantId: z.string(),
  ownerId: z.string(),
  name: z.string(),
  shortName: z.string().optional(),
  description: z.string(),
  memberIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
})

export type WorkspaceCreateModel = z.infer<typeof WorkspaceCreateModelSchema>
