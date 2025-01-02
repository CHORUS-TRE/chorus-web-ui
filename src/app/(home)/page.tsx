'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useAppState } from '@/components/store/app-state-context'
import { useAuth } from '@/components/store/auth-context'

import { Workspace } from '~/components/my-workspace'

const WorkspacePage = () => {
  const {
    workbenches,
    error,
    setError,
    refreshWorkbenches,
    myWorkspace,
    refreshMyWorkspace
  } = useAppState()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([refreshMyWorkspace(), refreshWorkbenches()])
      } catch (error) {
        setError(error.message)
      }
    }

    initializeData()
  }, [])

  const filteredWorkbenches = workbenches?.filter(
    (w) => w.workspaceId === myWorkspace?.id
  )

  return (
    <>
      <div className="mb-12 flex items-end justify-between">
        <h2 className="mt-5 text-white">My Workspace</h2>
      </div>
      <div>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <Workspace
          workspace={myWorkspace}
          workbenches={filteredWorkbenches}
          workspaceOwner={user}
          onUpdate={(id) => {
            refreshWorkbenches()
            router.push(`/workspaces/${myWorkspace?.id}/${id}`)
          }}
        />
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
