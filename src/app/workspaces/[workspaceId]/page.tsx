'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Workspace } from '@/components/workspace'
import { Workspace as WorkspaceType } from '@/domain/model'
import { workspaceGetViewModel } from './workspace-get-view-model'

const WorkspacePage = () => {
  const params = useParams()
  const [workspace, setWorkspace] = useState<WorkspaceType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const workspaceId = params?.workspaceId as string
    if (!workspaceId) return
    try {
      workspaceGetViewModel(workspaceId)
        .then((response) => {
          if (response?.error) setError(response.error.message)
          if (response?.data) setWorkspace(response.data)
        })
        .catch((error) => {
          setError(error.message)
        })
    } catch (error: any) {
      setError(error.message)
    }
  }, [params])

  return (
    <div className="workspace-page">
      <main>
        {error && <p>{error}</p>}
        <Workspace workspace={workspace} />
      </main>
      <footer>{/* Footer content */}</footer>
    </div>
  )
}

export default WorkspacePage

// export const dynamic = 'auto'
// export const dynamicParams = true
// export const revalidate = false
// export const fetchCache = 'auto'
// export const runtime = 'nodejs'
// export const preferredRegion = 'auto'
// export const maxDuration = 5
