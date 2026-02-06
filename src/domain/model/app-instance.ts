import { z } from 'zod'

export enum AppInstanceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
  UNKNOWN = 'unknown'
}

export enum K8sAppInstanceState {
  RUNNING = 'Running',
  STOPPED = 'Stopped',
  KILLED = 'Killed',
  UNKNOWN = ''
}

export enum K8sAppInstanceStatus {
  RUNNING = 'Running',
  COMPLETE = 'Complete',
  PROGRESSING = 'Progressing',
  FAILED = 'Failed',
  STOPPING = 'Stopping',
  STOPPED = 'Stopped',
  KILLING = 'Killing',
  KILLED = 'Killed',
  UNKNOWN = 'Unknown',
  EMPTY = ''
}

export const AppInstanceSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  userId: z.string(),
  appId: z.string(),
  name: z.string().optional(),
  workspaceId: z.string(),
  workbenchId: z.string(),
  status: z.nativeEnum(AppInstanceStatus),
  k8sStatus: z.nativeEnum(K8sAppInstanceStatus).optional(),
  k8sMessage: z.string().optional(),
  k8sState: z.nativeEnum(K8sAppInstanceState).optional(),
  initialResolutionWidth: z.number().optional(),
  initialResolutionHeight: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const AppInstanceCreateSchema = z.object({
  tenantId: z.string(),
  userId: z.string(),
  appId: z.string(),
  workspaceId: z.string(),
  workbenchId: z.string(),
  status: z.string()
})

export const AppInstanceUpdateSchema = AppInstanceCreateSchema.extend({
  id: z.string()
})

export const AppInstanceEditFormSchema = AppInstanceCreateSchema.extend({})

export type AppInstance = z.infer<typeof AppInstanceSchema>

export type AppInstanceCreateType = z.infer<typeof AppInstanceCreateSchema>

export type AppInstanceUpdateType = z.infer<typeof AppInstanceUpdateSchema>
