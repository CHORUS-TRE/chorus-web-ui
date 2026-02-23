import { Notification, Result } from '@/domain/model'
import { NotificationRepository } from '@/domain/repository'
import { NotificationServiceGetNotificationsRequest } from '@/internal/client'

export class ListNotifications {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(
    params?: NotificationServiceGetNotificationsRequest
  ): Promise<Result<Notification[]>> {
    return this.repository.list(params)
  }
}
