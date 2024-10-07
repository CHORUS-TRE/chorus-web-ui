'use client'

import { ReactNode, useEffect, useState } from 'react'
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

const WorkspaceHeader = () => {
  const [workspace, setWorkspace] = useState<WorkspaceType>()
  const [error, setError] = useState<string>()
  const params = useParams<{ workspaceId: string; appId: string }>()
  const workspaceId = params?.workspaceId

  useEffect(() => {
    if (!workspaceId) return

    workspaceGet(workspaceId)
      .then((response) => {
        if (response?.error) setError(response.error)
        if (response?.data) setWorkspace(response.data)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [])

  // const fetchWorkspace = async () => {
  //   if (!params?.workspaceId) return

  //   return await workspaceGet(params.workspaceId)
  // }

  // function WSH() {
  //   const response = use(fetchWorkspace())
  //   return <WorkspaceHeader workspace={response?.data} />
  // }

  // function WS() {
  //   const response = use(fetchWorkspace())
  //   return <Workspace workspace={response?.data} workbenches={workbenches}/>
  // }

  return (
    <>
      <div className="mb-6 flex items-center justify-between border-b border-muted pb-2">
        <h2 className="mt-5 text-muted">
          <span className="font-semibold text-white">
            {workspace?.shortName}
          </span>
        </h2>
        <Link
          href="#"
          className="text-muted hover:bg-transparent hover:text-accent"
        >
          <Button size="icon" className="overflow-hidden" variant="ghost">
            <Settings />
          </Button>
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
// export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5
