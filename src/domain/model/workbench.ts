import { z } from 'zod'

export const WorkbenchSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  ownerId: z.string(),
  appId: z.string(),
  workspaceId: z.string(),
  status: z.string(),
  name: z.string(),
  description: z.string().optional(),

  memberIds: z.array(z.string()),
  tags: z.array(z.string()),

  createdAt: z.date(),
  updatedAt: z.date(),
  archivedAt: z.date().optional()
  // parentId: z.string().optional(),
  // edges: z.array(EdgeSchema).optional(),
})

export type Workbench = z.infer<typeof WorkbenchSchema>

export interface WorkbenchResponse {
  data: Workbench | null
  error: string | null
}

export interface WorkbenchesResponse {
  data: Workbench[] | null
  error: string | null
}

export const WorkbenchCreateModelSchema = z.object({
  tenantId: z.string(),
  ownerId: z.string(),
  appId: z.string(),
  workspaceId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  memberIds: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
})

export type WorkbenchCreateModel = z.infer<typeof WorkbenchCreateModelSchema>
