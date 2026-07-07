import { NotificationSchema } from '@/domain/model/notification'

describe('NotificationSchema', () => {
  it('parses an approval-request notification including autoapproved', () => {
    const result = NotificationSchema.safeParse({
      id: '1',
      content: {
        approvalRequestNotification: {
          approvalRequestId: 'req-1',
          autoapproved: true
        }
      }
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(
        result.data.content?.approvalRequestNotification?.autoapproved
      ).toBe(true)
    }
  })

  it('parses a system notification with no approval-request variant set', () => {
    const result = NotificationSchema.safeParse({
      id: '1',
      content: { systemNotification: { refreshJWTRequired: true } }
    })
    expect(result.success).toBe(true)
  })

  it('parses content with neither variant set', () => {
    const result = NotificationSchema.safeParse({ id: '1', content: {} })
    expect(result.success).toBe(true)
  })

  it('rejects content that sets both oneof variants at once', () => {
    const result = NotificationSchema.safeParse({
      id: '1',
      content: {
        systemNotification: { refreshJWTRequired: true },
        approvalRequestNotification: { approvalRequestId: 'req-1' }
      }
    })
    expect(result.success).toBe(false)
  })
})
