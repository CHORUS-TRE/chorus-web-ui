import { z } from 'zod'

export const SystemNotificationSchema = z.object({
  refreshJWTRequired: z.boolean().optional()
})

export const ApprovalRequestNotificationSchema = z.object({
  approvalRequestId: z.string().optional(),
  // Lowercase casing (not autoApproved) matches the backend API field name.
  autoapproved: z.boolean().optional()
})

// Mirrors the backend's `oneof content` — a notification carries at most one
// of the two variants, never both. The wire shape has no literal tag field to
// switch on (just whichever key is present), so this can't be a
// z.discriminatedUnion; the refine below enforces the same invariant instead.
export const NotificationContentSchema = z
  .object({
    systemNotification: SystemNotificationSchema.optional(),
    approvalRequestNotification: ApprovalRequestNotificationSchema.optional()
  })
  .refine(
    (content) =>
      !(content.systemNotification && content.approvalRequestNotification),
    { message: 'NotificationContent must not set both oneof variants' }
  )

export const NotificationSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().optional(),
  userId: z.string().optional(),
  message: z.string().optional(),
  content: NotificationContentSchema.optional(),
  createdAt: z.date().optional(),
  readAt: z.date().optional()
})

export type Notification = z.infer<typeof NotificationSchema>
export type NotificationContent = z.infer<typeof NotificationContentSchema>
export type SystemNotification = z.infer<typeof SystemNotificationSchema>
export type ApprovalRequestNotification = z.infer<
  typeof ApprovalRequestNotificationSchema
>
