'use client'

import { Trash2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useAppState } from '@/stores/app-state-store'
import type { FileSystemItem } from '@/types/file-system'

interface RequestQueueProps {
  downloadItems: FileSystemItem[]
  transferItems: FileSystemItem[]
  onRemoveDownloadItem: (itemId: string) => void
  onRemoveTransferItem: (itemId: string) => void
  onClearDownload: () => void
  onClearTransfer: () => void
  onSubmitDownload: (items: FileSystemItem[], justification: string) => void
  onSubmitTransfer: (
    items: FileSystemItem[],
    targetWorkspaceId: string,
    justification: string
  ) => void
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

function FileRow({
  item,
  onRemoveItem
}: {
  item: FileSystemItem
  onRemoveItem: (itemId: string) => void
}) {
  return (
    <div className="group flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2 text-xs transition-all hover:bg-muted/40">
      <span className="min-w-0 flex-1 truncate pr-3 font-medium text-foreground/90">
        {item.name}
      </span>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-[10px] tabular-nums text-muted-foreground/60">
          {formatBytes(item.size || 0)}
        </span>
        <button
          onClick={() => onRemoveItem(item.id)}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive focus:outline-none"
          aria-label={`Remove ${item.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

function DownloadQueueSection({
  items,
  onRemoveItem,
  onClear,
  onSubmit
}: {
  items: FileSystemItem[]
  onRemoveItem: (itemId: string) => void
  onClear: () => void
  onSubmit: (items: FileSystemItem[], justification: string) => void
}) {
  const [step, setStep] = React.useState<'list' | 'form'>('list')
  const [justification, setJustification] = React.useState('')

  if (items.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="px-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
        Download
      </div>

      {step === 'list' ? (
        <>
          <div className="space-y-1">
            {items.map((item) => (
              <FileRow key={item.id} item={item} onRemoveItem={onRemoveItem} />
            ))}
          </div>
          <Separator className="bg-muted/40" />
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={onClear}>
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              className="border border-accent"
              onClick={() => setStep('form')}
            >
              Submit request
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            This action requires approval from a workspace administrator.
          </p>
          <div className="space-y-2">
            <Label
              htmlFor="download-justification"
              className="text-xs font-semibold"
            >
              Justification <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="download-justification"
              placeholder="Please describe the purpose of this data movement for audit purposes..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="min-h-[90px] resize-none bg-muted/20 text-xs"
              required
            />
          </div>
          <Separator className="bg-muted/40" />
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => setStep('list')}>
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              className="border border-accent"
              disabled={!justification.trim()}
              onClick={() => {
                onSubmit(items, justification)
                setJustification('')
                setStep('list')
              }}
            >
              Submit request
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function TransferQueueSection({
  items,
  onRemoveItem,
  onClear,
  onSubmit
}: {
  items: FileSystemItem[]
  onRemoveItem: (itemId: string) => void
  onClear: () => void
  onSubmit: (
    items: FileSystemItem[],
    targetWorkspaceId: string,
    justification: string
  ) => void
}) {
  const [step, setStep] = React.useState<'list' | 'form'>('list')
  const [justification, setJustification] = React.useState('')
  const [targetWorkspaceId, setTargetWorkspaceId] = React.useState('')
  const [isCustomWorkspaceId, setIsCustomWorkspaceId] = React.useState(false)
  const params = useParams<{ workspaceId: string }>()
  const workspaceId = params?.workspaceId
  const { workspaces } = useAppState()

  if (items.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="px-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
        Transfer
      </div>

      {step === 'list' ? (
        <>
          <div className="space-y-1">
            {items.map((item) => (
              <FileRow key={item.id} item={item} onRemoveItem={onRemoveItem} />
            ))}
          </div>
          <Separator className="bg-muted/40" />
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={onClear}>
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              className="border border-accent"
              onClick={() => setStep('form')}
            >
              Submit request
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Transfer data directly to another secure workspace. This operation
            will be logged and may require administrator review.
          </p>
          <div className="space-y-2">
            <Label
              htmlFor="transfer-target-workspace"
              className="text-xs font-semibold"
            >
              Target Workspace
            </Label>
            <Select
              value={isCustomWorkspaceId ? '__custom__' : targetWorkspaceId}
              onValueChange={(val) => {
                if (val === '__custom__') {
                  setIsCustomWorkspaceId(true)
                  setTargetWorkspaceId('')
                } else {
                  setIsCustomWorkspaceId(false)
                  setTargetWorkspaceId(val)
                }
              }}
            >
              <SelectTrigger className="bg-muted/20 text-xs">
                <SelectValue placeholder="Select a workspace…" />
              </SelectTrigger>
              <SelectContent className="bg-background/65 text-muted-foreground backdrop-blur-xl">
                {workspaces
                  ?.filter((ws) => ws.id !== workspaceId)
                  .map((ws) => (
                    <SelectItem key={ws.id} value={ws.id}>
                      {ws.name} — {ws.id}
                    </SelectItem>
                  ))}
                <SelectSeparator />
                <SelectItem value="__custom__">Custom ID…</SelectItem>
              </SelectContent>
            </Select>
            {isCustomWorkspaceId && (
              <Input
                id="transfer-target-workspace"
                placeholder="Enter workspace ID"
                value={targetWorkspaceId}
                onChange={(e) => setTargetWorkspaceId(e.target.value)}
                className="bg-muted/20 text-xs"
                autoFocus
              />
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="transfer-justification"
              className="text-xs font-semibold"
            >
              Justification <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="transfer-justification"
              placeholder="Please describe the purpose of this data movement for audit purposes..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="min-h-[90px] resize-none bg-muted/20 text-xs"
              required
            />
          </div>
          <Separator className="bg-muted/40" />
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => setStep('list')}>
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              className="border border-accent"
              disabled={!justification.trim() || !targetWorkspaceId.trim()}
              onClick={() => {
                onSubmit(items, targetWorkspaceId, justification)
                setJustification('')
                setTargetWorkspaceId('')
                setIsCustomWorkspaceId(false)
                setStep('list')
              }}
            >
              Submit request
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function RequestQueue({
  downloadItems,
  transferItems,
  onRemoveDownloadItem,
  onRemoveTransferItem,
  onClearDownload,
  onClearTransfer,
  onSubmitDownload,
  onSubmitTransfer
}: RequestQueueProps) {
  const totalCount = downloadItems.length + transferItems.length
  const isEmpty = totalCount === 0

  return (
    <>
      <div className="p-2 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            Request queue
          </CardTitle>
          <Badge className="rounded-full px-2">{totalCount}</Badge>
        </div>
        <CardDescription className="mt-1 text-xs text-muted-foreground">
          Files appear here after you choose Download or Transfer. Review the
          queue, then submit the request.
        </CardDescription>
      </div>

      <CardContent className="flex flex-1 flex-col p-2 pt-0">
        <ScrollArea className="flex-1 pr-4">
          {isEmpty ? (
            <div className="mt-8 flex flex-col items-center gap-3 p-6 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/40 text-lg text-muted-foreground">
                +
              </div>
              <p className="text-sm font-medium text-foreground">
                No files added yet
              </p>
              <p className="text-xs text-muted-foreground">
                Select files, then choose <strong>Download</strong> or{' '}
                <strong>Transfer</strong>.
              </p>
            </div>
          ) : (
            <div className="mt-2 space-y-4">
              <DownloadQueueSection
                items={downloadItems}
                onRemoveItem={onRemoveDownloadItem}
                onClear={onClearDownload}
                onSubmit={onSubmitDownload}
              />
              <TransferQueueSection
                items={transferItems}
                onRemoveItem={onRemoveTransferItem}
                onClear={onClearTransfer}
                onSubmit={onSubmitTransfer}
              />
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </>
  )
}
