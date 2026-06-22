'use client'

import { format } from 'date-fns'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

const MDEditorClient = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded border bg-muted" />
})

import { toast } from '@/components/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type {
  TermsOfUseAcceptance,
  TermsOfUseVersion,
  TermsOfUseVersionStatus
} from '@/domain/model/terms-of-use'
import type { User } from '@/domain/model/user'
import {
  createTermsOfUseVersion,
  getTermsOfUseVersion,
  listTermsOfUseAcceptances,
  listTermsOfUseVersions,
  publishTermsOfUseVersion,
  updateTermsOfUseVersion
} from '@/view-model/terms-of-use-view-model'
import { listUsers } from '@/view-model/user-view-model'

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
  const [usersById, setUsersById] = useState<Record<string, User>>({})
  const [editDialog, setEditDialog] = useState<{
    open: boolean
    version?: TermsOfUseVersion
    content: string
  }>({ open: false, content: '' })
  const [publishDialog, setPublishDialog] = useState<{
    open: boolean
    versionId?: string
  }>({ open: false })
  const [acceptanceDialog, setAcceptanceDialog] = useState<{
    open: boolean
    content: string | null
    loading: boolean
  }>({ open: false, content: null, loading: false })
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
    const [acceptancesResult, usersResult] = await Promise.all([
      listTermsOfUseAcceptances(),
      listUsers()
    ])
    if (acceptancesResult.error) {
      toast({ title: acceptancesResult.error, variant: 'destructive' })
      return
    }
    setAcceptances(acceptancesResult.data ?? [])
    if (usersResult.data) {
      const map: Record<string, User> = {}
      for (const u of usersResult.data) {
        map[u.id] = u
      }
      setUsersById(map)
    }
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
      ? await updateTermsOfUseVersion(editDialog.version.id, editDialog.content)
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

  const openAcceptanceVersion = async (versionId: string | undefined) => {
    if (!versionId) return
    setAcceptanceDialog({ open: true, content: null, loading: true })
    const result = await getTermsOfUseVersion(versionId)
    setAcceptanceDialog({
      open: true,
      content: result.data?.content ?? null,
      loading: false
    })
    if (result.error) {
      toast({ title: result.error, variant: 'destructive' })
    }
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
                <TableHead className="text-muted-foreground">ID</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Created</TableHead>
                <TableHead className="text-muted-foreground">Updated</TableHead>
                <TableHead className="text-muted-foreground" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {versions.map((v) => (
                <TableRow
                  key={v.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => openEdit(v)}
                >
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
                  <TableCell className="flex justify-end gap-2">
                    {v.status === 'TERMS_OF_USE_VERSION_STATUS_DRAFT' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            openEdit(v)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (v.id) openPublish(v.id)
                          }}
                        >
                          Publish
                        </Button>
                      </>
                    )}
                    {v.status !== 'TERMS_OF_USE_VERSION_STATUS_DRAFT' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEdit(v)
                        }}
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
                <TableHead className="text-muted-foreground">User ID</TableHead>
                <TableHead className="text-muted-foreground">
                  Username
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Full Name
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Version ID
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Accepted at
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {acceptances.map((a) => {
                const user = a.userId ? usersById[a.userId] : undefined
                return (
                  <TableRow
                    key={a.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openAcceptanceVersion(a.termsOfUseVersionId)}
                  >
                    <TableCell className="font-mono text-xs">
                      {a.userId}
                    </TableCell>
                    <TableCell className="text-sm">
                      {user?.username ?? '—'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {user ? `${user.firstName} ${user.lastName}`.trim() : '—'}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {a.termsOfUseVersionId}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {a.acceptedAt ? format(a.acceptedAt, 'PPp') : '—'}
                    </TableCell>
                  </TableRow>
                )
              })}
              {acceptances.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
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
          {editDialog.version &&
          editDialog.version.status !== 'TERMS_OF_USE_VERSION_STATUS_DRAFT' ? (
            <ScrollArea className="h-80 rounded border p-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{editDialog.content}</ReactMarkdown>
              </div>
            </ScrollArea>
          ) : (
            <div className="space-y-3">
              <div data-color-mode="auto">
                <MDEditorClient
                  value={editDialog.content}
                  onChange={(val) =>
                    setEditDialog((s) => ({ ...s, content: val ?? '' }))
                  }
                  height={300}
                  preview="preview"
                />
              </div>
            </div>
          )}
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
          <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
            <p className="mb-1 font-semibold">Markdown formatting</p>
            <p className="mb-2 text-blue-700 dark:text-blue-400">
              Content is rendered as{' '}
              <a
                href="https://commonmark.org/help/"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-blue-900 dark:hover:text-blue-200"
              >
                Markdown
              </a>
            </p>

            <p className="mt-2 text-blue-700 dark:text-blue-400">
              Use the <span className="font-semibold">toolbar icons</span> to
              switch between Edit, Split, and Preview 👁 modes.
            </p>
          </div>
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

      {/* Accepted version viewer dialog */}
      <Dialog
        open={acceptanceDialog.open}
        onOpenChange={(open) =>
          !open &&
          setAcceptanceDialog({ open: false, content: null, loading: false })
        }
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Accepted Terms of Use Version</DialogTitle>
          </DialogHeader>
          {acceptanceDialog.loading ? (
            <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
              Loading…
            </div>
          ) : acceptanceDialog.content ? (
            <ScrollArea className="h-80 rounded border p-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{acceptanceDialog.content}</ReactMarkdown>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
              Content not available.
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setAcceptanceDialog({
                  open: false,
                  content: null,
                  loading: false
                })
              }
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
