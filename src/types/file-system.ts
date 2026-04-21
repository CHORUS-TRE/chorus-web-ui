export interface FileSystemItem {
  id: string
  name: string
  type: 'file' | 'folder'
  parentId: string | null
  path: string
  size?: number
  modifiedAt: Date
  owner: string
  extension?: string
  children?: FileSystemItem[]
}

export interface FileSystemUploadItem {
  id: string
  workspaceId: string
  filePath: string
  fileName: string
  fileSize: number
  partSize: number
  totalParts: number
  uploadedParts: number
  uploadedBytes: number
  startTime: number
  lastUpdateTime: number
  speeds: number[]
  cancelled: boolean
}

export interface FileClipboard {
  itemIds: string[]
  action: 'copy' | 'cut'
}

export interface FileSystemState {
  items: Record<string, FileSystemItem>
  selectedItems: string[]
  basketItems: string[]
  currentFolderId: string | null
  viewMode: 'list' | 'grid'
  clipboard: FileClipboard | null
}
