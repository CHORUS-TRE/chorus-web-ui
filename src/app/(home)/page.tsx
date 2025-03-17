'use client'

import { HomeIcon } from 'lucide-react'

import { useAuth } from '~/components/store/auth-context'
import { Workspace } from '~/components/workspace'

const HomePage = () => {
  const { user } = useAuth()

  return (
    <div className="flex flex-col items-center justify-start w-full">
      <div className="flex items-center justify-start w-full flex-grow">

        <h2 className="mb-8 mt-5 text-white w-full text-start flex flex-row items-center gap-3">
          <HomeIcon className="h-9 w-9 text-white" />
          Home
        </h2>

      </div>

      <div className="flex flex-col items-center justify-start">
        {!user?.workspaceId && (
          <span className="animate-pulse text-muted-foreground">
            Loading workspace...
          </span>
        )}
        {user?.workspaceId && <Workspace workspaceId={user.workspaceId} />}
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
