import {
  Archive,
  CornerLeftUp,
  Download,
  File,
  FileText,
  Folder,
  ImageIcon,
  Loader2,
  Minus,
  Music,
  Pencil,
  Trash2,
  Video
} from 'lucide-react'
import type React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { cn } from '~/lib/utils'
import {
  formatDate as formatDateUtil,
  formatFileSize as formatFileSizeUtil
} from '~/lib/utils'
import type { FileClipboard, FileSystemItem } from '~/types/file-system'

interface FileGridProps {
  items: FileSystemItem[]
  selectedItems: string[]
  viewMode: 'list' | 'grid'
  onSelectItem: (itemId: string, multiSelect?: boolean) => void
  onSelectRange: (itemId: string, orderedItemIds: string[]) => void
  onSelectAll: (itemIds: string[]) => void
  onClearSelection: () => void
  onNavigateToFolder: (folderId: string) => void
  onMoveItem: (itemId: string, newParentId: string) => void
  onDownload: (itemId: string) => void
  onDelete?: (itemId: string) => void
  onRename?: (itemId: string) => void
  basketItems?: string[]
  movingItemId?: string | null
  onContextMenu?: (e: React.MouseEvent, itemId: string | null) => void
  clipboard?: FileClipboard | null
  renamingItemId?: string | null
  onRenameSubmit?: (itemId: string, newName: string) => void
  onRenameCancel?: () => void
  parentFolderId?: string | null
}

function getFileIcon(item: FileSystemItem) {
  if (item.type === 'folder') {
    return <Folder className="h-4 w-4 text-muted-foreground" />
  }

  const ext = item.extension?.toLowerCase()
  switch (ext) {
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileText className="h-4 w-4 text-blue-500" />
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return <ImageIcon className="h-4 w-4 text-green-500" />
    case 'mp4':
    case 'avi':
    case 'mov':
      return <Video className="h-4 w-4 text-purple-500" />
    case 'mp3':
    case 'wav':
    case 'flac':
      return <Music className="h-4 w-4 text-pink-500" />
    case 'zip':
    case 'rar':
    case '7z':
      return <Archive className="h-4 w-4 text-orange-500" />
    case 'drawio':
      return <FileText className="h-4 w-4 text-orange-500" />
    default:
      return <File className="h-4 w-4 text-muted-foreground" />
  }
}

function InlineRename({
  defaultName,
  onSubmit,
  onCancel
}: {
  defaultName: string
  onSubmit: (name: string) => void
  onCancel: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Select filename without extension
    if (inputRef.current) {
      inputRef.current.focus()
      const dotIndex = defaultName.lastIndexOf('.')
      if (dotIndex > 0) {
        inputRef.current.setSelectionRange(0, dotIndex)
      } else {
        inputRef.current.select()
      }
    }
  }, [defaultName])

  return (
    <input
      ref={inputRef}
      className="min-w-0 flex-1 rounded border border-accent bg-background px-1 text-sm outline-none"
      defaultValue={defaultName}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        e.stopPropagation()
        if (e.key === 'Enter') {
          const val = (e.target as HTMLInputElement).value.trim()
          if (val && val !== defaultName) onSubmit(val)
          else onCancel()
        }
        if (e.key === 'Escape') onCancel()
      }}
      onBlur={(e) => {
        const val = e.target.value.trim()
        if (val && val !== defaultName) onSubmit(val)
        else onCancel()
      }}
    />
  )
}

export function FileGrid({
  items,
  selectedItems,
  viewMode,
  onSelectItem,
  onSelectRange,
  onSelectAll,
  onClearSelection,
  onNavigateToFolder,
  onMoveItem,
  onDownload,
  onDelete,
  onRename,
  basketItems = [],
  movingItemId,
  onContextMenu,
  clipboard,
  renamingItemId,
  onRenameSubmit,
  onRenameCancel,
  parentFolderId
}: FileGridProps) {
  const [dragOverItem, setDragOverItem] = useState<string | null>(null)
  const [parentDragOver, setParentDragOver] = useState(false)

  const handleParentDragOver = (e: React.DragEvent) => {
    if (parentFolderId) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      setParentDragOver(true)
    }
  }

  const handleParentDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setParentDragOver(false)
    if (!parentFolderId) return
    const draggedItemId = e.dataTransfer.getData('text/plain')
    if (draggedItemId && draggedItemId !== parentFolderId) {
      onMoveItem(draggedItemId, parentFolderId)
    }
  }

  const orderedItemIds = useMemo(() => items.map((item) => item.id), [items])

  // Determine "select all" checkbox state
  const allSelected =
    items.length > 0 && items.every((item) => selectedItems.includes(item.id))
  const someSelected =
    !allSelected && items.some((item) => selectedItems.includes(item.id))

  const handleCheckboxChange = (item: FileSystemItem, e: React.MouseEvent) => {
    e.stopPropagation()
    if (e.shiftKey) {
      onSelectRange(item.id, orderedItemIds)
    } else {
      onSelectItem(item.id, true)
    }
  }

  const handleItemClick = (item: FileSystemItem, e: React.MouseEvent) => {
    e.stopPropagation()

    if (e.shiftKey) {
      onSelectRange(item.id, orderedItemIds)
    } else if (e.ctrlKey || e.metaKey) {
      onSelectItem(item.id, true)
    } else {
      onSelectItem(item.id)
      if (item.type === 'folder') {
        onNavigateToFolder(item.id)
      }
    }
  }

  const handleSelectAll = () => {
    if (allSelected) {
      onClearSelection()
    } else {
      onSelectAll(orderedItemIds)
    }
  }

  const handleDragStart = (e: React.DragEvent, item: FileSystemItem) => {
    e.dataTransfer.setData('text/plain', item.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, item: FileSystemItem) => {
    if (item.type === 'folder') {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      setDragOverItem(item.id)
    }
  }

  const handleDragLeave = () => {
    setDragOverItem(null)
  }

  const handleDrop = (e: React.DragEvent, item: FileSystemItem) => {
    e.preventDefault()
    setDragOverItem(null)
    const draggedItemId = e.dataTransfer.getData('text/plain')
    if (draggedItemId !== item.id && item.type === 'folder') {
      onMoveItem(draggedItemId, item.id)
    }
  }

  const selectedCount = items.filter((item) =>
    selectedItems.includes(item.id)
  ).length

  if (viewMode === 'grid') {
    return (
      <div className="flex flex-col">
        {/* Grid header with select-all */}
        <div className="flex items-center gap-3 border-b border-muted/40 bg-background/60 px-4 py-2">
          <Checkbox
            checked={allSelected}
            onCheckedChange={handleSelectAll}
            aria-label="Select all files"
            className={cn(
              someSelected && 'data-[state=unchecked]:bg-primary/20'
            )}
          />
          {selectedCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {selectedCount} of {items.length} selected
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {parentFolderId && (
            <div
              className={cn(
                'group relative flex cursor-pointer flex-col items-center rounded-lg border border-muted/40 bg-background/60 p-3 text-muted-foreground transition-colors hover:bg-muted/50',
                parentDragOver && 'border-accent bg-accent/20'
              )}
              onClick={() => onNavigateToFolder(parentFolderId)}
              onDragOver={handleParentDragOver}
              onDragLeave={() => setParentDragOver(false)}
              onDrop={handleParentDrop}
              title="Go up one level"
            >
              <div className="mb-2">
                <CornerLeftUp className="h-4 w-4" />
              </div>
              <span className="w-full truncate text-center text-sm">..</span>
            </div>
          )}
          {items.map((item) => {
            const isSelected = selectedItems.includes(item.id)
            const isCut =
              clipboard?.action === 'cut' && clipboard.itemIds.includes(item.id)
            return (
              <div
                key={item.id}
                className={cn(
                  'group relative flex cursor-pointer flex-col items-center rounded-lg border border-muted/40 bg-background/60 p-3 transition-colors hover:bg-muted/50',
                  isSelected && 'border-accent bg-accent/10',
                  dragOverItem === item.id && 'border-accent bg-accent/20',
                  isCut && 'opacity-40'
                )}
                onClick={(e) => handleItemClick(item, e)}
                onContextMenu={(e) => onContextMenu?.(e, item.id)}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragOver={(e) => handleDragOver(e, item)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, item)}
              >
                {/* Checkbox overlay */}
                <div
                  className={cn(
                    'absolute left-1.5 top-1.5 opacity-0 transition-opacity group-hover:opacity-100',
                    isSelected && 'opacity-100'
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onClick={(e) => handleCheckboxChange(item, e)}
                    aria-label={`Select ${item.name}`}
                  />
                </div>

                <div className="relative mb-2">
                  {getFileIcon(item)}
                  {item.type !== 'folder' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'absolute -right-1 -top-1 h-6 w-6 rounded-full bg-background/80 p-0 transition-opacity hover:bg-accent hover:text-accent-foreground group-hover:opacity-100',
                        basketItems.includes(item.id)
                          ? 'bg-accent text-accent-foreground opacity-100'
                          : 'opacity-0'
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        onDownload(item.id)
                      }}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <span
                  className="w-full truncate text-center text-sm"
                  title={item.name}
                >
                  {item.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-auto">
      <div className="min-w-full">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 border-b border-muted/40 bg-background/60 p-4 text-sm font-medium text-muted-foreground">
          <div className="col-span-5 flex items-center gap-3">
            <Checkbox
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              aria-label="Select all files"
              className={cn(
                someSelected && 'data-[state=unchecked]:bg-primary/20'
              )}
            />
            <span>Name</span>
            {selectedCount > 0 && (
              <span className="text-xs font-normal text-muted-foreground/70">
                ({selectedCount} selected)
              </span>
            )}
          </div>
          <div className="col-span-2 flex items-center">File size</div>
          <div className="col-span-2 flex items-center">Modified</div>
          <div className="col-span-3 flex items-center justify-end gap-1">
            {selectedCount > 0 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-accent"
                  onClick={(e) => {
                    e.stopPropagation()
                    for (const id of selectedItems) {
                      const item = items.find((i) => i.id === id)
                      if (item && item.type !== 'folder') {
                        onDownload(id)
                      }
                    }
                  }}
                  title={`Add ${selectedCount} to basket`}
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    for (const id of selectedItems) {
                      onDelete?.(id)
                    }
                  }}
                  title={`Delete ${selectedCount} item${selectedCount > 1 ? 's' : ''}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Items */}
        <div>
          {parentFolderId && (
            <div
              className={cn(
                'group grid cursor-pointer grid-cols-12 gap-4 border-b border-muted/40 p-4 transition-colors hover:text-accent',
                parentDragOver && 'bg-accent/20'
              )}
              onClick={() => onNavigateToFolder(parentFolderId)}
              onDragOver={handleParentDragOver}
              onDragLeave={() => setParentDragOver(false)}
              onDrop={handleParentDrop}
              title="Go up one level"
            >
              <div className="col-span-5 flex min-w-0 items-center gap-3 text-muted-foreground">
                <div className="h-4 w-4" />
                <CornerLeftUp className="h-4 w-4" />
                <span className="truncate text-sm">..</span>
              </div>
              <div className="col-span-2" />
              <div className="col-span-2" />
              <div className="col-span-3" />
            </div>
          )}
          {items.map((item) => {
            const isSelected = selectedItems.includes(item.id)
            const isMoving = movingItemId === item.id
            const isCut =
              clipboard?.action === 'cut' && clipboard.itemIds.includes(item.id)
            const isRenaming = renamingItemId === item.id
            return (
              <div
                key={item.id}
                className={cn(
                  'group grid cursor-pointer grid-cols-12 gap-4 border-b border-muted/40 p-4 transition-colors hover:text-accent',
                  isSelected && 'bg-accent/10',
                  dragOverItem === item.id && 'bg-accent/20',
                  isMoving && 'opacity-50',
                  isCut && 'opacity-40'
                )}
                onClick={(e) => handleItemClick(item, e)}
                onContextMenu={(e) => onContextMenu?.(e, item.id)}
                draggable={!isMoving}
                onDragStart={(e) => handleDragStart(e, item)}
                onDragOver={(e) => handleDragOver(e, item)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, item)}
              >
                <div className="col-span-5 flex min-w-0 items-center gap-3">
                  <Checkbox
                    checked={isSelected}
                    onClick={(e) => handleCheckboxChange(item, e)}
                    aria-label={`Select ${item.name}`}
                  />
                  {isMoving ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    getFileIcon(item)
                  )}
                  {isRenaming ? (
                    <InlineRename
                      defaultName={item.name}
                      onSubmit={(newName) => onRenameSubmit?.(item.id, newName)}
                      onCancel={() => onRenameCancel?.()}
                    />
                  ) : (
                    <span className="truncate text-sm">{item.name}</span>
                  )}
                </div>
                <div className="col-span-2 flex items-center text-sm">
                  <span>{formatFileSizeUtil(item.size)}</span>
                </div>
                <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                  <span className="truncate">
                    {item.modifiedAt
                      ? formatDateUtil(item.modifiedAt.getTime())
                      : '—'}
                  </span>
                </div>
                <div className="col-span-3 flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-accent"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRename?.(item.id)
                    }}
                    title="Rename"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  {item.type !== 'folder' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'h-7 w-7 p-0 text-muted-foreground hover:text-accent',
                        basketItems.includes(item.id) &&
                          'bg-accent/20 text-accent'
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        onDownload(item.id)
                      }}
                      title="Add to basket"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.(item.id)
                    }}
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
