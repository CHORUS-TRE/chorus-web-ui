import { z } from 'zod'

export const feedbackStatusSchema = z.enum([
  'open',
  'in-review',
  'resolved',
  'archived'
])

export const feedbackCommentSchema = z.object({
  id: z.string().min(1),
  path: z.string().startsWith('/').optional(),
  sel: z.string().min(1),
  ox: z.number(),
  oy: z.number(),
  label: z.string(),
  text: z.string().min(1)
})

export const feedbackRecordSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  status: feedbackStatusSchema,
  source: z.object({
    path: z.string().startsWith('/'),
    title: z.string(),
    workspaceId: z.string().optional(),
    pages: z.array(z.string().startsWith('/')).optional()
  }),
  reporter: z.object({
    userId: z.string().min(1),
    displayName: z.string().min(1)
  }),
  comments: z.array(feedbackCommentSchema).min(1),
  adminNote: z.string().optional()
})

export type FeedbackStatus = z.infer<typeof feedbackStatusSchema>
export type FeedbackComment = z.infer<typeof feedbackCommentSchema>
export type FeedbackRecord = z.infer<typeof feedbackRecordSchema>
export type FeedbackRecordInput = Omit<
  FeedbackRecord,
  'schemaVersion' | 'id' | 'createdAt' | 'updatedAt' | 'status'
>
