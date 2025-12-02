'use client'

import { X } from 'lucide-react'

import { Button } from '~/components/button'
import { FileSystemUploadItem } from '~/types/file-system'

interface UploadProgressProps {
  upload: FileSystemUploadItem
  onUploadCancel: (uploadId: string) => void
}

interface UploadStats {
  percentage: number
  speed: string
  estimatedTimeRemaining: string
}

const calculateUploadStats = (upload: FileSystemUploadItem): UploadStats => {
  const percentage = (upload.uploadedBytes / upload.fileSize) * 100

  const avgSpeed =
    upload.speeds.length > 0
      ? upload.speeds.reduce((a, b) => a + b, 0) / upload.speeds.length
      : 0

  const formatSpeed = (bytesPerSecond: number): string => {
    if (bytesPerSecond >= 1024 * 1024) {
      return (bytesPerSecond / (1024 * 1024)).toFixed(2) + ' MB/s'
    } else if (bytesPerSecond >= 1024) {
      return (bytesPerSecond / 1024).toFixed(2) + ' KB/s'
    } else {
      return bytesPerSecond.toFixed(2) + ' B/s'
    }
  }

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${Math.ceil(seconds)}s`
    } else if (seconds < 3600) {
      const mins = Math.floor(seconds / 60)
      const secs = Math.ceil(seconds % 60)
      return `${mins}m ${secs}s`
    } else {
      const hours = Math.floor(seconds / 3600)
      const mins = Math.floor((seconds % 3600) / 60)
      return `${hours}h ${mins}m`
    }
  }
  const remainingBytes = upload.fileSize - upload.uploadedBytes
  const estimatedTimeRemaining = avgSpeed > 0 ? remainingBytes / avgSpeed : 0

  return {
    percentage: Math.min(percentage, 100),
    speed: formatSpeed(avgSpeed),
    estimatedTimeRemaining: formatTime(estimatedTimeRemaining)
  }
}

export function UploadProgress({
  upload,
  onUploadCancel
}: UploadProgressProps) {
  const stats = calculateUploadStats(upload)

  return (
    <div key={upload.id} className="pb-3">
      <div className="flex items-center justify-between gap-2 pb-1.5">
        <div className="flex-1 truncate text-sm font-medium text-sidebar-foreground">
          {upload.fileName}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{stats.percentage.toFixed(0)}%</span>
          {!upload.aborted && upload.uploadedParts < upload.totalParts && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={() => onUploadCancel(upload.id)}
            >
              <X className="h-3.5 w-3.5 text-destructive" />
            </Button>
          )}
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full border border-muted bg-muted/20">
        <div
          className="h-full rounded-full bg-muted transition-all duration-500"
          style={{
            width: `${stats.percentage}%`
          }}
        ></div>
      </div>

      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
        <span>{stats.speed}</span>
        {upload.uploadedParts < upload.totalParts && (
          <>
            <span>•</span>
            <span>{stats.estimatedTimeRemaining} remaining</span>
          </>
        )}
      </div>
    </div>
  )
}
