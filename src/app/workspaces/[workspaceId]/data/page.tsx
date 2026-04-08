'use client'

import { useParams } from 'next/navigation'

import FileManagerClient from './file-manager-client'

export default function FileManager() {
  const { workspaceId } = useParams<{ workspaceId: string }>()

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-muted-foreground">
            Workspace Data
          </h1>
          <p className="mb-8 text-muted-foreground">Manage your data</p>
        </div>
      </div>

      <FileManagerClient workspaceId={workspaceId} />
    </div>
  )
}
