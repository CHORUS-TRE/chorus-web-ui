'use client'

import { useAppState } from '@/components/store/app-state-context'

import { useAuth } from '~/components/store/auth-context'
import { Workspace } from '~/components/workspace'

const HomePage = () => {
  const { error } = useAppState()
  const { user } = useAuth()

  return (
    <div>
      <h2 className="mb-8 mt-5 text-white">Home</h2>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {!user?.workspaceId && (
        <span className="animate-pulse text-muted-foreground">
          Loading workspace...
        </span>
      )}
      {user?.workspaceId && <Workspace workspaceId={user.workspaceId} />}
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
