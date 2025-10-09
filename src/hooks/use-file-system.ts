import { useCallback, useEffect, useState } from 'react'

import { toast } from '~/components/hooks/use-toast'
import type { FileSystemItem, FileSystemState } from '~/types/file-system'
import { mapWorkspaceFilesToFileSystem } from '~/utils/file-system-mapper'
import {
  workspaceFileCreate,
  workspaceFileDelete,
  workspaceFileGet,
  workspaceFileList,
  workspaceFileUpdate
} from '~/view-model/workspace-file-view-model'

// Helper function to read file content
const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // For text files, return as is; for binary files, return base64
      if (file.type.startsWith('text/') || file.type === 'application/json') {
        resolve(result)
      } else {
        // Remove data URL prefix for base64 content
        const base64 = result.split(',')[1]
        resolve(base64)
      }
    }
    reader.onerror = reject

    // Use appropriate reading method based on file type
    if (file.type.startsWith('text/') || file.type === 'application/json') {
      reader.readAsText(file)
    } else {
      reader.readAsDataURL(file)
    }
  })
}

export function useFileSystem(workspaceId?: string) {
  const [state, setState] = useState<FileSystemState>({
    items: {},
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
        console.log(`Path ${path} already fetched, skipping API call`)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Add trailing slash for folder paths
        const apiPath = path && !path.endsWith('/') ? `${path}/` : path
        console.log(`Fetching workspace files for path: ${apiPath}`)
        const result = await workspaceFileList(workspaceId, apiPath)

        if (result.error) {
          setError(result.error)
          return
        }

        if (result.data) {
          console.log(
            `Received ${result.data.length} files for path: ${apiPath}`
          )
          const fileSystemItems = mapWorkspaceFilesToFileSystem(result.data)

          setState((prev) => {
            const newState = {
              ...prev,
              items: { ...prev.items, ...fileSystemItems }
            }
            console.log('Updated file system state:', {
              totalItems: Object.keys(newState.items).length,
              items: newState.items
            })
            return newState
          })

          // Mark this path as fetched
          setFetchedPaths((prev) => new Set(Array.from(prev).concat(path)))
          console.log('Fetched paths:', Array.from(fetchedPaths).concat(path))
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
      console.log(`Navigating to folder: ${folderId}`)
      setState((prev) => ({
        ...prev,
        currentFolderId: folderId,
        selectedItems: []
      }))

      // Fetch files for the new folder if workspaceId is available
      if (workspaceId) {
        if (folderId === 'root') {
          // Navigate to root - don't fetch again if already fetched
          console.log('Navigating to root folder')
        } else {
          const folder = state.items[folderId]
          if (folder) {
            console.log(`Fetching files for folder: ${folder.path}`)
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

      console.log(
        `Moving ${item.type}: ${item.name} from ${item.path} to folder: ${newParent.path}`
      )

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
          console.error('Failed to move item:', result.error)
          setError(result.error)
          return
        }

        console.log('Item moved successfully:', result.data)

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

      console.log(`Deleting ${item.type}: ${item.name} at path: ${item.path}`)
      console.log('Item details:', item)

      try {
        const result = await workspaceFileDelete(workspaceId, item.path)

        if (result.error) {
          console.error('Failed to delete item:', result.error)
          setError(result.error)
          return
        }

        console.log('Item deleted successfully:', result.data)

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

      console.log(
        `Renaming ${item.type}: ${item.name} to ${newName} at path: ${item.path}`
      )

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

        console.log('Item renamed successfully:', result.data)

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

      console.log(`Creating folder: ${name} at path: ${newPath}`)

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
          console.log('Folder created successfully:', result.data)

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

      console.log(`Importing file: ${file.name} to path: ${filePath}`)

      // Show loading toast
      const loadingToast = toast({
        title: 'Uploading file...',
        description: `Uploading ${file.name}`,
        variant: 'default'
      })

      try {
        // Read file content as base64 or text
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
          console.error('Failed to import file:', result.error)
          setError(result.error)

          // Update toast to show error
          loadingToast.update({
            id: loadingToast.id,
            title: 'Upload failed',
            description: result.error,
            variant: 'destructive'
          })
          return
        }

        if (result.data) {
          console.log('File imported successfully:', result.data)

          // Update toast to show success
          loadingToast.update({
            id: loadingToast.id,
            title: 'File uploaded',
            description: `${file.name} has been uploaded successfully`,
            variant: 'default'
          })

          // Refresh the current folder to show the new file
          const currentFolder = state.items[state.currentFolderId || 'root']
          const currentPath = currentFolder?.path || ''

          // Force fetch updated folder contents
          await fetchWorkspaceFiles(workspaceId, currentPath, true)
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to import file'
        console.error('Error importing file:', errorMessage)
        setError(errorMessage)

        // Update toast to show error
        loadingToast.update({
          id: loadingToast.id,
          title: 'Upload failed',
          description: errorMessage,
          variant: 'destructive'
        })
      }
    },
    [workspaceId, state.items, state.currentFolderId, fetchWorkspaceFiles]
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

      console.log(`Downloading file: ${item.name} from path: ${item.path}`)

      try {
        const result = await workspaceFileGet(workspaceId, item.path)

        if (result.error) {
          console.error('Failed to download file:', result.error)
          setError(result.error)
          return
        }

        if (result.data) {
          console.log('File downloaded successfully:', result.data)

          // Create download link
          let blob: Blob
          const content = result.data.content

          if (content) {
            if (
              result.data.mimeType?.startsWith('text/') ||
              result.data.mimeType === 'application/json'
            ) {
              // Text file - content is plain text
              blob = new Blob([content], {
                type: result.data.mimeType || 'text/plain'
              })
            } else {
              // Binary file - content is base64 encoded
              const binaryContent = atob(content)
              const bytes = new Uint8Array(binaryContent.length)
              for (let i = 0; i < binaryContent.length; i++) {
                bytes[i] = binaryContent.charCodeAt(i)
              }
              blob = new Blob([bytes], {
                type: result.data.mimeType || 'application/octet-stream'
              })
            }

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
    downloadFile,
    setSearch,
    toggleViewMode,
    clearSelection,
    refresh: () => workspaceId && fetchWorkspaceFiles(workspaceId, '')
  }
}
