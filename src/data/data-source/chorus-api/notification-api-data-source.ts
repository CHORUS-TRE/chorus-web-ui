import {
  ChorusCountUnreadNotificationsReply,
  ChorusGetNotificationsReply,
  Configuration,
  NotificationServiceApi,
  NotificationServiceGetNotificationsRequest,
  NotificationServiceMarkNotificationsAsReadRequest
} from '@/internal/client'

export interface NotificationDataSource {
  countUnreadNotifications(): Promise<ChorusCountUnreadNotificationsReply>
  getNotifications(
    params: NotificationServiceGetNotificationsRequest
  ): Promise<ChorusGetNotificationsReply>
  markNotificationsAsRead(
    params: NotificationServiceMarkNotificationsAsReadRequest
  ): Promise<void>
}

export class NotificationApiDataSourceImpl implements NotificationDataSource {
  private service: NotificationServiceApi

  constructor(basePath: string) {
    const configuration = new Configuration({
      basePath,
      credentials: 'include'
    })
    this.service = new NotificationServiceApi(configuration)
  }

  countUnreadNotifications(): Promise<ChorusCountUnreadNotificationsReply> {
    return this.service.notificationServiceCountUnreadNotifications()
  }

  getNotifications(
    params: NotificationServiceGetNotificationsRequest
  ): Promise<ChorusGetNotificationsReply> {
    return this.service.notificationServiceGetNotifications(params)
  }

  async markNotificationsAsRead(
    params: NotificationServiceMarkNotificationsAsReadRequest
  ): Promise<void> {
    await this.service.notificationServiceMarkNotificationsAsRead(params)
  }
}
