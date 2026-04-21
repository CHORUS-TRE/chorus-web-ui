'use client'

import { useParams } from 'next/navigation'

import FileManagerClient from './file-manager-client'

export default function FileManager() {
  const { workspaceId } = useParams<{ workspaceId: string }>()

  return (
    <div className="flex h-full flex-col overflow-hidden p-6">
      <div className="mb-4">
        <h1 className="text-3xl font-semibold text-muted-foreground">
          Workspace Data
        </h1>
        <p className="text-muted-foreground">Manage your data</p>
      </div>

      <FileManagerClient workspaceId={workspaceId} />
    </div>
  )
}
