'use client'

import { ReactNode } from 'react'

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

const WorkspaceMenu = ({ id }: { id: string }) => {
  return (
    <div className="nav-link mb-6 flex h-10 flex-wrap items-center justify-start gap-2 sm:flex-nowrap md:gap-6">
      <StyledNavLink href={`/`}>Dashboard</StyledNavLink>
      <StyledNavLink href={`/workspaces/${id}/desktops`}>
        Desktops
      </StyledNavLink>
      <StyledNavLink href={`/workspaces/${id}/workspaces`}>
        Your Workspaces
      </StyledNavLink>
      <StyledNavLink disabled href={`#`}>
        Data
      </StyledNavLink>
      <StyledNavLink disabled href={`#`}>
        Resources
      </StyledNavLink>
      <StyledNavLink disabled href={`#`}>
        Activities
      </StyledNavLink>
      <StyledNavLink disabled href={`#`}>
        Footprint
      </StyledNavLink>
    </div>
  )
}

export default WorkspaceMenu

export const dynamic = 'auto'
export const dynamicParams = true
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5
