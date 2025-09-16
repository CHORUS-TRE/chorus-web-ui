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

export interface FileSystemState {
  items: Record<string, FileSystemItem>
  selectedItems: string[]
  currentFolderId: string | null
  viewMode: 'list' | 'grid'
}
