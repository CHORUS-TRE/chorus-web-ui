import { z } from 'zod'

import { WorkspaceState } from './workspace'

export const PublicWorkspaceSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  shortName: z.string().optional(),
  description: z.string().optional(),
  status: z.nativeEnum(WorkspaceState),
  contactUsername: z.string().optional(),
  contactFirstName: z.string().optional(),
  contactLastName: z.string().optional(),
  contactEmail: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export type PublicWorkspace = z.infer<typeof PublicWorkspaceSchema>
