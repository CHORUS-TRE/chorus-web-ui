'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Settings } from 'lucide-react'

import { workbenchList } from '@/components/actions/workbench-view-model'
import { workspaceGet } from '@/components/actions/workspace-view-model'
import { Workspace as WorkspaceType } from '@/domain/model'

import DashboardWidgets from '~/components/dashboard-widgets'
import { Button } from '~/components/ui/button'
import { Workspace } from '~/components/workspace'
import { Workbench } from '~/domain/model/workbench'

const WorkspacePage = () => {
  const [workspace, setWorkspace] = useState<WorkspaceType>()
  const [workbenches, setWorkbenches] = useState<Workbench[]>()
  const [error, setError] = useState<string>()
  const params = useParams<{ workspaceId: string; appId: string }>()
  const workspaceId = params?.workspaceId
  const workbenchId = params?.appId

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

    workbenchList()
      .then((response) => {
        if (response?.error) setError(response.error)
        if (response?.data)
          setWorkbenches(
            response.data?.filter((w) => w.workspaceId === workspaceId)
          )
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
        text-3xl font-semibold tracking-tight text-background first:mt-0"
        >
          Welcome to {workspace?.name}
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
      <div className="flex w-full items-start justify-between gap-8">
        <div>
          {error && <p className="mt-4 text-red-500">{error}</p>}
          <Suspense
            fallback={
              <div className="w-full text-xs text-white">
                Loading workspace...
              </div>
            }
          >
            <Workspace workspace={workspace} workbenches={workbenches} />
          </Suspense>
        </div>

        <aside className="flex flex-row items-start gap-4">
          <DashboardWidgets />
        </aside>
      </div>

      <footer>{/* Footer content */}</footer>
    </>
  )
}

export default WorkspacePage

// export const dynamic = 'auto'
// export const dynamicParams = true
// export const revalidate = false
// export const fetchCache = 'auto'
// export const runtime = 'nodejs'
// export const preferredRegion = 'auto'
// export const maxDuration = 5
