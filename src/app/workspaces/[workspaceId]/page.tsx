'use client'

import { useParams } from 'next/navigation'
import { useCallback, useEffect } from 'react'

import { workspaceGet } from '@/components/actions/workspace-view-model'
import { useAppState } from '@/components/store/app-state-context'
import { Workspace } from '~/components/workspace'

const WorkspacePage = () => {
  const { refreshWorkbenches } = useAppState()
  const params = useParams<{ workspaceId: string; desktopId: string }>()
  const workspaceId = params?.workspaceId

  const initializeData = useCallback(async () => {
    try {
      await Promise.all([workspaceGet(workspaceId), refreshWorkbenches()])
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error initializing data:', error.message)
      } else {
        console.error('Error initializing data:', String(error))
      }
    }
  }, [workspaceId, refreshWorkbenches])

  useEffect(() => {
    initializeData()
  }, [initializeData])

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
