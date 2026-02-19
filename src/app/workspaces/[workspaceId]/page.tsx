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
