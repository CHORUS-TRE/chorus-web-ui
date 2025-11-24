import { z } from 'zod'

export const devStoreEntrySchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string()
})

export type DevStoreEntry = z.infer<typeof devStoreEntrySchema>

export const devStoreEntriesSchema = z.record(z.string(), z.string())

export type DevStoreEntries = z.infer<typeof devStoreEntriesSchema>
