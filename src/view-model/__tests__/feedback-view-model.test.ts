import {
  deleteGlobalEntry,
  listGlobalEntries,
  putGlobalEntry
} from '../dev-store-view-model'
import {
  deleteFeedback,
  FEEDBACK_ENTRY_PREFIX,
  listFeedback,
  submitFeedback,
  updateFeedback
} from '../feedback-view-model'

jest.mock('../dev-store-view-model', () => ({
  deleteGlobalEntry: jest.fn(),
  listGlobalEntries: jest.fn(),
  putGlobalEntry: jest.fn()
}))

const mockedDelete = jest.mocked(deleteGlobalEntry)
const mockedList = jest.mocked(listGlobalEntries)
const mockedPut = jest.mocked(putGlobalEntry)

const record = {
  schemaVersion: 1 as const,
  id: '123e4567-e89b-42d3-a456-426614174000',
  createdAt: '2026-07-16T12:00:00.000Z',
  updatedAt: '2026-07-16T12:00:00.000Z',
  status: 'open' as const,
  source: { path: '/workspaces', title: 'CHORUS' },
  reporter: { userId: 'user-1', displayName: 'Ada Lovelace' },
  comments: [
    {
      id: 'comment-1',
      sel: '#content',
      ox: 0.5,
      oy: 0.5,
      label: 'Content',
      text: 'This needs clarification.'
    }
  ]
}

describe('feedback view model', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedPut.mockResolvedValue({ data: { key: '', value: '' } })
    mockedDelete.mockResolvedValue({ data: undefined })
  })

  it('stores one namespaced DevStore entry per submission', async () => {
    jest.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(record.id)

    const result = await submitFeedback({
      source: record.source,
      reporter: record.reporter,
      comments: record.comments
    })

    expect(result.data?.id).toBe(record.id)
    expect(mockedPut).toHaveBeenCalledTimes(1)
    const entry = mockedPut.mock.calls[0][0]
    expect(entry.key).toBe(`${FEEDBACK_ENTRY_PREFIX}${record.id}`)
    expect(JSON.parse(entry.value)).toMatchObject({
      id: record.id,
      status: 'open',
      reporter: record.reporter
    })
  })

  it('lists only valid feedback entries newest first', async () => {
    const newer = {
      ...record,
      id: '123e4567-e89b-42d3-a456-426614174001',
      createdAt: '2026-07-17T12:00:00.000Z',
      updatedAt: '2026-07-17T12:00:00.000Z'
    }
    mockedList.mockResolvedValue({
      data: {
        configuration: 'unrelated',
        [`${FEEDBACK_ENTRY_PREFIX}${record.id}`]: JSON.stringify(record),
        [`${FEEDBACK_ENTRY_PREFIX}${newer.id}`]: JSON.stringify(newer),
        [`${FEEDBACK_ENTRY_PREFIX}broken`]: '{not-json'
      }
    })
    jest.spyOn(console, 'error').mockImplementation(() => undefined)

    const result = await listFeedback()

    expect(result.data?.map((item) => item.id)).toEqual([newer.id, record.id])
  })

  it('updates and deletes the same namespaced entry', async () => {
    const updated = await updateFeedback(record, {
      status: 'resolved',
      adminNote: 'Fixed in the next release.'
    })
    expect(updated.data).toMatchObject({
      id: record.id,
      status: 'resolved',
      adminNote: 'Fixed in the next release.'
    })
    expect(mockedPut.mock.calls[0][0].key).toBe(
      `${FEEDBACK_ENTRY_PREFIX}${record.id}`
    )

    await deleteFeedback(record.id)
    expect(mockedDelete).toHaveBeenCalledWith(
      `${FEEDBACK_ENTRY_PREFIX}${record.id}`
    )
  })
})
