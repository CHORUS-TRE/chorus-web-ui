import { z } from 'zod'

export const AppSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  description: z.string().optional(),
  ownerId: z.string(),
  memberIds: z.array(z.string()),
  tags: z.array(z.string()),
  status: z.string(),
  serviceIds: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  archivedAt: z.string().optional()
})

export type App = z.infer<typeof AppSchema>
