'use client'
import { env } from 'next-runtime-env'

import { NotificationApiDataSourceImpl } from '@/data/data-source'
import { NotificationRepositoryImpl } from '@/data/repository'
import { Notification, Result } from '@/domain/model'
import { ListNotifications } from '@/domain/use-cases/notification/list-notifications'
import { MarkNotificationsAsRead } from '@/domain/use-cases/notification/mark-notifications-as-read'
import { NotificationServiceGetNotificationsRequest } from '@/internal/client'

const getRepository = async () => {
  const dataSource = new NotificationApiDataSourceImpl(
    env('NEXT_PUBLIC_API_URL') || ''
  )
  return new NotificationRepositoryImpl(dataSource)
}

export async function listNotifications(
  params?: NotificationServiceGetNotificationsRequest
): Promise<Result<Notification[]>> {
  const repository = await getRepository()
  const useCase = new ListNotifications(repository)
  return await useCase.execute(params)
}

export async function countUnreadNotifications(): Promise<Result<number>> {
  const result = await listNotifications({ isRead: false, paginationLimit: 1 })
  if (result.error) {
    return { error: result.error, issues: result.issues }
  }
  return { data: result.totalItems ?? 0 }
}

export async function markNotificationsAsRead(
  ids: string[]
): Promise<Result<void>> {
  const repository = await getRepository()
  const useCase = new MarkNotificationsAsRead(repository)
  return await useCase.execute(ids)
}
