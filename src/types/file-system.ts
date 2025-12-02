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
  filePath: string
  fileName: string
  fileSize: number
  partSize: number
  totalParts: number
  uploadedParts: number
  aborted: boolean
}

export interface FileSystemState {
  items: Record<string, FileSystemItem>
  uploads: Record<string, FileSystemUploadItem>
  selectedItems: string[]
  currentFolderId: string | null
  viewMode: 'list' | 'grid'
}
