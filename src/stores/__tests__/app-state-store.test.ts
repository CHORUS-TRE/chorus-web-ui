import type { Notification } from '@/domain/model/notification'
import { countMyApprovalRequests } from '@/view-model/approval-request-view-model'
import {
  countUnreadNotifications,
  listNotifications,
  markNotificationsAsRead
} from '@/view-model/notification-view-model'

import { useAppStateStore } from '../app-state-store'

jest.mock('../../view-model/notification-view-model')
jest.mock('../../view-model/approval-request-view-model')

const mockedCountUnread = countUnreadNotifications as jest.MockedFunction<
  typeof countUnreadNotifications
>
const mockedListNotifications = listNotifications as jest.MockedFunction<
  typeof listNotifications
>
const mockedMarkAsRead = markNotificationsAsRead as jest.MockedFunction<
  typeof markNotificationsAsRead
>
const mockedCountMyApprovalRequests =
  countMyApprovalRequests as jest.MockedFunction<typeof countMyApprovalRequests>

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

describe('onApprovalDecision', () => {
  const notificationFor = (id: string, requestId: string): Notification => ({
    id,
    message: `notification ${id}`,
    createdAt: new Date('2026-07-01T00:00:00Z'),
    content: {
      approvalRequestNotification: { approvalRequestId: requestId }
    }
  })

  beforeEach(() => {
    mockedCountUnread.mockReset()
    mockedListNotifications.mockReset()
    mockedMarkAsRead.mockReset()
    mockedCountMyApprovalRequests.mockReset()
    mockedCountMyApprovalRequests.mockResolvedValue({
      data: { total: 0, totalApprover: 0, totalRequester: 0 }
    })
    useAppStateStore.setState({
      notifications: undefined,
      unreadNotificationsCount: undefined,
      approvalRequestCounts: undefined
    })
  })

  it('marks the linked unread notification as read and refreshes counts', async () => {
    mockedListNotifications
      .mockResolvedValueOnce({
        data: [notificationFor('n1', 'req-1'), notificationFor('n2', 'req-2')],
        totalItems: 2
      })
      .mockResolvedValueOnce({ data: [], totalItems: 0 })
    mockedMarkAsRead.mockResolvedValue({ data: undefined })
    mockedCountUnread.mockResolvedValue({ data: 0 })

    await useAppStateStore.getState().onApprovalDecision('req-1')

    expect(mockedMarkAsRead).toHaveBeenCalledWith(['n1'])
    expect(mockedCountMyApprovalRequests).toHaveBeenCalledTimes(1)
    expect(useAppStateStore.getState().approvalRequestCounts?.total).toBe(0)
  })

  it('pages through the unread set to find a match beyond the first page', async () => {
    const page1 = Array.from({ length: 100 }, (_, i) =>
      notificationFor(`n${i}`, 'other-request')
    )
    mockedListNotifications
      .mockResolvedValueOnce({ data: page1, totalItems: 101 })
      .mockResolvedValueOnce({
        data: [notificationFor('n100', 'req-target')],
        totalItems: 101
      })
      .mockResolvedValueOnce({ data: [], totalItems: 0 })
    mockedMarkAsRead.mockResolvedValue({ data: undefined })
    mockedCountUnread.mockResolvedValue({ data: 0 })

    await useAppStateStore.getState().onApprovalDecision('req-target')

    expect(mockedListNotifications).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ isRead: false, paginationOffset: 0 })
    )
    expect(mockedListNotifications).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ isRead: false, paginationOffset: 100 })
    )
    expect(mockedMarkAsRead).toHaveBeenCalledWith(['n100'])
  })

  it('does not call markNotificationsAsRead when there is no match', async () => {
    mockedListNotifications
      .mockResolvedValueOnce({
        data: [notificationFor('n1', 'unrelated-request')],
        totalItems: 1
      })
      .mockResolvedValueOnce({ data: [], totalItems: 0 })
    mockedCountUnread.mockResolvedValue({ data: 1 })

    await useAppStateStore.getState().onApprovalDecision('req-1')

    expect(mockedMarkAsRead).not.toHaveBeenCalled()
    expect(mockedCountMyApprovalRequests).toHaveBeenCalledTimes(1)
  })

  it('still refreshes counts even if the notification search throws', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockedListNotifications
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce({ data: [], totalItems: 0 })
    mockedCountUnread.mockResolvedValue({ data: 0 })

    await useAppStateStore.getState().onApprovalDecision('req-1')

    expect(mockedMarkAsRead).not.toHaveBeenCalled()
    expect(mockedCountMyApprovalRequests).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})
