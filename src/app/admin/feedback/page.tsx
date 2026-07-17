'use client'

import { MessageSquareText, RefreshCw, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { errorToast } from '@/components/error-toast'
import { toast } from '@/components/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { FeedbackRecord, FeedbackStatus } from '@/domain/model'
import {
  deleteFeedback,
  listFeedback,
  updateFeedback
} from '@/view-model/feedback-view-model'

const statuses: Array<{ value: FeedbackStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in-review', label: 'In review' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'archived', label: 'Archived' }
]

const statusLabel = (status: FeedbackStatus) =>
  statuses.find((item) => item.value === status)?.label || status

export default function AdminFeedbackPage() {
  const [records, setRecords] = useState<FeedbackRecord[]>([])
  const [selectedId, setSelectedId] = useState<string>()
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | 'all'>(
    'open'
  )
  const [adminNote, setAdminNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const selected = records.find((record) => record.id === selectedId)
  const filtered = useMemo(
    () =>
      statusFilter === 'all'
        ? records
        : records.filter((record) => record.status === statusFilter),
    [records, statusFilter]
  )

  const load = useCallback(async () => {
    setLoading(true)
    const result = await listFeedback()
    setLoading(false)
    if (result.error) {
      toast({ ...errorToast(result.error), variant: 'destructive' })
      return
    }
    setRecords(result.data || [])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const selectRecord = (record: FeedbackRecord) => {
    setSelectedId(record.id)
    setAdminNote(record.adminNote || '')
  }

  const save = async (status: FeedbackStatus = selected?.status || 'open') => {
    if (!selected) return
    setSaving(true)
    const result = await updateFeedback(selected, {
      status,
      adminNote: adminNote.trim() || undefined
    })
    setSaving(false)
    if (result.error) {
      toast({ ...errorToast(result.error), variant: 'destructive' })
      return
    }
    if (result.data) {
      setRecords((current) =>
        current.map((record) =>
          record.id === result.data?.id ? result.data : record
        )
      )
      toast({ title: 'Feedback updated' })
    }
  }

  const remove = async () => {
    if (!selected || !confirm('Delete this feedback permanently?')) return
    setSaving(true)
    const result = await deleteFeedback(selected.id)
    setSaving(false)
    if (result.error) {
      toast({ ...errorToast(result.error), variant: 'destructive' })
      return
    }
    setRecords((current) =>
      current.filter((record) => record.id !== selected.id)
    )
    setSelectedId(undefined)
    setAdminNote('')
    toast({ title: 'Feedback deleted' })
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-semibold text-muted-foreground">
            <MessageSquareText className="h-9 w-9" />
            Feedback
          </h1>
          <p className="text-muted-foreground">
            Review and triage interface feedback submitted by CHORUS users.
          </p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="feedback-status" className="text-sm font-medium">
          Status
        </label>
        <select
          id="feedback-status"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as FeedbackStatus | 'all')
          }
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground">
          {filtered.length} submission{filtered.length === 1 ? '' : 's'}
        </span>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Page</TableHead>
                <TableHead className="text-muted-foreground">
                  Reporter
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Comments
                </TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-muted-foreground">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No feedback for this status.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((record) => (
                <TableRow
                  key={record.id}
                  data-state={record.id === selectedId ? 'selected' : undefined}
                >
                  <TableCell>
                    {new Date(record.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="max-w-64 truncate font-mono text-xs">
                    {record.source.path}
                  </TableCell>
                  <TableCell>{record.reporter.displayName}</TableCell>
                  <TableCell>{record.comments.length}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.status === 'open' ? 'default' : 'secondary'
                      }
                    >
                      {statusLabel(record.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => selectRecord(record)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-3">
              <span>{selected.source.path}</span>
              <span className="flex items-center gap-2">
                <Badge variant="outline">{statusLabel(selected.status)}</Badge>
                <Button asChild size="sm" variant="outline">
                  <Link href={selected.source.path}>Open page</Link>
                </Button>
              </span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Submitted by {selected.reporter.displayName} on{' '}
              {new Date(selected.createdAt).toLocaleString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              {selected.comments.map((comment, index) => (
                <div
                  key={comment.id}
                  className="rounded-md border bg-muted/20 p-4"
                >
                  <div className="mb-2 font-mono text-xs text-muted-foreground">
                    {index + 1}. {comment.path ?? selected.source.path} ·{' '}
                    {comment.label} · {comment.sel}
                  </div>
                  <p className="whitespace-pre-wrap text-sm">{comment.text}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label htmlFor="feedback-note" className="text-sm font-medium">
                Internal admin note
              </label>
              <Textarea
                id="feedback-note"
                value={adminNote}
                onChange={(event) => setAdminNote(event.target.value)}
                placeholder="Add context for other administrators…"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => save('in-review')} disabled={saving}>
                Mark in review
              </Button>
              <Button onClick={() => save('resolved')} disabled={saving}>
                Resolve
              </Button>
              <Button
                variant="outline"
                onClick={() => save('open')}
                disabled={saving}
              >
                Reopen
              </Button>
              <Button
                variant="outline"
                onClick={() => save('archived')}
                disabled={saving}
              >
                Archive
              </Button>
              <Button
                variant="outline"
                onClick={() => save()}
                disabled={saving}
              >
                Save note
              </Button>
              <Button variant="destructive" onClick={remove} disabled={saving}>
                <Trash2 /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
