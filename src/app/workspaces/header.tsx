'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Settings } from 'lucide-react'

import { workspaceGet } from '@/components/actions/workspace-view-model'
import { Workspace as WorkspaceType } from '@/domain/model'

import NavLink from '~/components/nav-link'
import { Button } from '~/components/ui/button'

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
      <div className="mb-4 flex items-start justify-between border-b pb-2">
        <h1
          className="mt-5 scroll-m-20
        pr-1 text-3xl font-semibold tracking-tight text-background first:mt-0"
        >
          Welcome to {workspace?.shortName}
        </h1>
        <Link href="#" className="text-accent hover:text-accent-foreground">
          <Button
            size="icon"
            className="overflow-hidden rounded-full"
            variant="ghost"
          >
            <Settings />
          </Button>
        </Link>{' '}
      </div>

      <nav className="mb-4 inline-flex h-10 flex-col items-center justify-start gap-6 rounded-md bg-white px-4 text-lg font-medium text-muted md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <NavLink
          href={`/workspaces/${params?.workspaceId}`}
          exact
          className="text-muted hover:border-b-2 hover:border-accent [&.active]:border-b-2 [&.active]:border-accent"
        >
          Dashboard
        </NavLink>
        <NavLink
          href={`/workspaces/${params?.workspaceId}/apps`}
          exact
          className="text-muted hover:border-b-2 hover:border-accent [&.active]:border-b-2 [&.active]:border-accent"
        >
          Apps
        </NavLink>

        <NavLink
          href={`#`}
          exact
          className="text-muted hover:border-b-2 hover:border-accent [&.active]:border-b-2 [&.active]:border-accent"
        >
          Data
        </NavLink>

        <NavLink
          href={`#`}
          exact
          className="text-muted hover:border-b-2 hover:border-accent [&.active]:border-b-2 [&.active]:border-accent"
        >
          Resources
        </NavLink>

        <NavLink
          href={`#`}
          exact
          className="text-muted hover:border-b-2 hover:border-accent [&.active]:border-b-2 [&.active]:border-accent"
        >
          Team
        </NavLink>

        <NavLink
          href={`#`}
          exact
          className="text-muted hover:border-b-2 hover:border-accent [&.active]:border-b-2 [&.active]:border-accent"
        >
          Wiki
        </NavLink>

        <NavLink
          href={`#`}
          exact
          className="text-muted hover:border-b-2 hover:border-accent [&.active]:border-b-2 [&.active]:border-accent"
        >
          Activities
        </NavLink>

        <NavLink
          href={`#`}
          exact
          className="text-muted hover:border-b-2 hover:border-accent [&.active]:border-b-2 [&.active]:border-accent"
        >
          Footprint
        </NavLink>
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
