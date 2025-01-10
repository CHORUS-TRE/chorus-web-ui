'use client'

import {
  ALBERT_WORKSPACE_ID,
  useAppState
} from '@/components/store/app-state-context'

import { Workspace } from '~/components/workspace'

const HomePage = () => {
  const { error } = useAppState()

  return (
    <>
      <div>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <Workspace workspaceId={ALBERT_WORKSPACE_ID} />
      </div>
      <footer>{/* Footer content */}</footer>
    </>
  )
}

export default HomePage

export const dynamic = 'auto'
export const dynamicParams = true
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5
