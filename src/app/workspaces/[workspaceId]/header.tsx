'use client'

import { ReactNode, Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Settings } from 'lucide-react'

import { Workspace as WorkspaceType } from '@/domain/model'

import { workspaceGet } from '~/components/actions/workspace-view-model'
import NavLink from '~/components/nav-link'
import { Button } from '~/components/ui/button'

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
        <Link href="#" className="mt-5 cursor-default text-muted">
          <Settings />
        </Link>
      </div>

      <div className="nav-link mb-6 flex h-10 flex-wrap items-center justify-start gap-2 sm:flex-nowrap md:gap-6">
        <StyledNavLink href={`/workspaces/${params?.workspaceId}`}>
          Dashboard
        </StyledNavLink>
        <StyledNavLink href={`/workspaces/${params?.workspaceId}/desktops`}>
          Desktops
        </StyledNavLink>
        <StyledNavLink disabled href={`#`}>
          Data
        </StyledNavLink>
        <StyledNavLink disabled href={`#`}>
          Resources
        </StyledNavLink>
        <StyledNavLink disabled href={`#`}>
          Team
        </StyledNavLink>
        <StyledNavLink disabled href={`#`}>
          Wiki
        </StyledNavLink>
        <StyledNavLink disabled href={`#`}>
          Activities
        </StyledNavLink>
        <StyledNavLink disabled href={`#`}>
          Footprint
        </StyledNavLink>
      </div>
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
