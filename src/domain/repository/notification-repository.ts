import { NotificationServiceGetNotificationsRequest } from '@/internal/client'

import { Result } from '../model'
import { Notification } from '../model/notification'

export interface NotificationRepository {
  list(
    params?: NotificationServiceGetNotificationsRequest
  ): Promise<Result<Notification[]>>
  countUnread(): Promise<Result<number>>
  markAsRead(ids: string[]): Promise<Result<void>>
}
