import { Result } from '@/domain/model'
import { NotificationRepository } from '@/domain/repository'

export class CountUnreadNotifications {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(): Promise<Result<number>> {
    return this.repository.countUnread()
  }
}
