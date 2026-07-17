'use client'

import {
  FeedbackRecord,
  FeedbackRecordInput,
  feedbackRecordSchema,
  FeedbackStatus,
  Result
} from '@/domain/model'

import {
  deleteGlobalEntry,
  listGlobalEntries,
  putGlobalEntry
} from './dev-store-view-model'

export const FEEDBACK_ENTRY_PREFIX = 'feedback.v1.'

const feedbackKey = (id: string) => `${FEEDBACK_ENTRY_PREFIX}${id}`

export async function submitFeedback(
  input: FeedbackRecordInput
): Promise<Result<FeedbackRecord>> {
  const now = new Date().toISOString()
  const record = feedbackRecordSchema.parse({
    ...input,
    schemaVersion: 1,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    status: 'open'
  })
  const result = await putGlobalEntry({
    key: feedbackKey(record.id),
    value: JSON.stringify(record)
  })
  return result.error ? { error: result.error } : { data: record }
}

export async function listFeedback(): Promise<Result<FeedbackRecord[]>> {
  const result = await listGlobalEntries()
  if (result.error) return { error: result.error }

  const feedback: FeedbackRecord[] = []
  for (const [key, value] of Object.entries(result.data || {})) {
    if (!key.startsWith(FEEDBACK_ENTRY_PREFIX)) continue
    try {
      feedback.push(feedbackRecordSchema.parse(JSON.parse(value)))
    } catch (error) {
      console.error(`Ignoring malformed feedback entry ${key}`, error)
    }
  }

  return {
    data: feedback.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }
}

export async function updateFeedback(
  record: FeedbackRecord,
  patch: { status?: FeedbackStatus; adminNote?: string }
): Promise<Result<FeedbackRecord>> {
  const updated = feedbackRecordSchema.parse({
    ...record,
    ...patch,
    updatedAt: new Date().toISOString()
  })
  const result = await putGlobalEntry({
    key: feedbackKey(updated.id),
    value: JSON.stringify(updated)
  })
  return result.error ? { error: result.error } : { data: updated }
}

export async function deleteFeedback(id: string): Promise<Result<void>> {
  return deleteGlobalEntry(feedbackKey(id))
}
