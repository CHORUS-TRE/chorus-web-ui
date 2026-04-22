'use client'

import {
  CirclePlus,
  FolderPlus,
  HardDrive,
  ShoppingBasket,
  Upload
} from 'lucide-react'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'

import { Breadcrumb } from '@/components/file-manager/breadcrumb'
import {
  type ContextMenuPosition,
  FileContextMenu
} from '@/components/file-manager/file-context-menu'
import { FileGrid } from '@/components/file-manager/file-grid'
import { FolderDeleteDialog } from '@/components/file-manager/folder-delete-dialog'
import { SelectionBasket } from '@/components/file-manager/selection-basket'
import { toast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useFileSystem } from '@/hooks/use-file-system'
import { cn } from '@/lib/utils'
import type { FileSystemItem } from '@/types/file-system'

/** Friendly tooltip descriptions for known mount names (chip row no longer renders these inline). */
const STORE_DESCRIPTION: Record<string, string> = {
  archive: 'Permanent Storage — long-term data that persists across sessions',
  scratch: 'Working Files — temporary workspace for active analysis'
}

function getStoreTooltip(name: string, fallback?: string) {
  return (
    STORE_DESCRIPTION[name.toLowerCase()] ??
    (fallback && fallback.trim().length > 0 ? fallback : 'Storage mount')
  )
}
import {
  createDataExtractionRequest,
  createDataTransferRequest
} from '@/view-model/approval-request-view-model'

interface FileManagerClientProps {
  workspaceId: string
}

export default function FileManagerClient({
  workspaceId
}: FileManagerClientProps) {
  const {
    state,
    stores,
    loading,
    movingItemId,
    searchQuery,
    getChildren,
    selectItem,
    navigateToFolder,
    moveItem,
    deleteItem,
    renameItem,
    createFolder,
    importFile,
    downloadFile,
    setSearch,
    toggleViewMode,
    clearSelection,
    clearBasket,
    selectBasketItem,
    selectRange,
    selectAll,
    fetchFolderContents,
    clipboardCopy,
    clipboardCut,
    paste
  } = useFileSystem(workspaceId)

  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null)
  const [dragOverStoreId, setDragOverStoreId] = useState<string | null>(null)
  const [showBasket, setShowBasket] = useState(false)
  const [folderToDelete, setFolderToDelete] = useState<{
    id: string
    name: string
    childCount: number
  } | null>(null)

  // Smart delete: check if folder is non-empty before deleting
  const handleSmartDelete = useCallback(
    async (itemId: string) => {
      const item = state.items[itemId]
      if (!item) return

      if (item.type === 'folder') {
        await fetchFolderContents(itemId)
        const children = getChildren(itemId)
        if (children.length > 0) {
          setFolderToDelete({
            id: itemId,
            name: item.name,
            childCount: children.length
          })
          return
        }
      }

      deleteItem(itemId)
    },
    [state.items, getChildren, fetchFolderContents, deleteItem]
  )

  const handleConfirmFolderDelete = useCallback(() => {
    if (folderToDelete) {
      deleteItem(folderToDelete.id)
      setFolderToDelete(null)
    }
  }, [folderToDelete, deleteItem])

  // Match the hook's synthesized FileSystemItem id for a given store name.
  const storeIdFromName = useCallback(
    (name: string) => name.replace(/[^a-zA-Z0-9]/g, '_'),
    []
  )

  // When a store is selected, set it as the current folder
  const handleSelectStore = useCallback(
    (storeId: string) => {
      setSelectedStoreId(storeId)
      navigateToFolder(storeId)
      fetchFolderContents(storeId)
    },
    [navigateToFolder, fetchFolderContents]
  )

  // Auto-select first READY store on load
  useEffect(() => {
    if (!selectedStoreId) {
      const firstReady = stores.find((s) => s.status === 'READY')
      if (firstReady) {
        handleSelectStore(storeIdFromName(firstReady.name))
      }
    }
  }, [stores, selectedStoreId, handleSelectStore, storeIdFromName])

  // External file drop handlers (drag from OS)
  const handleExternalDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
      setIsDraggingOver(true)
    }
  }, [])

  const handleExternalDragLeave = useCallback((e: React.DragEvent) => {
    if (e.currentTarget === e.target) {
      setIsDraggingOver(false)
    }
  }, [])

  const handleExternalDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDraggingOver(false)

      const files = e.dataTransfer.files
      if (files.length === 0) return

      for (const file of Array.from(files)) {
        try {
          await importFile(state.currentFolderId || 'root', file)
        } catch (error) {
          console.error('Error importing dropped file:', error)
        }
      }
    },
    [importFile, state.currentFolderId]
  )

  // Context menu state
  const [contextMenuPos, setContextMenuPos] =
    useState<ContextMenuPosition | null>(null)
  const [contextMenuTargetId, setContextMenuTargetId] = useState<string | null>(
    null
  )
  const [renamingItemId, setRenamingItemId] = useState<string | null>(null)

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, itemId: string | null) => {
      e.preventDefault()
      e.stopPropagation()
      setContextMenuPos({ x: e.clientX, y: e.clientY })
      setContextMenuTargetId(itemId)
      if (itemId && !state.selectedItems.includes(itemId)) {
        selectItem(itemId)
      }
    },
    [state.selectedItems, selectItem]
  )

  const closeContextMenu = useCallback(() => {
    setContextMenuPos(null)
    setContextMenuTargetId(null)
  }, [])

  const handleContextCopy = useCallback(() => {
    const ids = contextMenuTargetId
      ? state.selectedItems.includes(contextMenuTargetId)
        ? state.selectedItems
        : [contextMenuTargetId]
      : state.selectedItems
    clipboardCopy(ids)
    closeContextMenu()
  }, [
    contextMenuTargetId,
    state.selectedItems,
    clipboardCopy,
    closeContextMenu
  ])

  const handleContextCut = useCallback(() => {
    const ids = contextMenuTargetId
      ? state.selectedItems.includes(contextMenuTargetId)
        ? state.selectedItems
        : [contextMenuTargetId]
      : state.selectedItems
    clipboardCut(ids)
    closeContextMenu()
  }, [contextMenuTargetId, state.selectedItems, clipboardCut, closeContextMenu])

  const handleContextPaste = useCallback(() => {
    const targetId =
      contextMenuTargetId && state.items[contextMenuTargetId]?.type === 'folder'
        ? contextMenuTargetId
        : state.currentFolderId || 'root'
    paste(targetId)
    closeContextMenu()
  }, [
    contextMenuTargetId,
    state.items,
    state.currentFolderId,
    paste,
    closeContextMenu
  ])

  const handleContextDelete = useCallback(() => {
    const ids = contextMenuTargetId
      ? state.selectedItems.includes(contextMenuTargetId)
        ? state.selectedItems
        : [contextMenuTargetId]
      : state.selectedItems
    for (const id of ids) {
      handleSmartDelete(id)
    }
    closeContextMenu()
  }, [
    contextMenuTargetId,
    state.selectedItems,
    handleSmartDelete,
    closeContextMenu
  ])

  const handleContextRename = useCallback(() => {
    if (contextMenuTargetId) {
      setRenamingItemId(contextMenuTargetId)
    }
    closeContextMenu()
  }, [contextMenuTargetId, closeContextMenu])

  const currentChildren = getChildren(state.currentFolderId)

  // Build breadcrumb path
  const buildPath = (
    folderId: string | null
  ): { id: string; name: string }[] => {
    if (!folderId || folderId === 'root') {
      return []
    }

    const item = state.items[folderId]
    if (!item) return []
    const parentPath = buildPath(item.parentId)
    return [...parentPath, { id: item.id, name: item.name }]
  }

  const currentPath = selectedStoreId ? buildPath(state.currentFolderId) : []

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
      }
    }
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
      {/* Top chip row — stores grouped in one container + basket button */}
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-1 overflow-x-auto rounded-full border border-muted/40 bg-card/40 px-2 py-1.5">
          {stores
            .filter((store) => store.status !== 'DISABLED')
            .map((store) => {
              const storeId = storeIdFromName(store.name)
              const isActive = !showBasket && selectedStoreId === storeId
              const isSelectable = store.status === 'READY'
              const isDropTarget = dragOverStoreId === storeId
              const tooltip = !isSelectable
                ? 'Store unavailable'
                : getStoreTooltip(store.name, store.description)
              return (
                <button
                  key={storeId}
                  disabled={!isSelectable}
                  title={tooltip}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-lg px-3 py-1 text-sm transition-colors',
                    !isSelectable && 'cursor-not-allowed opacity-60',
                    isActive
                      ? 'border border-accent text-accent'
                      : 'border border-transparent text-muted-foreground hover:text-foreground',
                    isDropTarget && 'bg-accent/5 ring-2 ring-accent/70'
                  )}
                  onClick={() => {
                    if (!isSelectable) return
                    setShowBasket(false)
                    handleSelectStore(storeId)
                  }}
                  onDragOver={(e) => {
                    if (!isSelectable) return
                    if (storeId === selectedStoreId) return
                    e.preventDefault()
                    e.dataTransfer.dropEffect = 'copy'
                    if (dragOverStoreId !== storeId) setDragOverStoreId(storeId)
                  }}
                  onDragLeave={() => {
                    if (dragOverStoreId === storeId) setDragOverStoreId(null)
                  }}
                  onDrop={(e) => {
                    if (!isSelectable) return
                    if (storeId === selectedStoreId) return
                    e.preventDefault()
                    setDragOverStoreId(null)
                    const draggedItemId = e.dataTransfer.getData('text/plain')
                    const draggedItem = draggedItemId
                      ? state.items[draggedItemId]
                      : undefined
                    toast({
                      title: 'Cross-store copy coming soon',
                      description: draggedItem
                        ? `Would copy "${draggedItem.name}" to ${store.name}.`
                        : `Would copy to ${store.name}.`
                    })
                  }}
                >
                  <span
                    className={cn(
                      'h-2 w-2 shrink-0 rounded-full',
                      isActive && store.status === 'READY' && 'bg-accent',
                      !isActive &&
                        store.status === 'READY' &&
                        'bg-muted-foreground/40',
                      store.status === 'DISCONNECTED' && 'bg-destructive',
                      store.status !== 'READY' &&
                        store.status !== 'DISCONNECTED' &&
                        'bg-muted-foreground/40'
                    )}
                  />
                  <span className="font-medium">{store.name}</span>
                  <span className="text-xs text-muted-foreground/60">—</span>
                </button>
              )
            })}
        </div>

        <button
          type="button"
          className={cn(
            'flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors',
            showBasket
              ? 'border-accent text-accent'
              : state.basketItems.length > 0
                ? 'border-muted/40 text-accent hover:text-foreground'
                : 'border-muted/40 text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setShowBasket(!showBasket)}
        >
          <ShoppingBasket className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          <span className="font-medium">
            Basket
            {state.basketItems.length > 0 && (
              <span className="ml-1 text-muted-foreground/70">
                · {state.basketItems.length}
              </span>
            )}
          </span>
        </button>
      </div>

      {/* Content panel — full width */}
      <div className="card-glass flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-muted/40 bg-card">
        {showBasket ? (
          /* Basket inline panel */
          <div className="flex flex-1 flex-col overflow-auto p-4">
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
        ) : selectedStoreId ? (
          <>
            {/* Toolbar row: breadcrumb + actions */}
            <div className="flex h-11 items-center justify-between border-b border-muted/40 px-3">
              <Breadcrumb
                currentPath={currentPath}
                onNavigateToFolder={navigateToFolder}
              />

              <div className="flex items-center gap-1">
                <Button
                  onClick={handleCreateFolder}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-accent"
                >
                  <FolderPlus className="h-4 w-4" />
                  New folder
                </Button>
                <Button
                  onClick={handleImport}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-accent"
                >
                  <Upload className="h-4 w-4" />
                  Import
                </Button>
              </div>
            </div>

            {/* File browser area with drop zone */}
            <div
              className="relative flex min-h-0 flex-1 flex-col overflow-auto"
              onDragOver={handleExternalDragOver}
              onDragLeave={handleExternalDragLeave}
              onDrop={handleExternalDrop}
              onContextMenu={(e) => {
                if (e.target === e.currentTarget) {
                  handleContextMenu(e, null)
                }
              }}
            >
              {/* Drop zone overlay */}
              {isDraggingOver && (
                <div className="absolute inset-0 z-30 flex items-center justify-center rounded-lg border-2 border-dashed border-accent bg-accent/10">
                  <div className="flex flex-col items-center gap-2 text-accent">
                    <Upload className="h-8 w-8" />
                    <span className="text-sm font-medium">
                      Drop files to upload
                    </span>
                  </div>
                </div>
              )}

              {currentChildren.length === 0 && !loading ? (
                /* Empty state — full-height dashed dropzone */
                <div className="m-3 flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-muted-foreground">
                  <Upload className="h-12 w-12 opacity-40" />
                  <div className="text-center">
                    <p className="text-sm font-medium">No files yet</p>
                    <p className="mt-1 text-xs">
                      Drag & drop files here or click Import to get started
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleImport}>
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                </div>
              ) : (
                <FileGrid
                  items={currentChildren}
                  selectedItems={state.selectedItems}
                  viewMode={state.viewMode}
                  onSelectItem={selectItem}
                  onSelectRange={selectRange}
                  onSelectAll={selectAll}
                  onClearSelection={clearSelection}
                  onNavigateToFolder={navigateToFolder}
                  onMoveItem={moveItem}
                  onDownload={handleAddToBasket}
                  onDelete={handleSmartDelete}
                  onRename={(itemId) => setRenamingItemId(itemId)}
                  basketItems={state.basketItems}
                  movingItemId={movingItemId}
                  onContextMenu={handleContextMenu}
                  clipboard={state.clipboard}
                  renamingItemId={renamingItemId}
                  onRenameSubmit={(itemId, newName) => {
                    renameItem(itemId, newName)
                    setRenamingItemId(null)
                  }}
                  onRenameCancel={() => setRenamingItemId(null)}
                  parentFolderId={(() => {
                    if (
                      !state.currentFolderId ||
                      state.currentFolderId === 'root'
                    ) {
                      return null
                    }
                    const parentId =
                      state.items[state.currentFolderId]?.parentId
                    return parentId && parentId !== 'root' ? parentId : null
                  })()}
                />
              )}
            </div>
          </>
        ) : (
          /* No store selected — welcome state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-muted-foreground">
            <HardDrive className="h-12 w-12 opacity-40" />
            <div className="text-center">
              <p className="text-sm font-medium">
                Select a store to browse files
              </p>
              <p className="mt-1 text-xs">Choose a store from the top bar</p>
            </div>
          </div>
        )}
      </div>

      {/* Context Menu */}
      <FileContextMenu
        position={contextMenuPos}
        targetItemId={contextMenuTargetId}
        targetItemType={
          contextMenuTargetId
            ? (state.items[contextMenuTargetId]?.type ?? null)
            : null
        }
        selectedItemIds={state.selectedItems}
        clipboard={state.clipboard}
        onCopy={handleContextCopy}
        onCut={handleContextCut}
        onPaste={handleContextPaste}
        onDelete={handleContextDelete}
        onRename={handleContextRename}
        onNewFolder={handleCreateFolder}
        onUpload={handleImport}
        onClose={closeContextMenu}
      />

      {/* Folder Delete Confirmation */}
      <FolderDeleteDialog
        open={folderToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setFolderToDelete(null)
        }}
        folderName={folderToDelete?.name ?? ''}
        itemCount={folderToDelete?.childCount ?? 0}
        onConfirmDelete={handleConfirmFolderDelete}
      />

      {/* Create Folder Dialog */}
      <Dialog
        open={showCreateFolderDialog}
        onOpenChange={setShowCreateFolderDialog}
      >
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>New folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="New folder"
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
