'use client'

import { useParams } from 'next/navigation'

import FileManagerClient from './file-manager-client'

export default function FileManager() {
  const { workspaceId } = useParams<{ workspaceId: string }>()

  return (
    <div className="flex h-full flex-col overflow-hidden p-6">
      <FileManagerClient workspaceId={workspaceId} />
    </div>
  )
}
