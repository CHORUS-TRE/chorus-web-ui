import { z } from 'zod'

export const SystemNotificationSchema = z.object({
  refreshJWTRequired: z.boolean().optional()
})

export const ApprovalRequestNotificationSchema = z.object({
  approvalRequestId: z.string().optional()
})

export const NotificationContentSchema = z.object({
  systemNotification: SystemNotificationSchema.optional(),
  approvalRequestNotification: ApprovalRequestNotificationSchema.optional()
})

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
