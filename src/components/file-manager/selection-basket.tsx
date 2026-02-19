'use client'

import {
  ArrowDownToLine,
  ArrowRightLeft,
  ShoppingBasket,
  Trash2,
  X
} from 'lucide-react'
import * as React from 'react'

import { Button } from '~/components/button'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from '~/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Separator } from '~/components/ui/separator'
import { Textarea } from '~/components/ui/textarea'
import type { FileSystemItem } from '~/types/file-system'

interface SelectionBasketProps {
  selectedItems: FileSystemItem[]
  onRemoveItem: (itemId: string) => void
  onClearSelection: () => void
  onDownloadRequest: (items: FileSystemItem[], justification: string) => void
  onTransferRequest: (
    items: FileSystemItem[],
    targetWorkspaceId: string,
    justification: string
  ) => void
}

export function SelectionBasket({
  selectedItems,
  onRemoveItem,
  onClearSelection,
  onDownloadRequest,
  onTransferRequest
}: SelectionBasketProps) {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = React.useState(false)
  const [requestMode, setRequestMode] = React.useState<
    'download' | 'transfer' | null
  >(null)
  const [requestJustification, setRequestJustification] = React.useState('')
  const [targetWorkspaceId, setTargetWorkspaceId] = React.useState('')

  const totalSize = React.useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + (item.size || 0), 0)
  }, [selectedItems])

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const handleStartRequest = (mode: 'download' | 'transfer') => {
    setRequestMode(mode)
    setIsRequestDialogOpen(true)
  }

  const handleSubmitRequest = () => {
    if (requestMode === 'download') {
      onDownloadRequest(selectedItems, requestJustification)
    } else if (requestMode === 'transfer') {
      onTransferRequest(selectedItems, targetWorkspaceId, requestJustification)
    }

    // Reset and close
    setIsRequestDialogOpen(false)
    setRequestJustification('')
    setTargetWorkspaceId('')
    setRequestMode(null)
  }

  return (
    <>
      <div className="p-2 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            Selected Files
          </CardTitle>
          <Badge className="rounded-full px-2">{selectedItems.length}</Badge>
        </div>
        <CardDescription className="mt-1 text-xs text-muted-foreground">
          Total size:{' '}
          <span className="font-medium text-foreground">
            {formatBytes(totalSize)}
          </span>
        </CardDescription>
      </div>

      <CardContent className="flex flex-1 flex-col p-2 pt-0">
        <ScrollArea className="flex-1 pr-4">
          <div className="mt-2 space-y-1">
            {selectedItems.length === 0 && (
              <div className="mt-8 p-6 text-center text-sm text-muted-foreground">
                Select the files you would like to download or transfer to
                another workspace.
                <br /> <br />
                All requests must be reviewed and approved by a data manager
                before the files can be downloaded or transferred.
              </div>
            )}
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2 text-xs transition-all hover:bg-muted/40"
              >
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
            ))}
          </div>
        </ScrollArea>

        <div className="mt-auto p-2 pt-4">
          <Separator className="mb-4 bg-muted/40" />
          <div className="grid grid-cols-2 gap-3">
            <Button
              size="sm"
              variant="default"
              disabled={selectedItems.length === 0}
              onClick={() => handleStartRequest('download')}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl"
            >
              <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
              Download
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={selectedItems.length === 0}
              onClick={() => handleStartRequest('transfer')}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl"
            >
              <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
              Transfer
            </Button>
          </div>
        </div>
      </CardContent>

      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="border border-muted/20 bg-background/95 backdrop-blur-xl sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {requestMode === 'download'
                ? 'Request Download Approval'
                : 'Request Transfer Approval'}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              {requestMode === 'download'
                ? 'This action requires approval from a workspace administrator. Once approved, you will obtain a secure temporary link.'
                : 'Transfer data directly to another secure workspace. This operation will be logged and may require administrator review.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Items to process</span>
                <span className="font-bold">{selectedItems.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Total payload size
                </span>
                <span className="font-bold">{formatBytes(totalSize)}</span>
              </div>
            </div>

            {requestMode === 'transfer' && (
              <div className="space-y-2">
                <Label
                  htmlFor="target-workspace"
                  className="text-sm font-semibold"
                >
                  Target Workspace ID
                </Label>
                <Input
                  id="target-workspace"
                  placeholder="e.g. workspace-alpha-99"
                  value={targetWorkspaceId}
                  onChange={(e) => setTargetWorkspaceId(e.target.value)}
                  className="bg-muted/20"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="justification" className="text-sm font-semibold">
                Justification <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="justification"
                placeholder="Please describe the purpose of this data movement for audit purposes..."
                value={requestJustification}
                onChange={(e) => setRequestJustification(e.target.value)}
                className="min-h-[120px] resize-none bg-muted/20"
                required
              />
              <p className="text-[11px] italic text-muted-foreground">
                All data movement is audited. Providing clear justification
                expedites the approval process.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsRequestDialogOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRequest}
              variant="accent-filled"
              className="min-w-[140px] rounded-xl"
              disabled={
                !requestJustification.trim() ||
                (requestMode === 'transfer' && !targetWorkspaceId.trim())
              }
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
