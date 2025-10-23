import {
  Archive,
  File,
  FileText,
  Folder,
  ImageIcon,
  MoreHorizontal,
  Music,
  Video
} from 'lucide-react'
import type React from 'react'
import { useState } from 'react'

import { cn } from '~/lib/utils'
import {
  formatDate as formatDateUtil,
  formatFileSize as formatFileSizeUtil
} from '~/lib/utils'
import type { FileSystemItem } from '~/types/file-system'

interface FileGridProps {
  items: FileSystemItem[]
  selectedItems: string[]
  viewMode: 'list' | 'grid'
  onSelectItem: (itemId: string, multiSelect?: boolean) => void
  onNavigateToFolder: (folderId: string) => void
  onMoveItem: (itemId: string, newParentId: string) => void
}

function getFileIcon(item: FileSystemItem) {
  if (item.type === 'folder') {
    return <Folder className="h-5 w-5 text-gray-400" />
  }

  const ext = item.extension?.toLowerCase()
  switch (ext) {
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileText className="h-5 w-5 text-blue-500" />
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return <ImageIcon className="h-5 w-5 text-green-500" />
    case 'mp4':
    case 'avi':
    case 'mov':
      return <Video className="h-5 w-5 text-purple-500" />
    case 'mp3':
    case 'wav':
    case 'flac':
      return <Music className="h-5 w-5 text-pink-500" />
    case 'zip':
    case 'rar':
    case '7z':
      return <Archive className="h-5 w-5 text-orange-500" />
    case 'drawio':
      return <FileText className="h-5 w-5 text-orange-500" />
    default:
      return <File className="h-5 w-5 text-muted-foreground" />
  }
}

export function FileGrid({
  items,
  selectedItems,
  viewMode,
  onSelectItem,
  onNavigateToFolder,
  onMoveItem
}: FileGridProps) {
  const [dragOverItem, setDragOverItem] = useState<string | null>(null)

  const handleItemClick = (item: FileSystemItem, e: React.MouseEvent) => {
    e.stopPropagation()
    onSelectItem(item.id, e.ctrlKey || e.metaKey)
    if (item.type === 'folder') {
      onNavigateToFolder(item.id)
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

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'flex cursor-pointer flex-col items-center rounded-lg border border-muted/40 bg-background/60 p-3 transition-colors hover:bg-muted/50',
              selectedItems.includes(item.id) && 'border-accent bg-accent/10',
              dragOverItem === item.id && 'border-accent bg-accent/20'
            )}
            onClick={(e) => handleItemClick(item, e)}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDragOver={(e) => handleDragOver(e, item)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, item)}
          >
            <div className="mb-2">{getFileIcon(item)}</div>
            <span
              className="w-full truncate text-center text-sm"
              title={item.name}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-auto">
      <div className="min-w-full">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 border-b border-muted/40 bg-background/60 p-4 text-sm font-medium">
          <div className="col-span-5">Name</div>
          <div className="col-span-2">Owner</div>
          <div className="col-span-3">Last opened</div>
          <div className="col-span-2">File size</div>
        </div>

        {/* Items */}
        <div>
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'grid cursor-pointer grid-cols-12 gap-4 border-b border-muted/40 p-4 transition-colors hover:text-accent',
                selectedItems.includes(item.id) && 'bg-accent/10',
                dragOverItem === item.id && 'bg-accent/20'
              )}
              onClick={(e) => handleItemClick(item, e)}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragOver={(e) => handleDragOver(e, item)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item)}
            >
              <div className="col-span-5 flex min-w-0 items-center gap-3">
                {getFileIcon(item)}
                <span className="truncate">{item.name}</span>
              </div>
              <div className="text-sm/80 col-span-2 flex items-center">
                {item.owner}
              </div>
              <div className="text-sm/80 col-span-3 flex items-center">
                {formatDateUtil(item.modifiedAt.toISOString())}
              </div>
              <div className="text-sm/80 col-span-2 flex items-center justify-between">
                <span>{formatFileSizeUtil(item.size)}</span>
                <button className="rounded p-1 hover:bg-muted">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
