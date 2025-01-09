import { z } from 'zod'

export const AppInstanceSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  ownerId: z.string(),
  appId: z.string(),
  workspaceId: z.string(),
  workbenchId: z.string(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  archivedAt: z.date().optional()
})

export type AppInstance = z.infer<typeof AppInstanceSchema>

export const AppInstanceCreateSchema = z.object({
  tenantId: z.string(),
  ownerId: z.string(),
  appId: z.string(),
  workspaceId: z.string(),
  workbenchId: z.string(),
  status: z.string()
})

export type AppInstanceCreateModel = z.infer<typeof AppInstanceCreateSchema>

export interface AppInstanceResponse {
  data?: AppInstance
  error?: string
}

export interface AppInstanceDeleteResponse {
  data?: boolean
  error?: string
}

export interface AppInstancesResponse {
  data?: AppInstance[]
  error?: string
}

export interface AppInstanceUpdateModel extends AppInstanceCreateModel {
  id: string
}
