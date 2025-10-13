'use client'

import {
  Archive,
  ChevronDown,
  ChevronRight,
  File,
  FileAudio,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  FolderOpen
} from 'lucide-react'
import type React from 'react'
import { useState } from 'react'

import { cn } from '~/lib/utils'
import type { FileSystemItem } from '~/types/file-system'

// Helper function to get file icon based on extension
function getFileIcon(extension?: string) {
  if (!extension) return File

  const ext = extension.toLowerCase()

  // Text files
  if (['txt', 'md', 'doc', 'docx', 'rtf'].includes(ext)) {
    return FileText
  }

  // Images
  if (
    ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(ext)
  ) {
    return FileImage
  }

  // Videos
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext)) {
    return FileVideo
  }

  // Audio
  if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'].includes(ext)) {
    return FileAudio
  }

  // Code files
  if (
    [
      'js',
      'ts',
      'tsx',
      'jsx',
      'html',
      'css',
      'scss',
      'py',
      'java',
      'cpp',
      'c',
      'php',
      'rb',
      'go',
      'rs',
      'swift',
      'kt'
    ].includes(ext)
  ) {
    return FileCode
  }

  // Spreadsheets
  if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) {
    return FileSpreadsheet
  }

  // Archives
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext)) {
    return Archive
  }

  // Default file icon
  return File
}

interface FileTreeProps {
  items: FileSystemItem[]
  selectedItems: string[]
  currentFolderId: string | null
  onSelectItem: (itemId: string, multiSelect?: boolean) => void
  onNavigateToFolder: (folderId: string) => void
  onMoveItem: (itemId: string, newParentId: string) => void
  getChildren: (parentId: string | null) => FileSystemItem[]
  onExpandFolder?: (folderId: string) => void
}

interface TreeNodeProps extends FileTreeProps {
  item: FileSystemItem
  level: number
}

function TreeNode({ item, level, ...props }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const children = props.getChildren(item.id)
  const isSelected = props.selectedItems.includes(item.id)
  const isCurrent = props.currentFolderId === item.id

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (item.type === 'folder') {
      if (!isExpanded && props.onExpandFolder) {
        await props.onExpandFolder(item.id)
      }
      setIsExpanded(!isExpanded)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    props.onSelectItem(item.id, e.ctrlKey || e.metaKey)
    if (item.type === 'folder') {
      props.onNavigateToFolder(item.id)
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', item.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (item.type === 'folder') {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const draggedItemId = e.dataTransfer.getData('text/plain')
    if (draggedItemId !== item.id && item.type === 'folder') {
      props.onMoveItem(draggedItemId, item.id)
    }
  }

  return (
    <div>
      <div
        className={cn(
          'flex cursor-pointer items-center gap-1 rounded-sm px-2 py-1 text-sm transition-colors hover:bg-muted/50',
          isSelected && 'bg-accent/10 text-accent',
          isCurrent && 'bg-accent/20 font-medium'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div
          className="flex h-4 w-4 items-center justify-center"
          onClick={handleToggle}
        >
          {item.type === 'folder' &&
            (isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            ))}
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1">
          {item.type === 'folder' ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 flex-shrink-0 text-gray-400" />
            ) : (
              <Folder className="h-4 w-4 flex-shrink-0 text-gray-400" />
            )
          ) : (
            (() => {
              const FileIcon = getFileIcon(item.extension)
              return (
                <FileIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
              )
            })()
          )}
          <span className="truncate">{item.name}</span>
        </div>
      </div>
      {isExpanded && (
        <div>
          {children.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              {...props}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileTree(props: FileTreeProps) {
  return (
    <div className="h-full overflow-auto">
      {props.items.map((item) => (
        <TreeNode key={item.id} item={item} level={0} {...props} />
      ))}
    </div>
  )
}
