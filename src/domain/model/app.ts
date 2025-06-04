import { z } from 'zod'

export enum AppState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted'
}

export const AppSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  userId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.nativeEnum(AppState),
  dockerImageRegistry: z.string().optional(),
  dockerImageName: z.string().optional(),
  dockerImageTag: z.string().optional(),
  shmSize: z.string().optional(),
  kioskConfigURL: z.string().optional(),
  maxCPU: z.string().optional(),
  minCPU: z.string().optional(),
  maxMemory: z.string().optional(),
  minMemory: z.string().optional(),
  minEphemeralStorage: z.string().optional(),
  maxEphemeralStorage: z.string().optional(),
  iconURL: z.string().optional(),
  prettyName: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const AppCreateSchema = z.object({
  tenantId: z.string(),
  userId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.nativeEnum(AppState),
  dockerImageName: z.string(),
  dockerImageTag: z.string(),
  dockerImageRegistry: z.string().optional(),
  shmSize: z.string().optional(),
  minEphemeralStorage: z.string().optional(),
  maxEphemeralStorage: z.string().optional(),
  kioskConfigURL: z.string().optional(),
  maxCPU: z.string().optional(),
  minCPU: z.string().optional(),
  maxMemory: z.string().optional(),
  minMemory: z.string().optional(),
  iconURL: z.string().optional(),
  url: z.string().optional()
})

export const AppUpdateSchema = AppCreateSchema.extend({
  id: z.string()
})

export type App = z.infer<typeof AppSchema>

export type AppCreateType = z.infer<typeof AppCreateSchema>

export type AppUpdateType = z.infer<typeof AppUpdateSchema>

export interface AppResponse {
  data?: App
  error?: string
}

export interface AppsResponse {
  data?: App[]
  error?: string
}
