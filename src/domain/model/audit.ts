import { z } from 'zod'

export const AuditEntrySchema = z.object({
  id: z.string(),
  actorid: z.string(),
  actorUsername: z.string(),
  correlationId: z.string().optional(),
  action: z.string().optional(),
  workspaceId: z.string().optional(),
  workbenchId: z.string().optional(),
  userId: z.string().optional(),
  description: z.string().optional(),
  details: z.record(z.string(), z.string()).optional(),
  createdAt: z.coerce.date().optional()
})

export const AuditEntryListSchema = z.array(AuditEntrySchema)

export type AuditEntry = z.infer<typeof AuditEntrySchema>
