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
  CardHeader,
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

  if (selectedItems.length === 0) return null

  return (
    <Card className="card-glass border-2 border-primary/50 bg-card/50 backdrop-blur-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <ShoppingBasket
              className="h-5 w-5 text-primary"
              aria-hidden="true"
            />
            Selection Basket
            <Badge variant="default" className="rounded-full px-2">
              {selectedItems.length}
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8 w-8 rounded-full p-0 hover:bg-muted/80"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Total size:{' '}
          <span className="font-medium text-foreground">
            {formatBytes(totalSize)}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <ScrollArea className="max-h-32 pr-4">
          <div className="space-y-1.5">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between rounded-lg bg-muted/30 px-3 py-1.5 text-xs transition-colors hover:bg-muted/50"
              >
                <span className="truncate pr-2 font-medium">{item.name}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    {formatBytes(item.size || 0)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 rounded-md p-0 opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator className="bg-muted/40" />

        <div className="grid grid-cols-2 gap-3">
          <Button
            size="sm"
            variant="accent-filled"
            onClick={() => handleStartRequest('download')}
            className="flex w-full items-center justify-center gap-2"
          >
            <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
            Download
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleStartRequest('transfer')}
            className="flex w-full items-center justify-center gap-2"
          >
            <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
            Transfer
          </Button>
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
    </Card>
  )
}
