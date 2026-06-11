'use client'

import { format } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/hooks/use-toast'
import type {
  TermsOfUseAcceptance,
  TermsOfUseVersion,
  TermsOfUseVersionStatus
} from '@/domain/model/terms-of-use'
import {
  createTermsOfUseVersion,
  listTermsOfUseAcceptances,
  listTermsOfUseVersions,
  publishTermsOfUseVersion,
  updateTermsOfUseVersion
} from '@/view-model/terms-of-use-view-model'

const STATUS_LABELS: Record<TermsOfUseVersionStatus, string> = {
  TERMS_OF_USE_VERSION_STATUS_DRAFT: 'Draft',
  TERMS_OF_USE_VERSION_STATUS_PUBLISHED: 'Published',
  TERMS_OF_USE_VERSION_STATUS_ARCHIVED: 'Archived'
}

const STATUS_VARIANTS: Record<
  TermsOfUseVersionStatus,
  'default' | 'secondary' | 'outline'
> = {
  TERMS_OF_USE_VERSION_STATUS_DRAFT: 'secondary',
  TERMS_OF_USE_VERSION_STATUS_PUBLISHED: 'default',
  TERMS_OF_USE_VERSION_STATUS_ARCHIVED: 'outline'
}

export function TermsOfUseAdmin() {
  const [versions, setVersions] = useState<TermsOfUseVersion[]>([])
  const [acceptances, setAcceptances] = useState<TermsOfUseAcceptance[]>([])
  const [editDialog, setEditDialog] = useState<{
    open: boolean
    version?: TermsOfUseVersion
    content: string
  }>({ open: false, content: '' })
  const [publishDialog, setPublishDialog] = useState<{
    open: boolean
    versionId?: string
  }>({ open: false })
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const loadVersions = useCallback(async () => {
    const result = await listTermsOfUseVersions()
    if (result.error) {
      toast({ title: result.error, variant: 'destructive' })
      return
    }
    setVersions(result.data ?? [])
  }, [])

  const loadAcceptances = useCallback(async () => {
    const result = await listTermsOfUseAcceptances()
    if (result.error) {
      toast({ title: result.error, variant: 'destructive' })
      return
    }
    setAcceptances(result.data ?? [])
  }, [])

  useEffect(() => {
    loadVersions()
    loadAcceptances()
  }, [loadVersions, loadAcceptances])

  const openCreate = () =>
    setEditDialog({ open: true, version: undefined, content: '' })

  const openEdit = (version: TermsOfUseVersion) =>
    setEditDialog({ open: true, version, content: version.content ?? '' })

  const handleSave = async () => {
    setSaving(true)
    const result = editDialog.version?.id
      ? await updateTermsOfUseVersion(
          editDialog.version.id,
          editDialog.content
        )
      : await createTermsOfUseVersion(editDialog.content)
    setSaving(false)
    if (result.error) {
      toast({ title: result.error, variant: 'destructive' })
      return
    }
    toast({ title: editDialog.version ? 'Version updated' : 'Draft created' })
    setEditDialog({ open: false, content: '' })
    loadVersions()
  }

  const openPublish = (versionId: string) =>
    setPublishDialog({ open: true, versionId })

  const handlePublish = async () => {
    if (!publishDialog.versionId) return
    setPublishing(true)
    const result = await publishTermsOfUseVersion(publishDialog.versionId)
    setPublishing(false)
    if (result.error) {
      toast({ title: result.error, variant: 'destructive' })
      return
    }
    toast({ title: 'Version published — all users will need to re-accept' })
    setPublishDialog({ open: false })
    loadVersions()
  }

  return (
    <>
      <Tabs defaultValue="versions">
        <TabsList>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="acceptances">Acceptances</TabsTrigger>
        </TabsList>

        <TabsContent value="versions">
          <div className="mb-4 flex justify-end">
            <Button onClick={openCreate}>New version</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {versions.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-mono text-xs">{v.id}</TableCell>
                  <TableCell>
                    {v.status && (
                      <Badge variant={STATUS_VARIANTS[v.status]}>
                        {STATUS_LABELS[v.status]}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {v.createdAt ? format(v.createdAt, 'PPp') : '—'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {v.updatedAt ? format(v.updatedAt, 'PPp') : '—'}
                  </TableCell>
                  <TableCell className="flex gap-2 justify-end">
                    {v.status ===
                      'TERMS_OF_USE_VERSION_STATUS_DRAFT' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEdit(v)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => v.id && openPublish(v.id)}
                        >
                          Publish
                        </Button>
                      </>
                    )}
                    {v.status !==
                      'TERMS_OF_USE_VERSION_STATUS_DRAFT' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(v)}
                      >
                        View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {versions.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No versions yet. Create a draft to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="acceptances">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Version ID</TableHead>
                <TableHead>Accepted at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {acceptances.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono text-xs">{a.userId}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {a.termsOfUseVersionId}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {a.acceptedAt ? format(a.acceptedAt, 'PPp') : '—'}
                  </TableCell>
                </TableRow>
              ))}
              {acceptances.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground"
                  >
                    No acceptances recorded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      {/* Create / Edit / View dialog */}
      <Dialog
        open={editDialog.open}
        onOpenChange={(open) =>
          !open && setEditDialog({ open: false, content: '' })
        }
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editDialog.version
                ? editDialog.version.status ===
                  'TERMS_OF_USE_VERSION_STATUS_DRAFT'
                  ? 'Edit Draft'
                  : 'View Version'
                : 'New Draft'}
            </DialogTitle>
          </DialogHeader>
          <Textarea
            className="min-h-64 font-mono text-sm"
            value={editDialog.content}
            onChange={(e) =>
              setEditDialog((s) => ({ ...s, content: e.target.value }))
            }
            disabled={
              editDialog.version?.status !==
                'TERMS_OF_USE_VERSION_STATUS_DRAFT' && !!editDialog.version
            }
            placeholder="Enter the Terms of Use text…"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialog({ open: false, content: '' })}
            >
              {editDialog.version?.status !==
                'TERMS_OF_USE_VERSION_STATUS_DRAFT' && editDialog.version
                ? 'Close'
                : 'Cancel'}
            </Button>
            {(!editDialog.version ||
              editDialog.version.status ===
                'TERMS_OF_USE_VERSION_STATUS_DRAFT') && (
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish confirmation dialog */}
      <Dialog
        open={publishDialog.open}
        onOpenChange={(open) => !open && setPublishDialog({ open: false })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish this version?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Publishing will archive the current published version and require{' '}
            <strong>all users</strong> to re-accept the Terms of Use before
            accessing the platform.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPublishDialog({ open: false })}
            >
              Cancel
            </Button>
            <Button onClick={handlePublish} disabled={publishing}>
              {publishing ? 'Publishing…' : 'Publish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
