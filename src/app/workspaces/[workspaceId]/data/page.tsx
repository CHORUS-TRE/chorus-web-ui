'use client'

import { useState } from 'react'

import { ActionBar } from '~/components/file-manager/action-bar'
import { Breadcrumb } from '~/components/file-manager/breadcrumb'
import { FileGrid } from '~/components/file-manager/file-grid'
import { FileTree } from '~/components/file-manager/file-tree'
import { Toolbar } from '~/components/file-manager/toolbar'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { useFileSystem } from '~/hooks/use-file-system'

export default function FileManager() {
  const {
    state,
    getChildren,
    selectItem,
    navigateToFolder,
    moveItem,
    deleteItem,
    renameItem,
    createFolder,
    toggleViewMode,
    clearSelection
  } = useFileSystem()

  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  const rootChildren = getChildren('root')
  const currentChildren = getChildren(state.currentFolderId)

  // Build breadcrumb path
  const buildPath = (
    folderId: string | null
  ): { id: string; name: string }[] => {
    if (!folderId || folderId === 'root') {
      return [{ id: 'root', name: 'My data' }]
    }

    const item = state.items[folderId]
    if (!item) return [{ id: 'root', name: 'My data' }]

    const parentPath = buildPath(item.parentId)
    return [...parentPath, { id: item.id, name: item.name }]
  }

  const currentPath = buildPath(state.currentFolderId)

  const handleCreateFolder = () => {
    setShowCreateFolderDialog(true)
  }

  const handleCreateFolderSubmit = () => {
    if (newFolderName.trim()) {
      createFolder(state.currentFolderId || 'root', newFolderName.trim())
      setShowCreateFolderDialog(false)
      setNewFolderName('')
    }
  }

  const getItemName = (itemId: string): string => {
    return state.items[itemId]?.name || ''
  }

  const handleBackgroundClick = () => {
    clearSelection()
  }

  return (
    <div className="flex h-screen flex-col bg-background text-white">
      {/* Header */}
      {/* <div className="flex items-center justify-between border-b bg-background p-4 text-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <span className="text-sm font-bold text-accent-foreground">
                D
              </span>
            </div>
            <h1 className="text-xl font-semibold">Data</h1>
          </div>
        </div>
      </div> */}

      {/* Toolbar */}
      <Toolbar
        viewMode={state.viewMode}
        onToggleViewMode={toggleViewMode}
        onCreateFolder={handleCreateFolder}
      />

      {/* Action Bar */}
      <ActionBar
        selectedItems={state.selectedItems}
        onDelete={deleteItem}
        onRename={renameItem}
        onClearSelection={clearSelection}
        getItemName={getItemName}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden text-white">
        {/* Sidebar */}
        <div className="flex w-64 flex-col overflow-hidden border-r bg-sidebar">
          <div className="border-b p-4">
            <h2 className="font-medium text-sidebar-foreground text-white">
              My data
            </h2>
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
            />
          </div>
        </div>

        {/* Main Panel */}
        <div
          className="flex flex-1 flex-col overflow-hidden"
          onClick={handleBackgroundClick}
        >
          {/* Breadcrumb */}
          <Breadcrumb
            currentPath={currentPath}
            onNavigateToFolder={navigateToFolder}
          />

          {/* File Grid */}
          <div className="flex-1 overflow-auto">
            <FileGrid
              items={currentChildren}
              selectedItems={state.selectedItems}
              viewMode={state.viewMode}
              onSelectItem={selectItem}
              onNavigateToFolder={navigateToFolder}
              onMoveItem={moveItem}
            />
          </div>
        </div>
      </div>

      {/* Create Folder Dialog */}
      <Dialog
        open={showCreateFolderDialog}
        onOpenChange={setShowCreateFolderDialog}
      >
        <DialogContent>
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
              variant="outline"
              onClick={() => setShowCreateFolderDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateFolderSubmit}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
