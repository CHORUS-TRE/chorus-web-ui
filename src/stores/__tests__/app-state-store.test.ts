import type { Notification } from '@/domain/model/notification'
import {
  countUnreadNotifications,
  listNotifications
} from '@/view-model/notification-view-model'

import { useAppStateStore } from '../app-state-store'

jest.mock('../../view-model/notification-view-model')

const mockedCountUnread = countUnreadNotifications as jest.MockedFunction<
  typeof countUnreadNotifications
>
const mockedListNotifications = listNotifications as jest.MockedFunction<
  typeof listNotifications
>

const notification = (id: string): Notification => ({
  id,
  message: `notification ${id}`,
  createdAt: new Date('2026-07-01T00:00:00Z')
})

describe('refreshNotifications polling behavior', () => {
  beforeEach(() => {
    mockedCountUnread.mockReset()
    mockedListNotifications.mockReset()
    useAppStateStore.setState({
      notifications: undefined,
      unreadNotificationsCount: undefined
    })
  })

  it('fetches the full list on the first poll even when the count is 0', async () => {
    mockedCountUnread.mockResolvedValue({ data: 0 })
    mockedListNotifications.mockResolvedValue({ data: [] })

    await useAppStateStore.getState().refreshNotifications()

    expect(mockedListNotifications).toHaveBeenCalledTimes(1)
    expect(useAppStateStore.getState().unreadNotificationsCount).toBe(0)
    expect(useAppStateStore.getState().notifications).toEqual([])
  })

  it('skips the full list fetch on the next poll when the count is unchanged', async () => {
    mockedCountUnread.mockResolvedValue({ data: 2 })
    mockedListNotifications.mockResolvedValue({
      data: [notification('1'), notification('2')]
    })
    await useAppStateStore.getState().refreshNotifications()
    expect(mockedListNotifications).toHaveBeenCalledTimes(1)

    mockedCountUnread.mockResolvedValue({ data: 2 })
    await useAppStateStore.getState().refreshNotifications()

    expect(mockedListNotifications).toHaveBeenCalledTimes(1)
    expect(useAppStateStore.getState().unreadNotificationsCount).toBe(2)
  })

  it('fetches the full list again when the count changed since the last poll', async () => {
    mockedCountUnread.mockResolvedValue({ data: 2 })
    mockedListNotifications.mockResolvedValue({
      data: [notification('1'), notification('2')]
    })
    await useAppStateStore.getState().refreshNotifications()
    expect(mockedListNotifications).toHaveBeenCalledTimes(1)

    mockedCountUnread.mockResolvedValue({ data: 3 })
    mockedListNotifications.mockResolvedValue({
      data: [notification('1'), notification('2'), notification('3')]
    })
    await useAppStateStore.getState().refreshNotifications()

    expect(mockedListNotifications).toHaveBeenCalledTimes(2)
    expect(useAppStateStore.getState().unreadNotificationsCount).toBe(3)
  })

  it('does not fetch the list and logs on a count error', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockedCountUnread.mockResolvedValue({
      error: { code: 'CONVERSION_ERROR', message: 'boom' }
    })

    await useAppStateStore.getState().refreshNotifications()

    expect(mockedListNotifications).not.toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})
