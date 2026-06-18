'use client'

import { ChevronDown, ChevronUp, FolderUp, Upload, X } from 'lucide-react'
import { useState } from 'react'

import { UploadProgress } from '@/components/file-manager/upload-progress'
import { Button } from '@/components/ui/button'
import { useFileSystem } from '@/hooks/use-file-system'
import { useAppStateStore } from '@/stores/app-state-store'

export function UploadPanel() {
  const [expanded, setExpanded] = useState(true)
  const uploads = useAppStateStore((state) => state.uploads)
  const folderBatches = useAppStateStore((state) => state.folderBatches)
  const workspaces = useAppStateStore((state) => state.workspaces)
  const { cancelMultipartUpload, cancelFolderUpload } = useFileSystem()

  const getWorkspaceName = (workspaceId: string) =>
    workspaces?.find((w) => w.id === workspaceId)?.name ?? workspaceId

  const activeUploads = Object.values(uploads ?? {}).filter((u) => !u.cancelled)
  const activeBatches = Object.values(folderBatches ?? {}).filter(
    (b) => !b.cancelled
  )

  if (activeUploads.length === 0 && activeBatches.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 overflow-hidden rounded-lg border border-border bg-background shadow-lg">
      <div
        className="group flex cursor-pointer items-center justify-between gap-2 border-b border-border bg-muted/50 px-3 py-2"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <Upload className="h-4 w-4" />
          <span>
            {activeBatches.length > 0
              ? `Uploading ${activeBatches.length} folder${activeBatches.length > 1 ? 's' : ''}`
              : `Uploading ${activeUploads.length} file${activeUploads.length > 1 ? 's' : ''}`}
          </span>
        </div>
        <Button variant="ghost" size="sm" className="h-auto p-0.5">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          )}
        </Button>
      </div>

      {expanded && (
        <div className="max-h-60 overflow-y-auto px-3 pt-3">
          {activeBatches.map((batch) => {
            const percentage =
              batch.totalFiles > 0
                ? ((batch.completedFiles + batch.failedFiles) /
                    batch.totalFiles) *
                  100
                : 0

            return (
              <div key={batch.id} className="pb-3">
                <div className="flex items-center justify-between gap-2 pb-1.5">
                  <div className="flex items-center gap-1.5 truncate text-sm font-medium text-sidebar-foreground">
                    <FolderUp className="h-3.5 w-3.5 shrink-0" />
                    {batch.folderName}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {batch.completedFiles}/{batch.totalFiles}
                    </span>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0"
                      onClick={() => cancelFolderUpload(batch.id)}
                    >
                      <X className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full border border-muted bg-muted/20">
                  <div
                    className="h-full rounded-full bg-muted transition-all duration-500"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                {batch.failedFiles > 0 && (
                  <div className="mt-1 text-xs text-destructive">
                    {batch.failedFiles} file
                    {batch.failedFiles > 1 ? 's' : ''} failed
                  </div>
                )}
              </div>
            )
          })}

          {activeUploads.map((upload) => {
            const dir = upload.filePath.includes('/')
              ? upload.filePath.substring(0, upload.filePath.lastIndexOf('/'))
              : '/'

            return (
              <div key={upload.id}>
                <div className="mb-1 truncate text-xs text-muted-foreground">
                  {getWorkspaceName(upload.workspaceId)} &middot; {dir}
                </div>
                <UploadProgress
                  upload={upload}
                  onUploadCancel={cancelMultipartUpload}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
