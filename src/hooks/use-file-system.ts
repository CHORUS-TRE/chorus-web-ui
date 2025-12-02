import { previousDay } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'

import { toast } from '~/components/hooks/use-toast'
import { WorkspaceFilePart } from '~/domain/model/workspace-file'
import type { FileSystemItem, FileSystemState } from '~/types/file-system'
import { mapWorkspaceFilesToFileSystem } from '~/utils/file-system-mapper'
import {
  workspaceFileAbortUpload,
  workspaceFileCompleteUpload,
  workspaceFileCreate,
  workspaceFileDelete,
  workspaceFileGet,
  workspaceFileInitUpload,
  workspaceFileList,
  workspaceFileUpdate,
  workspaceFileUploadPart
} from '~/view-model/workspace-file-view-model'

const IMPORT_FILE_SIZE_THRESHOLD = 5 * 1024 * 1024 // 5MB

const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2
}

// Helper function to read chunk of file content
const readFileChunk = (
  file: File,
  start: number,
  end: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject

    const blob = file.slice(start, end)
    reader.readAsDataURL(blob)
  })
}

// Helper function to read file content
const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Always return base64 content for consistency
      // Remove data URL prefix for base64 content
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject

    // Always use readAsDataURL to get base64 content
    reader.readAsDataURL(file)
  })
}

// Helper function for retry logic with exponential backoff
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  retries = RETRY_CONFIG.maxRetries,
  delay = RETRY_CONFIG.initialDelay
): Promise<T> => {
  try {
    return await fn()
  } catch (error) {
    if (retries === 0) {
      throw error
    }

    console.warn(`Retrying after ${delay}ms... (${retries} attempts left)`)
    await new Promise((resolve) => setTimeout(resolve, delay))

    const nextDelay = Math.min(
      delay * RETRY_CONFIG.backoffFactor,
      RETRY_CONFIG.maxDelay
    )

    return retryWithBackoff(fn, retries - 1, nextDelay)
  }
}

export function useFileSystem(workspaceId?: string) {
  const [state, setState] = useState<FileSystemState>({
    items: {},
    uploads: {},
    selectedItems: [],
    currentFolderId: 'root',
    viewMode: 'list'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetchedPaths, setFetchedPaths] = useState<Set<string>>(new Set())

  const fetchWorkspaceFiles = useCallback(
    async (workspaceId: string, path: string, force = false) => {
      // Check if we already fetched this path
      if (!force && fetchedPaths.has(path)) {
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Add trailing slash for folder paths
        const apiPath = path && !path.endsWith('/') ? `${path}/` : path
        const result = await workspaceFileList(workspaceId, apiPath)

        if (result.error) {
          setError(result.error)
          return
        }

        if (result.data) {
          const fileSystemItems = mapWorkspaceFilesToFileSystem(result.data)

          setState((prev) => {
            const newState = {
              ...prev,
              items: { ...prev.items, ...fileSystemItems }
            }

            return newState
          })

          // Mark this path as fetched
          setFetchedPaths((prev) => new Set(Array.from(prev).concat(path)))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch files')
      } finally {
        setLoading(false)
      }
    },
    [fetchedPaths]
  )

  // Fetch workspace files on mount and when workspaceId changes
  useEffect(() => {
    if (workspaceId) {
      fetchWorkspaceFiles(workspaceId, '')
    }
  }, [workspaceId, fetchWorkspaceFiles])

  const getChildren = useCallback(
    (parentId: string | null): FileSystemItem[] => {
      let items = Object.values(state.items).filter(
        (item) => item.parentId === parentId
      )

      // Apply search filter if search query exists
      if (searchQuery.trim()) {
        items = items.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      return items.sort((a, b) => {
        // Folders first, then files
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1
        }
        return a.name.localeCompare(b.name)
      })
    },
    [state.items, searchQuery]
  )

  const selectItem = useCallback((itemId: string, multiSelect = false) => {
    setState((prev) => ({
      ...prev,
      selectedItems: multiSelect
        ? prev.selectedItems.includes(itemId)
          ? prev.selectedItems.filter((id) => id !== itemId)
          : [...prev.selectedItems, itemId]
        : [itemId]
    }))
  }, [])

  const navigateToFolder = useCallback(
    (folderId: string) => {
      setState((prev) => ({
        ...prev,
        currentFolderId: folderId,
        selectedItems: []
      }))

      // Fetch files for the new folder if workspaceId is available
      if (workspaceId) {
        if (folderId === 'root') {
          // Navigate to root - don't fetch again if already fetched
        } else {
          const folder = state.items[folderId]
          if (folder) {
            fetchWorkspaceFiles(workspaceId, folder.path)
          }
        }
      }
    },
    [workspaceId, state.items, fetchWorkspaceFiles]
  )

  const moveItem = useCallback(
    async (itemId: string, newParentId: string) => {
      if (!workspaceId) {
        console.error('No workspace ID provided for item move')
        return
      }

      const item = state.items[itemId]
      const newParent = state.items[newParentId]

      if (!item) {
        console.error('Item not found:', itemId)
        return
      }

      if (!newParent || newParent.type !== 'folder') {
        console.error('Invalid destination folder:', newParentId)
        return
      }

      try {
        // Calculate new path based on the new parent folder
        const newParentPath = newParent.path || ''
        const newPath = newParentPath
          ? item.type === 'folder'
            ? `${newParentPath}/${item.name}/`
            : `${newParentPath}/${item.name}`
          : item.type === 'folder'
            ? `${item.name}/`
            : item.name

        const result = await workspaceFileUpdate(workspaceId, item.path, {
          name: item.name,
          path: newPath,
          isDirectory: item.type === 'folder'
        })

        if (result.error) {
          setError(result.error)
          return
        }

        // Update local state
        setState((prev) => ({
          ...prev,
          items: {
            ...prev.items,
            [itemId]: {
              ...prev.items[itemId],
              parentId: newParentId,
              path: newPath
            }
          }
        }))

        // Refresh both the old and new parent folders
        const currentFolder = state.items[state.currentFolderId || 'root']
        const currentPath = currentFolder?.path || ''

        // Force fetch updated folder contents
        await fetchWorkspaceFiles(workspaceId, currentPath, true)
        if (newParentPath !== currentPath) {
          await fetchWorkspaceFiles(workspaceId, newParentPath, true)
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to move item'
        console.error('Error moving item:', errorMessage)
        setError(errorMessage)
      }
    },
    [workspaceId, state.items, state.currentFolderId, fetchWorkspaceFiles]
  )

  const deleteItem = useCallback(
    async (itemId: string) => {
      if (!workspaceId) {
        console.error('No workspace ID provided for item deletion')
        return
      }

      const item = state.items[itemId]
      if (!item) {
        console.error('Item not found:', itemId)
        return
      }

      try {
        const result = await workspaceFileDelete(workspaceId, item.path)

        if (result.error) {
          console.error('Failed to delete item:', result.error)
          setError(result.error)
          return
        }

        // Update local state to remove the item and its children
        setState((prev) => {
          const newItems = { ...prev.items }

          // Recursively delete children if it's a folder
          const deleteRecursive = (id: string) => {
            const children = Object.values(newItems).filter(
              (childItem) => childItem.parentId === id
            )
            children.forEach((child) => deleteRecursive(child.id))
            delete newItems[id]
          }

          deleteRecursive(itemId)

          return {
            ...prev,
            items: newItems,
            selectedItems: prev.selectedItems.filter((id) => id !== itemId)
          }
        })

        // Force fetch updated folder contents
        const currentFolder = state.items[state.currentFolderId || 'root']
        const currentPath = currentFolder?.path || ''
        await fetchWorkspaceFiles(workspaceId, currentPath, true)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete item'
        console.error('Error deleting item:', errorMessage)
        setError(errorMessage)
      }
    },
    [workspaceId, state.items, state.currentFolderId, fetchWorkspaceFiles]
  )

  const renameItem = useCallback(
    async (itemId: string, newName: string) => {
      if (!workspaceId) {
        console.error('No workspace ID provided for item rename')
        return
      }

      const item = state.items[itemId]
      if (!item) {
        console.error('Item not found:', itemId)
        return
      }

      try {
        // Calculate new path based on the item's current path and new name
        const pathParts = item.path.split('/')
        if (item.type === 'folder') {
          // For folders, replace the last non-empty part (folder name)
          pathParts[pathParts.length - 2] = newName
        } else {
          // For files, replace the filename
          pathParts[pathParts.length - 1] = newName
        }
        const newPath = pathParts.join('/')

        const result = await workspaceFileUpdate(workspaceId, item.path, {
          name: newName,
          path: newPath,
          isDirectory: item.type === 'folder'
        })

        if (result.error) {
          console.error('Failed to rename item:', result.error)
          setError(result.error)
          return
        }

        // Update local state
        setState((prev) => ({
          ...prev,
          items: {
            ...prev.items,
            [itemId]: {
              ...prev.items[itemId],
              name: newName,
              path: newPath
            }
          }
        }))

        // Refresh the current folder to sync with backend
        const currentFolder = state.items[state.currentFolderId || 'root']
        const currentPath = currentFolder?.path || ''

        // Force fetch updated folder contents
        await fetchWorkspaceFiles(workspaceId, currentPath, true)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to rename item'
        console.error('Error renaming item:', errorMessage)
        setError(errorMessage)
      }
    },
    [workspaceId, state.items, state.currentFolderId, fetchWorkspaceFiles]
  )

  const createFolder = useCallback(
    async (parentId: string, name: string) => {
      if (!workspaceId) {
        console.error('No workspace ID provided for folder creation')
        return
      }

      const parentItem = state.items[parentId]
      const parentPath = parentItem?.path || ''
      const newPath = parentPath ? `${parentPath}/${name}/` : `${name}/`

      try {
        const result = await workspaceFileCreate(workspaceId, {
          name,
          path: newPath,
          isDirectory: true,
          content: ''
        })

        if (result.error) {
          console.error('Failed to create folder:', result.error)
          setError(result.error)
          return
        }

        if (result.data) {
          // Refresh the current folder to show the new folder
          const currentFolder = state.items[state.currentFolderId || 'root']
          const currentPath = currentFolder?.path || ''

          // Force fetch updated folder contents
          await fetchWorkspaceFiles(workspaceId, currentPath, true)
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create folder'
        console.error('Error creating folder:', errorMessage)
        setError(errorMessage)
      }
    },
    [workspaceId, state.items, state.currentFolderId, fetchWorkspaceFiles]
  )

  const importFile = useCallback(
    async (parentId: string, file: File) => {
      if (!workspaceId) {
        console.error('No workspace ID provided for file import')
        return
      }

      const parentItem = state.items[parentId]
      const parentPath = parentItem?.path || ''
      const filePath = parentPath ? `${parentPath}/${file.name}` : file.name

      toast({
        title: 'Uploading file...',
        description: `Uploading ${file.name}`,
        variant: 'default'
      })

      try {
        if (file.size > IMPORT_FILE_SIZE_THRESHOLD) {
          console.info('Using multipart upload for file:', file.name, file.size)
          await importFileMultipart(file, filePath)
        } else {
          console.info('Using direct upload for file:', file.name, file.size)
          await importFileDirect(file, filePath)
        }

        // Refresh the current folder to show the new file
        const currentFolder = state.items[state.currentFolderId || 'root']
        const currentPath = currentFolder?.path || filePath
        await fetchWorkspaceFiles(workspaceId, currentPath, true)

        toast({
          title: 'File uploaded',
          description: `${file.name} has been uploaded successfully`,
          variant: 'default'
        })
      } catch (err) {
        console.error('Error importing file:', err)
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to import file'
        setError(errorMessage)
        toast({
          title: 'File upload failed',
          description: errorMessage,
          variant: 'destructive'
        })
      }
    },
    [workspaceId, state.items, state.currentFolderId, fetchWorkspaceFiles]
  )

  const importFileDirect = useCallback(
    async (file: File, filePath: string) => {
      if (!workspaceId) {
        throw new Error('No workspace ID provided for file import')
      }

      const content = await readFileContent(file)
      const result = await workspaceFileCreate(workspaceId, {
        name: file.name,
        path: filePath,
        isDirectory: false,
        mimeType: file.type,
        size: file.size.toString(),
        content
      })

      if (result.error) {
        throw new Error(result.error)
      }
    },
    [workspaceId]
  )

  const importFileMultipart = useCallback(
    async (file: File, filePath: string) => {
      if (!workspaceId) {
        throw new Error('No workspace ID provided for file import')
      }

      // Initiate multipart upload
      try {
        const initResult = await workspaceFileInitUpload(
          workspaceId,
          filePath,
          {
            name: file.name,
            path: filePath,
            isDirectory: false,
            mimeType: file.type,
            size: file.size.toString()
          }
        )

        if (initResult.error) {
          throw new Error(
            'Failed to initiate multipart upload: ' + initResult.error
          )
        }

        if (!initResult.data) {
          throw new Error('No data returned from multipart upload initiation')
        }

        const uploadId = initResult.data.uploadId
        const chunkSize = initResult.data.partSize
        const totalChunks = initResult.data.totalParts

        // Update local state
        setState((prev) => ({
          ...prev,
          uploads: {
            ...prev.uploads,
            [uploadId]: {
              id: uploadId,
              filePath: filePath,
              fileName: file.name,
              fileSize: file.size,
              partSize: chunkSize,
              totalParts: totalChunks,
              uploadedParts: 0,
              aborted: false
            }
          }
        }))

        const uploadedParts: Array<WorkspaceFilePart> = []

        // Upload chunks sequentially
        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
          // Check for abort
          let isAborted = false
          setState((prev) => {
            isAborted = prev.uploads[uploadId]?.aborted || false
            return prev
          })
          if (isAborted) {
            throw new Error('Upload aborted by user')
          }

          const start = chunkIndex * chunkSize
          const end = Math.min(start + chunkSize, file.size)
          const chunkContent = await readFileChunk(file, start, end)

          const partResult = await retryWithBackoff(() =>
            workspaceFileUploadPart(workspaceId, filePath, uploadId, {
              partNumber: (chunkIndex + 1).toString(),
              data: chunkContent
            })
          )

          if (partResult.error) {
            throw new Error(
              `Failed to upload part ${chunkIndex + 1}: ${partResult.error}`
            )
          }

          if (!partResult.data) {
            throw new Error(
              `No data returned from uploading part ${chunkIndex + 1}`
            )
          }

          uploadedParts.push({
            partNumber: (chunkIndex + 1).toString(),
            etag: partResult.data.etag
          })

          // Update local state
          setState((prev) => ({
            ...prev,
            uploads: {
              ...prev.uploads,
              [uploadId]: {
                ...prev.uploads[uploadId],
                uploadedParts: chunkIndex + 1
              }
            }
          }))
        }

        // Check for abort before completing upload
        let isAborted = false
        setState((prev) => {
          isAborted = prev.uploads[uploadId]?.aborted || false
          return prev
        })
        if (isAborted) {
          throw new Error('Upload aborted by user')
        }

        // Complete multipart upload
        const completeResult = await retryWithBackoff(() =>
          workspaceFileCompleteUpload(
            workspaceId,
            filePath,
            uploadId,
            uploadedParts
          )
        )

        if (completeResult.error) {
          throw new Error(
            'Failed to complete multipart upload: ' + completeResult.error
          )
        }
      } catch (err) {
        throw err
      }
    },
    [
      workspaceId,
      state.items,
      state.currentFolderId,
      state.uploads,
      fetchWorkspaceFiles
    ]
  )

  const abortMultipartUpload = useCallback(
    async (uploadId: string) => {
      if (!workspaceId) {
        console.error('No workspace ID provided for aborting upload')
        return
      }

      const uploadItem = state.uploads[uploadId]
      if (!uploadItem) {
        console.error('Upload item not found:', uploadId)
        return
      }

      // Update local state
      setState((prev) => ({
        ...prev,
        uploads: {
          ...prev.uploads,
          [uploadId]: {
            ...prev.uploads[uploadId],
            aborted: true
          }
        }
      }))

      try {
        const result = await workspaceFileAbortUpload(
          workspaceId,
          uploadItem.filePath,
          uploadId
        )

        if (result.error) {
          console.error('Failed to abort multipart upload:', result.error)
          setError(result.error)
          return
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to abort upload'
        console.error('Error aborting upload:', errorMessage)
        setError(errorMessage)
      }
    },
    [workspaceId, state.uploads]
  )

  const toggleViewMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      viewMode: prev.viewMode === 'list' ? 'grid' : 'list'
    }))
  }, [])

  const clearSelection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedItems: []
    }))
  }, [])

  const setSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const downloadFile = useCallback(
    async (itemId: string) => {
      if (!workspaceId) {
        console.error('No workspace ID provided for file download')
        return
      }

      const item = state.items[itemId]
      if (!item || item.type !== 'file') {
        console.error('Item not found or is not a file:', itemId)
        return
      }

      try {
        const result = await workspaceFileGet(workspaceId, item.path)

        if (result.error) {
          console.error('Failed to download file:', result.error)
          setError(result.error)
          return
        }

        if (result.data) {
          // Create download link
          let blob: Blob
          const content = result.data.content

          if (content) {
            // All content is now base64 encoded
            const binaryContent = atob(content)
            const bytes = new Uint8Array(binaryContent.length)
            for (let i = 0; i < binaryContent.length; i++) {
              bytes[i] = binaryContent.charCodeAt(i)
            }
            blob = new Blob([bytes], {
              type: result.data.mimeType || 'application/octet-stream'
            })

            // Trigger download
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = item.name
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to download file'
        console.error('Error downloading file:', errorMessage)
        setError(errorMessage)
      }
    },
    [workspaceId, state.items]
  )

  const fetchFolderContents = useCallback(
    async (folderId: string) => {
      if (!workspaceId) {
        console.error('No workspace ID provided for folder fetch')
        return
      }

      const folder = state.items[folderId]
      if (!folder || folder.type !== 'folder') {
        console.error('Invalid folder or folder not found:', folderId)
        return
      }

      try {
        // Use the existing fetchWorkspaceFiles with force=true to bypass cache
        await fetchWorkspaceFiles(workspaceId, folder.path, true)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch folder contents'
        console.error('fetchFolderContents: Error:', errorMessage)
        setError(errorMessage)
      }
    },
    [workspaceId, state.items, fetchWorkspaceFiles]
  )

  return {
    state,
    loading,
    error,
    searchQuery,
    getChildren,
    selectItem,
    navigateToFolder,
    moveItem,
    deleteItem,
    renameItem,
    createFolder,
    importFile,
    importFileMultipart,
    abortMultipartUpload,
    downloadFile,
    setSearch,
    toggleViewMode,
    clearSelection,
    fetchFolderContents,
    refresh: () => workspaceId && fetchWorkspaceFiles(workspaceId, '')
  }
}
