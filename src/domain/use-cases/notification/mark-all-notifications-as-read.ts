import { Result } from '@/domain/model'
import { NotificationRepository } from '@/domain/repository'

export class MarkAllNotificationsAsRead {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(): Promise<Result<void>> {
    return this.repository.markAllAsRead()
  }
}
