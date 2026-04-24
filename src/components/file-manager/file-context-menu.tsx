'use client'

import {
  Clipboard,
  ClipboardCopy,
  FolderPlus,
  Pencil,
  Scissors,
  Trash2,
  Upload
} from 'lucide-react'
import type React from 'react'
import { useCallback, useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'
import type { FileClipboard } from '@/types/file-system'

export interface ContextMenuPosition {
  x: number
  y: number
}

export interface FileContextMenuProps {
  position: ContextMenuPosition | null
  /** The item right-clicked on, or null if clicked on empty space */
  targetItemId: string | null
  targetItemType: 'file' | 'folder' | null
  selectedItemIds: string[]
  clipboard: FileClipboard | null
  onCopy: () => void
  onCut: () => void
  onPaste: () => void
  onDelete: () => void
  onRename: () => void
  onNewFolder: () => void
  onUpload: () => void
  onClose: () => void
}

export function FileContextMenu({
  position,
  targetItemId,
  targetItemType,
  selectedItemIds,
  clipboard,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onRename,
  onNewFolder,
  onUpload,
  onClose
}: FileContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on click outside or Escape
  useEffect(() => {
    if (!position) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [position, onClose])

  // Adjust menu position to stay within viewport
  useEffect(() => {
    if (!position || !menuRef.current) return
    const menu = menuRef.current
    const rect = menu.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    if (rect.right > viewportWidth) {
      menu.style.left = `${position.x - rect.width}px`
    }
    if (rect.bottom > viewportHeight) {
      menu.style.top = `${position.y - rect.height}px`
    }
  }, [position])

  if (!position) return null

  const hasSelection = selectedItemIds.length > 0 || targetItemId !== null
  const isOnItem = targetItemId !== null
  const canPaste = clipboard !== null && clipboard.itemIds.length > 0

  const menuItemClass =
    'flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground'
  const disabledClass = 'pointer-events-none opacity-50'

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[10rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
      style={{ left: position.x, top: position.y }}
    >
      {isOnItem ? (
        <>
          {targetItemType === 'file' && (
            <button className={menuItemClass} onClick={onCopy}>
              <ClipboardCopy className="h-4 w-4" />
              Copy
            </button>
          )}
          <button className={menuItemClass} onClick={onCut}>
            <Scissors className="h-4 w-4" />
            Cut
          </button>
          {targetItemType === 'folder' && (
            <button
              className={cn(menuItemClass, !canPaste && disabledClass)}
              onClick={onPaste}
              disabled={!canPaste}
            >
              <Clipboard className="h-4 w-4" />
              Paste
            </button>
          )}
          <div className="-mx-1 my-1 h-px bg-muted" />
          <button className={menuItemClass} onClick={onRename}>
            <Pencil className="h-4 w-4" />
            Rename
          </button>
          <button
            className={cn(
              menuItemClass,
              'text-destructive hover:text-destructive'
            )}
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </>
      ) : (
        <>
          <button
            className={cn(menuItemClass, !canPaste && disabledClass)}
            onClick={onPaste}
            disabled={!canPaste}
          >
            <Clipboard className="h-4 w-4" />
            Paste
          </button>
          <div className="-mx-1 my-1 h-px bg-muted" />
          <button className={menuItemClass} onClick={onNewFolder}>
            <FolderPlus className="h-4 w-4" />
            New Folder
          </button>
          <button className={menuItemClass} onClick={onUpload}>
            <Upload className="h-4 w-4" />
            Upload
          </button>
        </>
      )}
    </div>
  )
}
