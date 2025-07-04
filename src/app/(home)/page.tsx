'use client'

import { HomeIcon } from 'lucide-react'

import { useAuth } from '~/components/store/auth-context'
import { Workspace } from '~/components/workspace'

const HomePage = () => {
  const { user } = useAuth()

  return (
    <div className="flex w-full flex-col items-center justify-start">
      <div className="flex w-full flex-grow items-center justify-start">
        <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start text-white">
          <HomeIcon className="h-9 w-9 text-white" />
          My Workspace
        </h2>
      </div>

      <div className="flex flex-col items-center justify-start">
        {!user?.workspaceId && (
          <span className="animate-pulse text-muted">Loading workspace...</span>
        )}
        {user?.workspaceId && <Workspace workspaceId={user?.workspaceId} />}
      </div>
    </div>
  )
}

export default HomePage

export const dynamic = 'auto'
export const dynamicParams = true
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5
