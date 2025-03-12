'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { userGet } from '@/components/actions/user-view-model'
import { workspaceGet } from '@/components/actions/workspace-view-model'
import { useAppState } from '@/components/store/app-state-context'
import { User, Workspace as WorkspaceType } from '@/domain/model'

import { Workspace } from '~/components/workspace'

const WorkspacePage = () => {
  const { workbenches, refreshWorkbenches } = useAppState()
  const [workspace, setWorkspace] = useState<WorkspaceType>()
  const [user, setUser] = useState<User>()
  const [error, setError] = useState<string>()

  const params = useParams<{ workspaceId: string; desktopId: string }>()
  const workspaceId = params?.workspaceId

  const initializeData = async () => {
    try {
      const [workspaceResponse] = await Promise.all([
        workspaceGet(workspaceId),
        refreshWorkbenches()
      ])

      if (workspaceResponse.error) setError(workspaceResponse.error)
      if (workspaceResponse.data) {
        setWorkspace(workspaceResponse.data)
        const userResponse = await userGet(workspaceResponse.data.ownerId)
        if (userResponse.data) setUser(userResponse.data)
      }
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    initializeData()
  }, [workspaceId])

  const filteredWorkbenches = workbenches?.filter(
    (w) => w.workspaceId === workspaceId
  )

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
