'use client'

import { ChevronDown, ChevronUp, Upload } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/button'
import { UploadProgress } from '@/components/file-manager/upload-progress'
import { useFileSystem } from '@/hooks/use-file-system'
import { useAppStateStore } from '@/stores/app-state-store'

export function UploadPanel() {
  const [expanded, setExpanded] = useState(true)
  const uploads = useAppStateStore((state) => state.uploads)
  const workspaces = useAppStateStore((state) => state.workspaces)
  const { cancelMultipartUpload } = useFileSystem()

  const getWorkspaceName = (workspaceId: string) =>
    workspaces?.find((w) => w.id === workspaceId)?.name ?? workspaceId

  const activeUploads = Object.values(uploads ?? {}).filter((u) => !u.cancelled)

  if (activeUploads.length === 0) {
    return null
  }

  const totalProgress =
    activeUploads.reduce((acc, u) => acc + u.uploadedBytes, 0) /
    activeUploads.reduce((acc, u) => acc + u.fileSize, 0)

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 overflow-hidden rounded-lg border border-border bg-background shadow-lg">
      <div
        className="group flex cursor-pointer items-center justify-between gap-2 border-b border-border bg-muted/50 px-3 py-2"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <Upload className="h-4 w-4" />
          <span>
            Uploading {activeUploads.length} file
            {activeUploads.length > 1 ? 's' : ''}
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
