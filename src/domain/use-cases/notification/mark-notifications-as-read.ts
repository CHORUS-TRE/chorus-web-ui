import { Result } from '@/domain/model'
import { NotificationRepository } from '@/domain/repository'

export class MarkNotificationsAsRead {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(ids: string[]): Promise<Result<void>> {
    return this.repository.markAsRead(ids)
  }
}
