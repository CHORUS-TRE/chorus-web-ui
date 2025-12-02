'use client'

import { CirclePlus, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '~/components/button'
import { ActionBar } from '~/components/file-manager/action-bar'
import { Breadcrumb } from '~/components/file-manager/breadcrumb'
import { FileGrid } from '~/components/file-manager/file-grid'
import { FileTree } from '~/components/file-manager/file-tree'
import { Toolbar } from '~/components/file-manager/toolbar'
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
    abortMultipartUpload,
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

  const handleBackgroundClick = () => {
    clearSelection()
  }

  const handleExpandFolder = async (folderId: string) => {
    await fetchFolderContents(folderId)
  }

  // Show loading state
  if (loading && Object.keys(state.items).length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="text-lg">Loading files...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col gap-2">
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

      {/* Uploads progress */}
      <div className="px-4">
        {Object.values(state.uploads).map((upload) => (
          <div key={upload.id} className="pb-4">
            <div className="pb-1 text-sm font-medium text-muted-foreground">
              {upload.fileName}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-full overflow-hidden rounded-full border border-accent bg-muted/20">
                <div
                  className="h-3 rounded-full bg-accent transition-all duration-500"
                  style={{
                    width: `${(upload.uploadedParts / upload.totalParts) * 100}%`
                  }}
                ></div>
              </div>
              {!upload.aborted && upload.uploadedParts < upload.totalParts && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => {
                    abortMultipartUpload(upload.id)
                  }}
                >
                  <X className="text-destructive" />
                </Button>
              )}
            </div>

            <div className="mt-1 text-xs text-muted-foreground">
              {upload.uploadedParts} / {upload.totalParts} parts uploaded
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="flex w-64 flex-col overflow-hidden rounded-l-2xl border border-r-0 border-muted/40">
          <div className="border-b border-muted/40 p-4">
            <div className="text-2xl font-medium text-sidebar-foreground">
              Data
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
            />
          </div>
        </div>

        {/* Main Panel */}
        <div
          className="flex flex-1 flex-col overflow-hidden rounded-r-2xl border border-muted/40"
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
