'use client'

import { Suspense, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { workbenchList } from '@/components/actions/workbench-view-model'
import { workspaceGet } from '@/components/actions/workspace-view-model'
import { Workspace as WorkspaceType } from '@/domain/model'

import { Workspace } from '~/components/workspace'
import { Workbench } from '~/domain/model/workbench'

import WorkspaceHeader from '../header'

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
      <WorkspaceHeader />
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

      <footer>{/* Footer content */}</footer>
    </>
  )
}

export default WorkspacePage

export const dynamic = 'auto'
export const dynamicParams = true
// export const revalidate = 'false'
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5
