import { z } from 'zod'

export const EdgeSchema = z.object({
  edgeId: z.string(),
  source: z.string(),
  target: z.string(),
  relationship: z.string()
})

export type Edge = z.infer<typeof EdgeSchema>
