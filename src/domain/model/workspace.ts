import { z } from 'zod'

import { UserSchema } from './user'
import {
  NetworkPolicyEnum,
  ResourcePresetEnum,
  WorkspaceConfigSchema
} from './workspace-config'

export enum WorkspaceState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
  UNKNOWN = ''
}

// Workspace conforming to API (no DevStore enrichments)
export const WorkspaceSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  userId: z.string(),
  name: z.string(),
  shortName: z.string(),
  description: z.string().optional(),
  status: z.nativeEnum(WorkspaceState),
  isMain: z.boolean().optional(),
  appInstanceIds: z.array(z.string()).optional(),
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

// DevStore enrichments + computed for UI
export const WorkspaceDevSchema = z.object({
  // DevStore fields
  image: z.union([z.any(), z.null()]).optional(),
  config: WorkspaceConfigSchema.optional(),

  // Computed fields (UI)
  owner: z.string().optional(),
  memberCount: z.number().default(0),
  members: z.array(UserSchema).optional(),
  workbenchCount: z.number().default(0),
  files: z.number().default(0)
})

export const WorkspaceWithDevSchema = WorkspaceSchema.extend({
  dev: WorkspaceDevSchema.optional()
})

// Schema for validating DevStore fields from forms
export const WorkspaceDevFormSchema = z.object({
  image: z.union([z.any(), z.null()]).optional(),
  descriptionMarkdown: z.string().optional(),
  network: NetworkPolicyEnum.optional(),
  allowCopyPaste: z.boolean().optional(),
  resourcePreset: ResourcePresetEnum.optional(),
  gpu: z.number().int().min(0).optional(),
  cpu: z.string().optional(),
  memory: z.string().optional(),
  coldStorageEnabled: z.boolean().optional(),
  coldStorageSize: z.string().optional(),
  hotStorageEnabled: z.boolean().optional(),
  hotStorageSize: z.string().optional(),
  serviceGitlab: z.boolean().optional(),
  serviceK8s: z.boolean().optional(),
  serviceHpc: z.boolean().optional()
})

export type Workspace = z.infer<typeof WorkspaceSchema>
export type WorkspaceDev = z.infer<typeof WorkspaceDevSchema>
export type WorkspaceWithDev = z.infer<typeof WorkspaceWithDevSchema>
export type WorkspaceCreateType = z.infer<typeof WorkspaceCreateSchema>
export type WorkspaceUpdatetype = z.infer<typeof WorkspaceUpdateSchema>
export type WorkspaceDevFormType = z.infer<typeof WorkspaceDevFormSchema>
