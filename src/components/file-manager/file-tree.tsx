'use client'

import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'

import { cn } from '~/lib/utils'
import type { FileSystemItem } from '~/types/file-system'

interface FileTreeProps {
  items: FileSystemItem[]
  selectedItems: string[]
  currentFolderId: string | null
  onSelectItem: (itemId: string, multiSelect?: boolean) => void
  onNavigateToFolder: (folderId: string) => void
  onMoveItem: (itemId: string, newParentId: string) => void
  getChildren: (parentId: string | null) => FileSystemItem[]
}

interface TreeNodeProps extends FileTreeProps {
  item: FileSystemItem
  level: number
}

function TreeNode({ item, level, ...props }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0 || item.id === 'hip')
  const children = props.getChildren(item.id)
  const hasChildren = children.length > 0
  const isSelected = props.selectedItems.includes(item.id)
  const isCurrent = props.currentFolderId === item.id

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (hasChildren) {
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
          {hasChildren &&
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
          ) : null}
          <span className="truncate">{item.name}</span>
        </div>
      </div>
      {hasChildren && isExpanded && (
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
