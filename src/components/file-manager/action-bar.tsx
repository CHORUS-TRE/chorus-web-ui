'use client'

import { Copy, Download, Edit3, Move, Share2, Trash2, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'

interface ActionBarProps {
  selectedItems: string[]
  onDelete: (itemId: string) => Promise<void>
  onRename: (itemId: string, newName: string) => Promise<void>
  onDownload: (itemId: string) => Promise<void>
  onClearSelection: () => void
  getItemName: (itemId: string) => string
}

export function ActionBar({
  selectedItems,
  onDelete,
  onRename,
  onDownload,
  onClearSelection,
  getItemName
}: ActionBarProps) {
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [renameValue, setRenameValue] = useState('')

  if (selectedItems.length === 0) {
    return null
  }

  const handleRename = () => {
    if (selectedItems.length === 1) {
      const itemName = getItemName(selectedItems[0])
      setRenameValue(itemName)
      setShowRenameDialog(true)
    }
  }

  const handleRenameSubmit = async () => {
    if (renameValue.trim() && selectedItems.length === 1) {
      try {
        await onRename(selectedItems[0], renameValue.trim())
        setShowRenameDialog(false)
        setRenameValue('')
      } catch (error) {
        console.error('Error renaming item:', error)
        // Error is already handled in the hook and displayed via error state
      }
    }
  }

  const handleDelete = async () => {
    for (const itemId of selectedItems) {
      try {
        await onDelete(itemId)
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    }
    onClearSelection()
  }

  const handleDownload = async () => {
    for (const itemId of selectedItems) {
      try {
        await onDownload(itemId)
      } catch (error) {
        console.error('Error downloading item:', error)
      }
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 border-b p-4 text-white">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {selectedItems.length} sélectionné
            {selectedItems.length > 1 ? 's' : ''}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="ml-4 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {selectedItems.length === 1 && (
            <Button variant="ghost" size="sm" onClick={handleRename}>
              <Edit3 className="h-4 w-4" />
            </Button>
          )}

          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm">
            <Copy className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm">
            <Move className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renommer</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder="Nouveau nom"
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
              Annuler
            </Button>
            <Button onClick={handleRenameSubmit}>Renommer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
