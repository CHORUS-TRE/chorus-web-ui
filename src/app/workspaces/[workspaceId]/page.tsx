'use client'

import { useParams } from 'next/navigation'

import { Workspace } from '~/components/workspace'

const WorkspacePage = () => {
  const params = useParams<{ workspaceId: string; sessionId: string }>()
  const workspaceId = params?.workspaceId

  return (
    <>
      <div>
        <Workspace workspaceId={workspaceId} />
      </div>

      <footer>{/* Footer content */}</footer>
    </>
  )
}

export default WorkspacePage

export const dynamic = 'auto'
export const dynamicParams = true
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5
