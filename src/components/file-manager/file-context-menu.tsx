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
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

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
  const [coords, setCoords] = useState({ left: 0, top: 0, visible: false })

  // Adjust for viewport overflow before first paint
  useLayoutEffect(() => {
    if (!position || !menuRef.current) return
    const { width, height } = menuRef.current.getBoundingClientRect()
    const left =
      position.x + width > window.innerWidth ? position.x - width : position.x
    const top =
      position.y + height > window.innerHeight
        ? position.y - height
        : position.y
    setCoords({ left, top, visible: true })
  }, [position])

  // Reset visibility when menu closes
  useEffect(() => {
    if (!position) setCoords((c) => ({ ...c, visible: false }))
  }, [position])

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

  if (!position) return null

  const isOnItem = targetItemId !== null
  const canPaste = clipboard !== null && clipboard.itemIds.length > 0

  const menuItemClass =
    'flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground'
  const disabledClass = 'pointer-events-none opacity-50'

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[10rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
      style={{
        left: coords.left,
        top: coords.top,
        visibility: coords.visible ? 'visible' : 'hidden'
      }}
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
    </div>,
    document.body
  )
}
