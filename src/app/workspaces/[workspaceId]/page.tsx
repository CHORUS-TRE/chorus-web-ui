'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { userGet } from '@/components/actions/user-view-model'
import { workbenchList } from '@/components/actions/workbench-view-model'
import { workspaceGet } from '@/components/actions/workspace-view-model'
import { User, Workspace as WorkspaceType } from '@/domain/model'

import { Workspace } from '~/components/workspace'
import { Workbench } from '~/domain/model/workbench'

const WorkspacePage = () => {
  const [workspace, setWorkspace] = useState<WorkspaceType>()
  const [user, setUser] = useState<User>()
  const [workbenches, setWorkbenches] = useState<Workbench[]>()
  const [error, setError] = useState<string>()

  const router = useRouter()
  const params = useParams<{ workspaceId: string; appId: string }>()
  const workspaceId = params?.workspaceId

  const getWorkbenchList = useCallback(() => {
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
  }, [workspaceId])

  useEffect(() => {
    if (!workspaceId) return

    workspaceGet(workspaceId)
      .then((response) => {
        if (response?.error) setError(response.error)
        if (response?.data) {
          setWorkspace(response.data)
          userGet(response?.data?.ownerId).then((user) => {
            setUser(user.data)
          })
        }
      })
      .catch((error) => {
        setError(error.message)
      })

    getWorkbenchList()
  }, [getWorkbenchList, workspaceId])

  // TODO: react use in not yet ready in NextJS
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
      <div>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <Suspense
          fallback={
            <div className="w-full text-xs text-white">
              Loading workspace...
            </div>
          }
        >
          <Workspace
            workspace={workspace}
            workbenches={workbenches}
            workspaceOwner={user}
            cb={(id) => {
              getWorkbenchList()
              router.push(`/workspaces/${workspaceId}/${id}`)
            }}
          />
        </Suspense>
      </div>

      <footer>{/* Footer content */}</footer>
    </>
  )
}

export default WorkspacePage

export const dynamic = 'auto'
export const dynamicParams = true
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export const maxDuration = 5
