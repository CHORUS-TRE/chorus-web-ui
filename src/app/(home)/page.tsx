'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useAppState } from '@/components/store/app-state-context'
import { useAuth } from '@/components/store/auth-context'

import { MyWorkspace } from '~/components/my-workspace'
import NavLink from '~/components/nav-link'
export function StyledNavLink({
  children,
  href,
  disabled = false
}: {
  children: ReactNode
  href: string
  disabled?: boolean
}) {
  return (
    <NavLink
      href={href}
      exact
      className={`border-b-2 border-transparent text-muted ${!disabled ? 'hover:border-b-2 hover:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white' : 'cursor-default'}`}
    >
      {children}
    </NavLink>
  )
}
const HomePage = () => {
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
