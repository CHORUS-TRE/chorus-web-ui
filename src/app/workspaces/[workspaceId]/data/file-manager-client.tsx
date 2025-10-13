'use client'

import { CirclePlus } from 'lucide-react'
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
    downloadFile,
    setSearch,
    toggleViewMode,
    clearSelection,
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

  const handleBackgroundClick = () => {
    clearSelection()
  }

  const handleExpandFolder = async (folderId: string) => {
    await fetchFolderContents(folderId)
  }

  // Show loading state
  if (loading && Object.keys(state.items).length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <div className="text-lg">Loading files...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col text-white">
      {/* Toolbar */}
      <Toolbar
        viewMode={state.viewMode}
        searchQuery={searchQuery}
        onToggleViewMode={toggleViewMode}
        onCreateFolder={handleCreateFolder}
        onImport={handleImport}
        onSearch={setSearch}
      />

      {/* Action Bar */}
      <ActionBar
        selectedItems={state.selectedItems}
        onDelete={deleteItem}
        onRename={renameItem}
        onDownload={downloadFile}
        onClearSelection={clearSelection}
        getItemName={getItemName}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden text-white">
        {/* Sidebar */}
        <div className="flex w-64 flex-col overflow-hidden rounded-2xl border-r border-muted/40 bg-background/60">
          <div className="p-4">
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
              onExpandFolder={handleExpandFolder}
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
        <DialogContent className="bg-background text-white">
          <DialogHeader>
            <DialogTitle className="text-white">New folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="New folder"
              className="text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateFolderSubmit()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setShowCreateFolderDialog(false)}
              className="focus:bg-background focus:text-accent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolderSubmit}
              className="rounded-full bg-transparent text-accent ring-1 ring-accent hover:bg-accent-background hover:text-black focus:bg-accent-background"
            >
              <CirclePlus className="h-4 w-4" />
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
