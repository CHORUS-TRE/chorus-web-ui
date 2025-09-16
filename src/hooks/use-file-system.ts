import { useCallback, useState } from 'react'

import { mockFileSystem } from '~/lib/mock-data'
import type { FileSystemItem, FileSystemState } from '~/types/file-system'

export function useFileSystem() {
  const [state, setState] = useState<FileSystemState>({
    items: mockFileSystem,
    selectedItems: [],
    currentFolderId: 'root',
    viewMode: 'list'
  })

  const getChildren = useCallback(
    (parentId: string | null): FileSystemItem[] => {
      return Object.values(state.items)
        .filter((item) => item.parentId === parentId)
        .sort((a, b) => {
          // Folders first, then files
          if (a.type !== b.type) {
            return a.type === 'folder' ? -1 : 1
          }
          return a.name.localeCompare(b.name)
        })
    },
    [state.items]
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

  const navigateToFolder = useCallback((folderId: string) => {
    setState((prev) => ({
      ...prev,
      currentFolderId: folderId,
      selectedItems: []
    }))
  }, [])

  const moveItem = useCallback((itemId: string, newParentId: string) => {
    setState((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [itemId]: {
          ...prev.items[itemId],
          parentId: newParentId
        }
      }
    }))
  }, [])

  const deleteItem = useCallback((itemId: string) => {
    setState((prev) => {
      const newItems = { ...prev.items }

      // Recursively delete children if it's a folder
      const deleteRecursive = (id: string) => {
        const children = Object.values(newItems).filter(
          (item) => item.parentId === id
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
  }, [])

  const renameItem = useCallback((itemId: string, newName: string) => {
    setState((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [itemId]: {
          ...prev.items[itemId],
          name: newName
        }
      }
    }))
  }, [])

  const createFolder = useCallback((parentId: string, name: string) => {
    const newId = `folder-${Date.now()}`
    setState((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [newId]: {
          id: newId,
          name,
          type: 'folder',
          parentId,
          modifiedAt: new Date(),
          owner: 'You'
        }
      }
    }))
  }, [])

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

  return {
    state,
    getChildren,
    selectItem,
    navigateToFolder,
    moveItem,
    deleteItem,
    renameItem,
    createFolder,
    toggleViewMode,
    clearSelection
  }
}
