import { z } from 'zod'

import { Result } from '@/domain/model'
import { Notification, NotificationSchema } from '@/domain/model/notification'
import { NotificationRepository } from '@/domain/repository/notification-repository'
import { NotificationServiceGetNotificationsRequest } from '@/internal/client'

import { NotificationDataSource } from '../data-source'

export class NotificationRepositoryImpl implements NotificationRepository {
  private dataSource: NotificationDataSource

  constructor(dataSource: NotificationDataSource) {
    this.dataSource = dataSource
  }

  async list(
    params: NotificationServiceGetNotificationsRequest = {}
  ): Promise<Result<Notification[]>> {
    try {
      const response = await this.dataSource.getNotifications(params)
      const notificationsResult = z
        .array(NotificationSchema)
        .safeParse(response.result?.notifications)

      if (!notificationsResult.success) {
        return {
          error: 'API response validation failed',
          issues: notificationsResult.error.issues
        }
      }

      return { data: notificationsResult.data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async countUnread(): Promise<Result<number>> {
    try {
      const response = await this.dataSource.countUnreadNotifications()
      const count = response.result?.count

      if (count === undefined) {
        return { error: 'API response validation failed' }
      }

      return { data: Number(count) }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async markAsRead(ids: string[]): Promise<Result<void>> {
    try {
      await this.dataSource.markNotificationsAsRead({
        body: { notificationIds: ids }
      })
      return { data: undefined }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }
}
