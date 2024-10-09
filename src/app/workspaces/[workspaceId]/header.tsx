'use client'

import { ReactNode, Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Settings } from 'lucide-react'

import { Workspace as WorkspaceType } from '@/domain/model'

import { workspaceGet } from '~/components/actions/workspace-view-model'
import NavLink from '~/components/nav-link'
import { Button } from '~/components/ui/button'

function StyledNavLink({
  children,
  href
}: {
  children: ReactNode
  href: string
}) {
  return (
    <NavLink
      href={href}
      exact
      className="border-b-2 border-transparent text-muted hover:border-b-2 hover:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
    >
      {children}
    </NavLink>
  )
}

const WorkspaceHeader = ({
  workspace
}: {
  workspace?: WorkspaceType | null
}) => {
  const params = useParams<{ workspaceId: string; appId: string }>()

  return (
    <>
      <div className="mb-6 flex items-center justify-between pb-2">
        <h2 className="mt-5 text-muted">
          <span className="border-b border-dotted border-muted pb-2 font-semibold text-white">
            <Suspense fallback={<>Loading workspace...</>}>
              {workspace?.shortName}
            </Suspense>
          </span>
        </h2>
        <Link href="#" className="text-muted">
          <Settings />
        </Link>{' '}
      </div>

      <nav className="nav-link mb-6 inline-flex h-10 flex-row items-center justify-start gap-6">
        <StyledNavLink href={`/workspaces/${params?.workspaceId}`}>
          Dashboard
        </StyledNavLink>
        <StyledNavLink href={`/workspaces/${params?.workspaceId}/apps`}>
          Apps
        </StyledNavLink>
        <StyledNavLink href={`#`}>Data</StyledNavLink>
        <StyledNavLink href={`#`}>Resources</StyledNavLink>
        <StyledNavLink href={`#`}>Team</StyledNavLink>
        <StyledNavLink href={`#`}>Wiki</StyledNavLink>
        <StyledNavLink href={`#`}>Activities</StyledNavLink>
        <StyledNavLink href={`#`}>Footprint</StyledNavLink>
      </nav>
    </>
  )
}

export default WorkspaceHeader

export const dynamic = 'auto'
export const dynamicParams = true
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5
