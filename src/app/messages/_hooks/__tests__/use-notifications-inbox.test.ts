import { act, renderHook, waitFor } from '@testing-library/react'

import type { Notification } from '@/domain/model/notification'
import { listNotifications } from '@/view-model/notification-view-model'

import {
  type InboxTab,
  isSystemNotification,
  notificationToInboxItem,
  useNotificationsInbox
} from '../use-notifications-inbox'

jest.mock('../../../../view-model/notification-view-model')

const mockedListNotifications = listNotifications as jest.MockedFunction<
  typeof listNotifications
>

describe('isSystemNotification', () => {
  it('returns true when content.systemNotification is set', () => {
    const n: Notification = {
      id: '1',
      content: { systemNotification: { refreshJWTRequired: true } }
    }
    expect(isSystemNotification(n)).toBe(true)
  })

  it('returns false for approval-request notifications', () => {
    const n: Notification = {
      id: '1',
      content: { approvalRequestNotification: { approvalRequestId: '42' } }
    }
    expect(isSystemNotification(n)).toBe(false)
  })

  it('returns false when content is undefined', () => {
    const n: Notification = { id: '1' }
    expect(isSystemNotification(n)).toBe(false)
  })
})

describe('notificationToInboxItem', () => {
  it('maps a notification to an InboxItem', () => {
    const createdAt = new Date('2026-07-01T10:00:00Z')
    const n: Notification = {
      id: 'notif-1',
      message: "Approval request 'X' has been approved.",
      createdAt,
      readAt: undefined,
      content: {
        approvalRequestNotification: { approvalRequestId: 'req-1' }
      }
    }

    expect(notificationToInboxItem(n)).toEqual({
      id: 'notif-1',
      title: "Approval request 'X' has been approved.",
      timestamp: createdAt,
      isRead: false,
      approvalRequestId: 'req-1'
    })
  })

  it('marks isRead true when readAt is set', () => {
    const n: Notification = {
      id: 'notif-2',
      message: 'hello',
      createdAt: new Date('2026-07-01T10:00:00Z'),
      readAt: new Date('2026-07-01T11:00:00Z')
    }
    expect(notificationToInboxItem(n).isRead).toBe(true)
  })

  it('omits approvalRequestId when there is no approval-request content', () => {
    const n: Notification = {
      id: 'notif-3',
      message: 'hello',
      createdAt: new Date('2026-07-01T10:00:00Z')
    }
    expect(notificationToInboxItem(n).approvalRequestId).toBeUndefined()
  })

  it('falls back to a generated id and default title when missing', () => {
    const n: Notification = { createdAt: new Date('2026-07-01T10:00:00Z') }
    const item = notificationToInboxItem(n)
    expect(item.id).toBeTruthy()
    expect(item.title).toBe('Notification')
  })
})

describe('useNotificationsInbox', () => {
  beforeEach(() => {
    mockedListNotifications.mockReset()
  })

  it('requests isRead: false for the unread tab and excludes system notifications', async () => {
    mockedListNotifications.mockResolvedValue({
      data: [
        {
          id: '1',
          message: 'Approval pending',
          createdAt: new Date('2026-07-01T10:00:00Z'),
          content: {
            approvalRequestNotification: { approvalRequestId: 'req-1' }
          }
        },
        {
          id: '2',
          message: 'Refresh token',
          createdAt: new Date('2026-07-01T11:00:00Z'),
          content: { systemNotification: { refreshJWTRequired: true } }
        }
      ],
      totalItems: 2
    })

    const { result } = renderHook(() => useNotificationsInbox('unread'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(mockedListNotifications).toHaveBeenCalledWith(
      expect.objectContaining({
        isRead: false,
        paginationLimit: 20,
        paginationOffset: 0
      })
    )
    // System notifications are never rendered, only the approval-request one.
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].id).toBe('1')
  })

  it('requests isRead: undefined for the all tab', async () => {
    mockedListNotifications.mockResolvedValue({ data: [], totalItems: 0 })

    const { result } = renderHook(() => useNotificationsInbox('all'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(mockedListNotifications).toHaveBeenCalledWith(
      expect.objectContaining({ isRead: undefined })
    )
  })

  it('requests the next page with an explicit offset', async () => {
    mockedListNotifications.mockResolvedValue({ data: [], totalItems: 45 })

    const { result } = renderHook(() => useNotificationsInbox('all'))
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    mockedListNotifications.mockClear()
    act(() => result.current.setPageIndex(1))

    await waitFor(() =>
      expect(mockedListNotifications).toHaveBeenCalledWith(
        expect.objectContaining({ paginationOffset: 20, paginationLimit: 20 })
      )
    )
  })

  it('resets to page 0 and refetches when the tab changes', async () => {
    mockedListNotifications.mockResolvedValue({ data: [], totalItems: 45 })

    const { result, rerender } = renderHook(
      ({ tab }) => useNotificationsInbox(tab),
      { initialProps: { tab: 'all' as InboxTab } }
    )
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    act(() => result.current.setPageIndex(2))
    await waitFor(() => expect(result.current.pageIndex).toBe(2))

    mockedListNotifications.mockClear()
    rerender({ tab: 'unread' })

    await waitFor(() =>
      expect(mockedListNotifications).toHaveBeenCalledWith(
        expect.objectContaining({ isRead: false, paginationOffset: 0 })
      )
    )
    expect(result.current.pageIndex).toBe(0)
  })
})
