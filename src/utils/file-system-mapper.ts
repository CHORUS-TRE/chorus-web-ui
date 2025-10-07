import type { WorkspaceFile } from '~/domain/model/workspace-file'
import type { FileSystemItem } from '~/types/file-system'

/**
 * Maps WorkspaceFile[] to hierarchical FileSystemItem structure
 * Converts flat file paths to parent-child relationships
 */
export function mapWorkspaceFilesToFileSystem(
  workspaceFiles: WorkspaceFile[],
  owner: string = 'System'
): Record<string, FileSystemItem> {
  const items: Record<string, FileSystemItem> = {}

  // Create root folder
  const rootId = 'root'
  items[rootId] = {
    id: rootId,
    name: 'My data',
    type: 'folder',
    parentId: null,
    path: '',
    modifiedAt: new Date(),
    owner
  }

  // Process each file/folder
  for (const file of workspaceFiles) {
    console.log('Processing file:', file.path, file.name, file.isDirectory)

    // Handle different path formats from API
    let normalizedPath = file.path

    // If path doesn't contain the filename and we have a name, construct the full path
    if (!file.path.includes(file.name)) {
      normalizedPath = file.path.endsWith('/')
        ? `${file.path}${file.name}`
        : `${file.path}/${file.name}`
    }

    // For directories, ensure trailing slash
    if (file.isDirectory && !normalizedPath.endsWith('/')) {
      normalizedPath = `${normalizedPath}/`
    }

    console.log('Normalized path:', normalizedPath)

    const pathParts = normalizedPath.split('/').filter(Boolean)

    // Create folder hierarchy
    let currentPath = ''
    let parentId = rootId

    for (let i = 0; i < pathParts.length; i++) {
      const pathPart = pathParts[i]
      currentPath = currentPath ? `${currentPath}/${pathPart}` : pathPart

      // Generate ID based on path
      const itemId = generateIdFromPath(currentPath)

      // Check if this is the last part (the actual file/folder)
      const isLastPart = i === pathParts.length - 1

      if (!items[itemId]) {
        items[itemId] = {
          id: itemId,
          name: pathPart,
          type: isLastPart ? (file.isDirectory ? 'folder' : 'file') : 'folder',
          parentId: parentId,
          path: currentPath,
          modifiedAt: file.updatedAt || file.createdAt,
          owner,
          size:
            isLastPart && !file.isDirectory
              ? parseInt(file.size || '0')
              : undefined,
          extension:
            isLastPart && !file.isDirectory
              ? getFileExtension(pathPart)
              : undefined
        }
        console.log('Created item:', items[itemId])
      }

      parentId = itemId
    }
  }

  return items
}

/**
 * Generate a consistent ID from file path
 */
function generateIdFromPath(path: string): string {
  // Use path as ID, but replace slashes and special characters
  return path.replace(/[^a-zA-Z0-9]/g, '_')
}

/**
 * Extract file extension from filename
 */
function getFileExtension(filename: string): string | undefined {
  const parts = filename.split('.')
  return parts.length > 1 ? parts[parts.length - 1] : undefined
}
