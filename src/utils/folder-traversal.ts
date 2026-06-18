const JUNK_FILES = new Set([
  'Thumbs.db',
  'desktop.ini',
  '.DS_Store',
  'Icon\r',
  'ehthumbs.db',
  'ehthumbs_vista.db'
])

const JUNK_DIRS = new Set([
  '__MACOSX',
  '.Spotlight-V100',
  '.Trashes',
  '.fseventsd',
  '.TemporaryItems'
])

export interface FolderFile {
  relativePath: string
  file: File
}

export interface FolderTraversalResult {
  files: FolderFile[]
  directories: string[]
  rootFolderName: string
  totalSize: number
  filteredCount: number
}

function isHiddenOrJunk(name: string, isDirectory: boolean): boolean {
  if (name.startsWith('.')) return true
  if (isDirectory) return JUNK_DIRS.has(name)
  return JUNK_FILES.has(name)
}

function isAnySegmentHiddenOrJunk(parts: string[]): boolean {
  for (let i = 0; i < parts.length; i++) {
    const isDir = i < parts.length - 1
    if (isHiddenOrJunk(parts[i], isDir)) return true
  }
  return false
}

export function traverseFileInput(files: FileList): FolderTraversalResult {
  const resultFiles: FolderFile[] = []
  const dirSet = new Set<string>()
  let rootFolderName = ''
  let totalSize = 0
  let filteredCount = 0

  for (const file of Array.from(files)) {
    const relativePath = (file as File & { webkitRelativePath: string })
      .webkitRelativePath
    if (!relativePath) continue

    const parts = relativePath.split('/')

    if (!rootFolderName && parts.length > 0) {
      rootFolderName = parts[0]
    }

    if (isAnySegmentHiddenOrJunk(parts)) {
      filteredCount++
      continue
    }

    for (let i = 1; i < parts.length; i++) {
      dirSet.add(parts.slice(0, i).join('/'))
    }

    resultFiles.push({ relativePath, file })
    totalSize += file.size
  }

  return {
    files: resultFiles,
    directories: Array.from(dirSet).sort(),
    rootFolderName,
    totalSize,
    filteredCount
  }
}

function readAllEntries(
  reader: FileSystemDirectoryReader
): Promise<FileSystemEntry[]> {
  return new Promise((resolve, reject) => {
    const entries: FileSystemEntry[] = []
    const readBatch = () => {
      reader.readEntries((batch) => {
        if (batch.length === 0) {
          resolve(entries)
        } else {
          entries.push(...batch)
          readBatch()
        }
      }, reject)
    }
    readBatch()
  })
}

function getFile(fileEntry: FileSystemFileEntry): Promise<File> {
  return new Promise((resolve, reject) => {
    fileEntry.file(resolve, reject)
  })
}

async function traverseEntry(
  entry: FileSystemEntry,
  parentPath: string
): Promise<{ files: FolderFile[]; dirs: string[] }> {
  const name = entry.name
  const isDir = entry.isDirectory

  if (isHiddenOrJunk(name, isDir)) {
    return { files: [], dirs: [] }
  }

  if (entry.isFile) {
    const file = await getFile(entry as FileSystemFileEntry)
    return {
      files: [{ relativePath: parentPath + name, file }],
      dirs: []
    }
  }

  const dirEntry = entry as FileSystemDirectoryEntry
  const reader = dirEntry.createReader()
  const children = await readAllEntries(reader)
  const dirPath = parentPath + name + '/'

  const allFiles: FolderFile[] = []
  const allDirs: string[] = [parentPath + name]

  for (const child of children) {
    const result = await traverseEntry(child, dirPath)
    allFiles.push(...result.files)
    allDirs.push(...result.dirs)
  }

  return { files: allFiles, dirs: allDirs }
}

export async function traverseDroppedEntry(
  entry: FileSystemEntry
): Promise<FolderTraversalResult> {
  const result = await traverseEntry(entry, '')

  let totalSize = 0
  for (const f of result.files) {
    totalSize += f.file.size
  }

  return {
    files: result.files,
    directories: result.dirs.sort(),
    rootFolderName: entry.name,
    totalSize,
    filteredCount: 0
  }
}

export function hasDroppedFolders(dataTransfer: DataTransfer): boolean {
  if (!dataTransfer.items) return false
  for (const item of Array.from(dataTransfer.items)) {
    const entry = item.webkitGetAsEntry?.()
    if (entry?.isDirectory) return true
  }
  return false
}

export function replaceRootFolder(
  relativePath: string,
  originalRoot: string,
  newRoot: string
): string {
  if (originalRoot === newRoot) return relativePath
  return newRoot + relativePath.slice(originalRoot.length)
}
