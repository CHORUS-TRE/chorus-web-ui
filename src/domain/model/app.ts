import { z } from 'zod'

export enum AppState {
  UNINITIALIZED = 'uninitialized',
  CREATED = 'created',
  LOADING = 'loading',
  ACTIVE = 'active',
  STOPPING = 'stopping',
  EXITED = 'exited'
}

export const AppCreateSchema = z.object({
  tenantId: z.string(),
  ownerId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  dockerImageName: z.string(),
  dockerImageTag: z.string()
})

export const AppSchema = AppCreateSchema.extend({
  id: z.string(),
  status: z.nativeEnum(AppState),

  createdAt: z.date(),
  updatedAt: z.date()
})

export type AppCreate = z.infer<typeof AppCreateSchema>
export type App = z.infer<typeof AppSchema>

export interface AppResponse {
  data?: App
  error?: string
}

export interface AppsResponse {
  data?: App[]
  error?: string
}
