import { z } from 'zod'

export enum WorkspaceState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
  UNKNOWN = ''
}

// future fields, implemented in dev store
export const WorkspaceMetaSchema = z.object({
  image: z.string().optional(),
  tag: z.enum(['center', 'project']).optional(),
  PI: z.string().optional(),
  memberCount: z.number().optional(),
  workbenchCount: z.number().optional(),
  files: z.number().optional()
})

export const WorkspaceSchema = WorkspaceMetaSchema.extend({
  id: z.string(),
  tenantId: z.string(),
  userId: z.string(),
  name: z.string(),
  shortName: z.string(),
  description: z.string().optional(),
  status: z.nativeEnum(WorkspaceState),
  isMain: z.boolean().optional(),
  appInsanceIds: z.array(z.string()).optional(),
  appInstances: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const WorkspaceCreateSchema = z.object({
  tenantId: z.string(),
  userId: z.string(),
  name: z.string().min(1, 'Name is required'),
  shortName: z.string().min(3, 'Short name is required'),
  description: z.string().optional(),
  isMain: z.boolean().optional()
})

export const WorkspaceEditFormSchema = WorkspaceCreateSchema // For form validation

export const WorkspaceUpdateSchema = WorkspaceCreateSchema.extend({
  id: z.string()
})

export type Workspace = z.infer<typeof WorkspaceSchema>
export type WorkspaceCreateType = z.infer<typeof WorkspaceCreateSchema>
export type WorkspaceUpdatetype = z.infer<typeof WorkspaceUpdateSchema>
