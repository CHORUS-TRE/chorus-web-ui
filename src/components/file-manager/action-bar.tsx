'use client'

import { Copy, Download, Edit3, Move, Share2, Trash2, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '~/components/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import type { FileSystemItem } from '~/types/file-system'

interface ActionBarProps {
  selectedItems: FileSystemItem[]
  onDelete: (itemId: string) => Promise<void>
  onRename: (itemId: string, newName: string) => Promise<void>
  onAddToBasket: (itemId: string) => void
  onClearSelection: () => void
  getItemName: (itemId: string) => string
}

export function ActionBar({
  selectedItems,
  onDelete,
  onRename,
  onAddToBasket,
  onClearSelection,
  getItemName
}: ActionBarProps) {
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [renameValue, setRenameValue] = useState('')

  const handleRename = () => {
    if (selectedItems.length === 1) {
      const itemName = selectedItems[0].name
      setRenameValue(itemName)
      setShowRenameDialog(true)
    }
  }

  const handleRenameSubmit = async () => {
    if (renameValue.trim() && selectedItems.length === 1) {
      try {
        await onRename(selectedItems[0].id, renameValue.trim())
        setShowRenameDialog(false)
        setRenameValue('')
      } catch (error) {
        console.error('Error renaming item:', error)
        // Error is already handled in the hook and d isplayed via error state
      }
    }
  }

  const handleDelete = async () => {
    for (const item of selectedItems) {
      try {
        await onDelete(item.id)
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    }
    onClearSelection()
  }

  const handleAddToBasket = () => {
    for (const item of selectedItems) {
      if (item.type !== 'folder') {
        onAddToBasket(item.id)
      }
    }
    onClearSelection()
  }

  return (
    <>
      <div className="flex items-center gap-2 rounded-2xl border border-muted/40 bg-background/60 p-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {selectedItems.length}{' '}
            {selectedItems.length <= 1 ? 'item' : 'items'} selected
          </span>

          {selectedItems.length > 0 && (
            <Button
              variant="ghost"
              onClick={onClearSelection}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {selectedItems.length > 0 && (
          <div className="ml-4 flex items-center gap-1">
            <Button
              variant="ghost"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            {selectedItems.length === 1 && (
              <Button
                variant="ghost"
                onClick={handleRename}
                className="text-muted-foreground hover:text-accent"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            )}

            {selectedItems.every((item) => item.type !== 'folder') && (
              <Button
                variant="ghost"
                onClick={handleAddToBasket}
                className="text-muted-foreground hover:text-accent"
                title="Add to basket"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            {/* 
          <Button variant="ghost" disabled>
            <Copy className="h-4 w-4" />
          </Button>

          <Button variant="ghost" disabled>
            <Move className="h-4 w-4" />
          </Button> */}
          </div>
        )}
      </div>
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder="New name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRenameSubmit()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRenameDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRenameSubmit}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
