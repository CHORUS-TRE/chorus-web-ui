'use client'

import { useAppState } from '@/components/store/app-state-context'

import { MyWorkspace } from '~/components/my-workspace'

const HomePage = () => {
  const { error } = useAppState()

  return (
    <>
      <div>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <MyWorkspace />
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
