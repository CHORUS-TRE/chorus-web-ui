'use client'

import { CirclePlus, Database, Send } from 'lucide-react'
import { useState } from 'react'

import { Button } from '~/components/button'
import { ActionBar } from '~/components/file-manager/action-bar'
import { Breadcrumb } from '~/components/file-manager/breadcrumb'
import { DataRequestsPanel } from '~/components/file-manager/data-requests-panel'
import { FileGrid } from '~/components/file-manager/file-grid'
import { FileTree } from '~/components/file-manager/file-tree'
import { SelectionBasket } from '~/components/file-manager/selection-basket'
import { Toolbar } from '~/components/file-manager/toolbar'
import { UploadProgress } from '~/components/file-manager/upload-progress'
import { Badge } from '~/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { useFileSystem } from '~/hooks/use-file-system'
import type { DataMovementRequest } from '~/types/data-requests'
import type { FileSystemItem } from '~/types/file-system'

interface FileManagerClientProps {
  workspaceId: string
}

// Mock data for demonstration
const MOCK_REQUESTS: DataMovementRequest[] = [
  {
    id: 'req-1',
    type: 'download',
    status: 'pending',
    requestedBy: {
      id: 'current-user',
      name: 'Current User',
      email: 'user@example.com'
    },
    requestedAt: new Date(),
    files: [
      {
        snapshotId: 's1',
        originalFileId: 'f1',
        path: '/data/genomics_results.csv',
        name: 'genomics_results.csv',
        size: 15.4 * 1024 * 1024,
        mimeType: 'text/csv',
        checksum: 'sha256-abc',
        createdAt: new Date()
      }
    ],
    totalSize: 15.4 * 1024 * 1024,
    justification: 'Exporting results for publication draft.'
  },
  {
    id: 'req-2',
    type: 'transfer',
    status: 'approved',
    requestedBy: {
      id: 'current-user',
      name: 'Current User',
      email: 'user@example.com'
    },
    requestedAt: new Date(Date.now() - 172800000),
    files: [
      {
        snapshotId: 's2',
        originalFileId: 'f2',
        path: '/models/brain_scan_v2.weights',
        name: 'brain_scan_v2.weights',
        size: 450 * 1024 * 1024,
        mimeType: 'application/octet-stream',
        checksum: 'sha256-def',
        createdAt: new Date()
      }
    ],
    totalSize: 450 * 1024 * 1024,
    justification: 'Transferring processed model to collaborative workspace.',
    targetWorkspaceId: 'collab-neuro-2024',
    reviewedBy: { id: 'admin-1', name: 'System Admin' },
    reviewedAt: new Date(Date.now() - 86400000),
    reviewNotes: 'Approved for cross-workspace collaboration.'
  },
  {
    id: 'req-3',
    type: 'download',
    status: 'pending',
    requestedBy: {
      id: 'user-2',
      name: 'Alice Smith',
      email: 'alice@example.com'
    },
    requestedAt: new Date(Date.now() - 3600000),
    files: [
      {
        snapshotId: 's3',
        originalFileId: 'f3',
        path: '/raw/patient_data_restricted.zip',
        name: 'patient_data_restricted.zip',
        size: 1.2 * 1024 * 1024 * 1024,
        mimeType: 'application/zip',
        checksum: 'sha256-ghi',
        createdAt: new Date()
      }
    ],
    totalSize: 1.2 * 1024 * 1024 * 1024,
    justification: 'Clinical validation on local air-gapped machine.'
  }
]

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
  const [activeView, setActiveView] = useState<'files' | 'requests'>('files')

  const rootChildren = getChildren('root')
  const currentChildren = getChildren(state.currentFolderId)

  // Mapping selected IDs to items for SelectionBasket
  const selectedFiles = state.selectedItems
    .map((id) => state.items[id])
    .filter((item) => item && item.type === 'file')

  const handleRemoveFromBasket = (itemId: string) => {
    selectItem(itemId, true) // Toggle off
  }

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

  const handleDownloadRequest = (
    items: FileSystemItem[],
    justification: string
  ) => {
    console.log('Download request:', items, justification)
    // In a real app, this would call an API
    alert(`Download request submitted for ${items.length} items.`)
    clearSelection()
  }

  const handleTransferRequest = (
    items: FileSystemItem[],
    target: string,
    justification: string
  ) => {
    console.log('Transfer request:', items, target, justification)
    // In a real app, this would call an API
    alert(`Transfer request submitted for ${items.length} items to ${target}.`)
    clearSelection()
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
    <div className="mt-2 flex h-screen flex-col gap-4">
      {activeView === 'files' && (
        <Toolbar
          viewMode={state.viewMode}
          searchQuery={searchQuery}
          onToggleViewMode={toggleViewMode}
          onCreateFolder={handleCreateFolder}
          onImport={handleImport}
          onSearch={setSearch}
        />
      )}

      {activeView === 'files' && state.selectedItems.length > 0 && (
        <ActionBar
          selectedItems={state.selectedItems}
          onDelete={deleteItem}
          onRename={renameItem}
          onDownload={downloadFile}
          onClearSelection={clearSelection}
          getItemName={getItemName}
        />
      )}

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="flex w-64 flex-col gap-2">
          <Button
            variant={activeView === 'files' ? 'accent-filled' : 'ghost'}
            className="h-12 justify-start gap-3 rounded-xl"
            onClick={() => setActiveView('files')}
          >
            <Database className="h-5 w-5" />
            Data Browser
          </Button>
          <Button
            variant={activeView === 'requests' ? 'accent-filled' : 'ghost'}
            className="h-12 justify-start gap-3 rounded-xl"
            onClick={() => setActiveView('requests')}
          >
            <Send className="h-5 w-5" />
            Data Requests
            <Badge variant="secondary" className="ml-auto">
              {MOCK_REQUESTS.filter((r) => r.status === 'pending').length}
            </Badge>
          </Button>

          <div className="mt-auto space-y-4">
            {activeView === 'files' && selectedFiles.length > 0 && (
              <SelectionBasket
                selectedItems={selectedFiles}
                onRemoveItem={handleRemoveFromBasket}
                onClearSelection={clearSelection}
                onDownloadRequest={handleDownloadRequest}
                onTransferRequest={handleTransferRequest}
              />
            )}

            <div className="w-full">
              {Object.values(state.uploads).map((upload) => (
                <UploadProgress
                  key={upload.id}
                  upload={upload}
                  onUploadCancel={abortMultipartUpload}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {activeView === 'files' ? (
            <div className="card-glass flex flex-1 flex-col overflow-hidden rounded-2xl border border-muted/40 bg-card">
              <div className="flex flex-1 overflow-hidden">
                {/* Folder Tree Sidebar (Nested) */}
                <div className="flex w-64 flex-col overflow-hidden border-r border-muted/40 bg-muted/5">
                  <div className="border-b border-muted/40 p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Directory Tree
                    </span>
                  </div>
                  <div className="flex-1 overflow-auto p-2">
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

                {/* File Browser Panel */}
                <div
                  className="flex flex-1 flex-col overflow-hidden"
                  onClick={handleBackgroundClick}
                >
                  <Breadcrumb
                    currentPath={currentPath}
                    onNavigateToFolder={navigateToFolder}
                  />

                  <div className="flex-1 overflow-auto p-4">
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
            </div>
          ) : (
            <div className="flex-1 overflow-auto pb-8">
              <div className="mb-6">
                <h1 className="text-2xl font-black">
                  Data Governance & Requests
                </h1>
                <p className="text-sm text-muted-foreground">
                  Monitor and manage data egress and cross-workspace transfers.
                </p>
              </div>
              <DataRequestsPanel
                requests={MOCK_REQUESTS}
                currentUser={{
                  id: 'current-user',
                  name: 'Current User',
                  permissions: { approve: true }
                }}
                onRequestAction={(id, action, notes) => {
                  console.log('Action on request:', id, action, notes)
                  alert(`Request ${id} ${action}ed.`)
                }}
              />
            </div>
          )}
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
