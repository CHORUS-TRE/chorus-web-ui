'use client'

import { CirclePlus, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '~/components/button'
import { ActionBar } from '~/components/file-manager/action-bar'
import { Breadcrumb } from '~/components/file-manager/breadcrumb'
import { FileGrid } from '~/components/file-manager/file-grid'
import { FileTree } from '~/components/file-manager/file-tree'
import { SelectionBasket } from '~/components/file-manager/selection-basket'
import { Toolbar } from '~/components/file-manager/toolbar'
import { UploadProgress } from '~/components/file-manager/upload-progress'
import { toast } from '~/components/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { useFileSystem } from '~/hooks/use-file-system'
import type { FileSystemItem } from '~/types/file-system'
import {
  createDataExtractionRequest,
  createDataTransferRequest
} from '~/view-model/approval-request-view-model'

interface FileManagerClientProps {
  workspaceId: string
}

export default function FileManagerClient({
  workspaceId
}: FileManagerClientProps) {
  const {
    state,
    loading,
    searchQuery,
    getChildren,
    selectItem,
    navigateToFolder,
    moveItem,
    deleteItem,
    renameItem,
    createFolder,
    importFile,
    abortMultipartUpload,
    downloadFile,
    setSearch,
    toggleViewMode,
    clearSelection,
    clearBasket,
    selectBasketItem,
    fetchFolderContents
  } = useFileSystem(workspaceId)

  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  const rootChildren = getChildren('root')
  const currentChildren = getChildren(state.currentFolderId)

  // Build breadcrumb path
  const buildPath = (
    folderId: string | null
  ): { id: string; name: string }[] => {
    if (!folderId || folderId === 'root') {
      return [{ id: 'root', name: '/' }]
    }

    const item = state.items[folderId]
    if (!item) return [{ id: 'root', name: '/' }]
    const parentPath = buildPath(item.parentId)
    return [...parentPath, { id: item.id, name: item.name }]
  }

  const currentPath = buildPath(state.currentFolderId)

  const handleCreateFolder = () => {
    setShowCreateFolderDialog(true)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files
      if (files) {
        for (const file of Array.from(files)) {
          try {
            await importFile(state.currentFolderId || 'root', file)
          } catch (error) {
            console.error('Error importing file:', error)
          }
        }
      }
    }
    input.click()
  }

  const handleCreateFolderSubmit = async () => {
    if (newFolderName.trim()) {
      try {
        await createFolder(
          state.currentFolderId || 'root',
          newFolderName.trim()
        )
        setShowCreateFolderDialog(false)
        setNewFolderName('')
      } catch (error) {
        console.error('Error creating folder:', error)
        // Error is already handled in the hook and displayed via error state
      }
    }
  }

  const getItemName = (itemId: string): string => {
    return state.items[itemId]?.name || ''
  }

  const handleRemoveFromBasket = (itemId: string) => {
    selectBasketItem(itemId, false)
  }

  const handleDownloadRequest = async (
    items: FileSystemItem[],
    justification: string
  ) => {
    try {
      const result = await createDataExtractionRequest({
        title: `Download request for ${items.length} files`,
        description: justification,
        sourceWorkspaceId: workspaceId,
        fileIds: items.map((item) => item.path)
      })

      if (result.error) {
        toast({
          title: 'Request failed',
          description: result.error,
          variant: 'destructive'
        })
        return
      }

      toast({
        title: 'Request submitted',
        description: 'Your download request has been submitted for approval.',
        variant: 'default'
      })
      clearBasket()
    } catch (error) {
      console.error('Error submitting download request:', error)
    }
  }

  const handleTransferRequest = async (
    items: FileSystemItem[],
    targetWorkspaceId: string,
    justification: string
  ) => {
    try {
      const result = await createDataTransferRequest({
        title: `Transfer request for ${items.length} files`,
        description: justification,
        sourceWorkspaceId: workspaceId,
        destinationWorkspaceId: targetWorkspaceId,
        fileIds: items.map((item) => item.path)
      })

      if (result.error) {
        toast({
          title: 'Request failed',
          description: result.error,
          variant: 'destructive'
        })
        return
      }

      toast({
        title: 'Request submitted',
        description: 'Your transfer request has been submitted for approval.',
        variant: 'default'
      })
      clearBasket()
    } catch (error) {
      console.error('Error submitting transfer request:', error)
    }
  }

  const handleAddToBasket = (itemId: string) => {
    selectBasketItem(itemId, true)
  }

  const handleExpandFolder = async (folderId: string) => {
    await fetchFolderContents(folderId)
  }

  // Show loading state
  if (loading && Object.keys(state.items).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="text-lg">Loading files...</div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="w-64">
        {Object.values(state.uploads).map((upload) => (
          <UploadProgress
            key={upload.id}
            upload={upload}
            onUploadCancel={abortMultipartUpload}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="card-glass flex flex-1 overflow-hidden bg-card">
        {/* Sidebar */}
        <div className="flex w-48 flex-col overflow-hidden rounded-l-2xl border border-r-0 border-muted/40">
          <div className="border-b border-muted/40 p-4">
            <div className="text-md font-medium text-muted-foreground">
              Explorer
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <FileTree
              items={rootChildren}
              selectedItems={state.selectedItems}
              currentFolderId={state.currentFolderId}
              onSelectItem={selectItem}
              onNavigateToFolder={navigateToFolder}
              onMoveItem={moveItem}
              getChildren={getChildren}
              onExpandFolder={handleExpandFolder}
              onDownload={handleAddToBasket}
              basketItems={state.basketItems}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-row overflow-hidden">
          {/* Main Panel */}
          <div className="relative flex flex-1 flex-col overflow-hidden border-r border-muted/40 pr-4">
            <div className="flex flex-row items-center justify-between">
              {/* Breadcrumb */}
              <Breadcrumb
                currentPath={currentPath}
                onNavigateToFolder={navigateToFolder}
              />

              {/* Toolbar */}
              <Toolbar
                viewMode={state.viewMode}
                searchQuery={searchQuery}
                onToggleViewMode={toggleViewMode}
                onCreateFolder={handleCreateFolder}
                onImport={handleImport}
                onSearch={setSearch}
              />
            </div>

            {/* File Grid */}
            <div className="flex-1 overflow-auto pb-24">
              <FileGrid
                items={currentChildren}
                selectedItems={state.selectedItems}
                viewMode={state.viewMode}
                onSelectItem={selectItem}
                onNavigateToFolder={navigateToFolder}
                onMoveItem={moveItem}
                onDownload={handleAddToBasket}
                basketItems={state.basketItems}
              />
            </div>

            {/* Action Bar - Floating & Sticky to the bottom */}
            {state.selectedItems.some(
              (id) => state.items[id]?.type !== 'folder'
            ) && (
              <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
                <ActionBar
                  selectedItems={state.selectedItems
                    .map((id) => state.items[id])
                    .filter(
                      (item): item is FileSystemItem =>
                        item !== undefined && item.type !== 'folder'
                    )}
                  onDelete={deleteItem}
                  onRename={renameItem}
                  onAddToBasket={handleAddToBasket}
                  onClearSelection={clearSelection}
                  getItemName={getItemName}
                />
              </div>
            )}
          </div>

          {/* Selection Basket */}
          <div className="flex h-full w-80 flex-col overflow-hidden bg-background/30 p-2">
            <SelectionBasket
              selectedItems={state.basketItems
                .map((id) => state.items[id])
                .filter((item): item is FileSystemItem => item !== undefined)}
              onRemoveItem={handleRemoveFromBasket}
              onClearSelection={clearBasket}
              onDownloadRequest={handleDownloadRequest}
              onTransferRequest={handleTransferRequest}
            />
          </div>
        </div>
      </div>

      {/* Create Folder Dialog */}
      <Dialog
        open={showCreateFolderDialog}
        onOpenChange={setShowCreateFolderDialog}
      >
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle className="">New folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="New folder"
              className=""
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateFolderSubmit()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="accent-filled"
              onClick={() => setShowCreateFolderDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateFolderSubmit} variant="accent-filled">
              <CirclePlus className="h-4 w-4" />
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
