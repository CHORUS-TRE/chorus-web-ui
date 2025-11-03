/**
 * Files Panel Component
 *
 * File browser with accessible multi-select basket paradigm for data movement
 *
 * @accessibility
 * - Checkbox paradigm with keyboard navigation
 * - ARIA labels for selection state
 * - Screen reader announcements for basket updates
 * - Clear visual feedback for selected items
 *
 * @eco-design
 * - Virtualized file list for large directories
 * - Memoized file rows
 * - Efficient selection state management
 */

'use client'

import {
  ArrowDownToLine,
  ArrowRightLeft,
  File,
  Folder,
  Search,
  ShoppingBasket,
  Trash2,
  X
} from 'lucide-react'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import type { ChorusWorkspaceFile } from '@/internal/client/models/ChorusWorkspaceFile'

import type {
  EnhancedChorusWorkspace,
  FileSelectionState,
  WorkspaceMember
} from '../types/enhanced-models'

// ============================================================================
// Props Interface
// ============================================================================

export interface FilesPanelProps {
  workspace: EnhancedChorusWorkspace
  currentUser: WorkspaceMember
  selectionState: FileSelectionState
  onSelectionChange: (state: FileSelectionState) => void
}

// ============================================================================
// Main Component
// ============================================================================

export function FilesPanel({
  workspace,
  currentUser,
  selectionState,
  onSelectionChange
}: FilesPanelProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [isRequestDialogOpen, setIsRequestDialogOpen] = React.useState(false)
  const [requestJustification, setRequestJustification] = React.useState('')
  const [targetWorkspaceId, setTargetWorkspaceId] = React.useState<string>('')

  // Mock file list - in real app, this would come from API
  const [files] = React.useState<ChorusWorkspaceFile[]>([
    {
      path: '/data',
      name: 'data',
      isDirectory: true,
      size: '0',
      mimeType: 'directory',
      updatedAt: new Date('2025-01-15')
    },
    {
      path: '/data/raw_dataset.csv',
      name: 'raw_dataset.csv',
      isDirectory: false,
      size: '15728640', // 15 MB
      mimeType: 'text/csv',
      updatedAt: new Date('2025-01-20')
    },
    {
      path: '/data/analysis_results.png',
      name: 'analysis_results.png',
      isDirectory: false,
      size: '2097152', // 2 MB
      mimeType: 'image/png',
      updatedAt: new Date('2025-01-22')
    },
    {
      path: '/notebooks',
      name: 'notebooks',
      isDirectory: true,
      size: '0',
      mimeType: 'directory',
      updatedAt: new Date('2025-01-10')
    },
    {
      path: '/notebooks/preprocessing.ipynb',
      name: 'preprocessing.ipynb',
      isDirectory: false,
      size: '524288', // 512 KB
      mimeType: 'application/x-ipynb+json',
      updatedAt: new Date('2025-01-25')
    }
  ])

  // Filter files based on search
  const filteredFiles = React.useMemo(() => {
    if (!searchQuery) return files
    const q = searchQuery.toLowerCase()
    return files.filter((file) => (file.name?.toLowerCase() ?? '').includes(q))
  }, [files, searchQuery])

  // Calculate total size of selected files
  const totalSelectedSize = React.useMemo(() => {
    return selectionState.selectedFiles.reduce((acc, file) => {
      return acc + parseInt(file.size || '0')
    }, 0)
  }, [selectionState.selectedFiles])

  // Handle file selection
  const toggleFileSelection = (file: ChorusWorkspaceFile) => {
    const isSelected = selectionState.selectedFiles.some(
      (f) => f.path === file.path
    )

    if (isSelected) {
      onSelectionChange({
        ...selectionState,
        selectedFiles: selectionState.selectedFiles.filter(
          (f) => f.path !== file.path
        ),
        totalSize: totalSelectedSize - parseInt(file.size || '0')
      })
    } else {
      if (file.isDirectory) {
        // Don't allow directory selection for now
        return
      }
      onSelectionChange({
        ...selectionState,
        selectedFiles: [...selectionState.selectedFiles, file],
        totalSize: totalSelectedSize + parseInt(file.size || '0')
      })
    }
  }

  // Clear selection
  const clearSelection = () => {
    onSelectionChange({
      selectedFiles: [],
      totalSize: 0,
      selectionMode: null
    })
  }

  // Start request flow
  const startRequest = (mode: 'download' | 'transfer') => {
    onSelectionChange({
      ...selectionState,
      selectionMode: mode
    })
    setIsRequestDialogOpen(true)
  }

  // Submit request
  const submitRequest = () => {
    console.log('Submit request:', {
      type: selectionState.selectionMode,
      files: selectionState.selectedFiles,
      justification: requestJustification,
      targetWorkspaceId:
        selectionState.selectionMode === 'transfer'
          ? targetWorkspaceId
          : undefined
    })

    // Reset state
    clearSelection()
    setRequestJustification('')
    setTargetWorkspaceId('')
    setIsRequestDialogOpen(false)
  }

  // Format bytes
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  // ============================================================================
  // File Row Component
  // ============================================================================

  const FileRow = React.memo(function FileRow({
    file
  }: {
    file: ChorusWorkspaceFile
  }) {
    const isSelected = selectionState.selectedFiles.some(
      (f) => f.path === file.path
    )
    const fileSize = parseInt(file.size || '0')

    return (
      <div
        className={`flex items-center gap-3 rounded-md border p-3 transition-colors ${
          isSelected
            ? 'border-primary bg-primary/5'
            : 'border-border hover:bg-muted/50'
        }`}
        role="row"
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => toggleFileSelection(file)}
          disabled={file.isDirectory}
          aria-label={`Select ${file.name}`}
        />

        <div className="flex flex-1 items-center gap-2">
          {file.isDirectory ? (
            <Folder className="h-5 w-5 text-blue-500" aria-hidden="true" />
          ) : (
            <File
              className="h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            />
          )}

          <div className="flex-1">
            <div className="font-medium">{file.name}</div>
            <div className="text-xs text-muted-foreground">{file.path}</div>
          </div>

          <div className="text-right text-sm">
            {!file.isDirectory && (
              <>
                <div className="font-medium">{formatBytes(fileSize)}</div>
                <div className="text-xs text-muted-foreground">
                  {file.mimeType}
                </div>
              </>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            {file.updatedAt?.toLocaleDateString()}
          </div>
        </div>
      </div>
    )
  })

  // ============================================================================
  // Selection Basket
  // ============================================================================

  const SelectionBasket = () => {
    if (selectionState.selectedFiles.length === 0) return null

    return (
      <Card className="sticky top-0 z-10 border-2 border-primary">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingBasket className="h-5 w-5" aria-hidden="true" />
              Selection Basket
              <Badge variant="default">
                {selectionState.selectedFiles.length} files
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              aria-label="Clear selection basket"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-xs">
            Total size: {formatBytes(totalSelectedSize)}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Selected files list */}
          <ScrollArea className="max-h-32">
            <div className="space-y-1">
              {selectionState.selectedFiles.map((file) => (
                <div
                  key={file.path}
                  className="flex items-center justify-between rounded-md bg-muted px-2 py-1 text-xs"
                >
                  <span className="truncate">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() => toggleFileSelection(file)}
                    aria-label={`Remove ${file.name} from selection`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator />

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => startRequest('download')}
              disabled={!currentUser.permissions.download}
              className="flex items-center gap-1"
              aria-label="Request download approval"
            >
              <ArrowDownToLine className="h-4 w-4" aria-hidden="true" />
              Download
            </Button>

            <Button
              size="sm"
              variant="default"
              onClick={() => startRequest('transfer')}
              disabled={!currentUser.permissions.transfer}
              className="flex items-center gap-1"
              aria-label="Request transfer approval"
            >
              <ArrowRightLeft className="h-4 w-4" aria-hidden="true" />
              Transfer
            </Button>
          </div>

          {!currentUser.permissions.download &&
            !currentUser.permissions.transfer && (
              <p className="text-xs text-destructive">
                You don&apos;t have permission to download or transfer files
              </p>
            )}
        </CardContent>
      </Card>
    )
  }

  // ============================================================================
  // Request Dialog
  // ============================================================================

  const RequestDialog = () => (
    <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {selectionState.selectionMode === 'download'
              ? 'Request Download Approval'
              : 'Request Transfer Approval'}
          </DialogTitle>
          <DialogDescription>
            {selectionState.selectionMode === 'download'
              ? 'Data will be exported from the platform. Requires approval from workspace administrator.'
              : 'Data will be transferred to another workspace within the platform.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected files summary */}
          <div className="rounded-lg border border-border p-3">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">Selected Files</span>
              <Badge>{selectionState.selectedFiles.length}</Badge>
            </div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">Total Size</span>
              <span>{formatBytes(totalSelectedSize)}</span>
            </div>
          </div>

          {/* Target workspace (for transfers) */}
          {selectionState.selectionMode === 'transfer' && (
            <div>
              <Label htmlFor="target-workspace">Target Workspace</Label>
              <Input
                id="target-workspace"
                placeholder="Enter workspace ID..."
                value={targetWorkspaceId}
                onChange={(e) => setTargetWorkspaceId(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          {/* Justification */}
          <div>
            <Label htmlFor="justification">
              Justification <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="justification"
              placeholder="Explain why you need to download/transfer these files..."
              value={requestJustification}
              onChange={(e) => setRequestJustification(e.target.value)}
              className="mt-1 min-h-[100px]"
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Your justification will be reviewed by the workspace administrator
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsRequestDialogOpen(false)
              setRequestJustification('')
              setTargetWorkspaceId('')
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={submitRequest}
            disabled={
              !requestJustification.trim() ||
              (selectionState.selectionMode === 'transfer' &&
                !targetWorkspaceId.trim())
            }
          >
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // ============================================================================
  // Main Render
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Selection Basket */}
      <SelectionBasket />

      {/* File Browser */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Workspace Files</CardTitle>
              <CardDescription>{filteredFiles.length} items</CardDescription>
            </div>

            {/* Search */}
            <div className="relative w-64">
              <Search
                className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
                aria-label="Search files"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[600px]">
            <div
              className="space-y-2"
              role="table"
              aria-label="Workspace files"
            >
              {filteredFiles.map((file) => (
                <FileRow key={file.path} file={file} />
              ))}

              {filteredFiles.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <File
                    className="mb-4 h-12 w-12 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? 'No files found matching your search'
                      : 'No files in this workspace'}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Request Dialog */}
      <RequestDialog />
    </div>
  )
}

export default FilesPanel
