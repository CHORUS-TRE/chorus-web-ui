'use client'

import { Workspace as MyWorkspace } from '@/components/my-workspace'
import { Workspace as WorkspaceType } from '@/domain/model'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  workbenchDelete,
  workbenchCreate,
  workbenchList
} from '~/app/workbench-view-model.server'
import {
  workspaceDelete,
  workspaceCreate,
  workspaceList
} from '~/app/workspace-view-model.server'

import { Workbench } from '~/domain/model/workbench'

const WorkspacePage = () => {
  const params = useParams()
  const [workspace, setWorkspace] = useState<WorkspaceType | null>(null)
  const [workspaces, setWorkspaces] = useState<WorkspaceType[] | null>(null)
  const [workbenches, setWorkbenches] = useState<Workbench[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    workspaceList()
      .then((response) => {
        if (response?.error) setError(response.error)
        if (response?.data) setWorkspaces(response.data)
        if (response?.data) setWorkspace(response.data[0]!)
      })
      .catch((error) => {
        setError(error.message)
      })

    workbenchList()
      .then((response) => {
        if (response?.error) setError(response.error)
        if (response?.data) setWorkbenches(response.data)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [])

  const handleCreateButtonClicked = () => {
    workspaceCreate().then((response) => {
      if (response.error) setError(response.error)
      if (response.data) {
        workspaceList()
          .then((response) => {
            if (response?.error) setError(response.error)
            if (response?.data) setWorkspaces(response.data)
          })
          .catch((error) => {
            setError(error.message)
          })
      }
    })
  }

  const handleCreateWorkbenchButtonClicked = () => {
    workbenchCreate(new FormData()).then((response) => {
      if (response.error) setError(response.error)
      if (response.data) {
        workbenchList()
          .then((response) => {
            if (response?.error) setError(response.error)
            if (response?.data) setWorkbenches(response.data)
          })
          .catch((error) => {
            setError(error.message)
          })
      }
    })
  }

  return (
    <div className="workspace-page">
      <main>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <MyWorkspace workspace={workspace} />
        <div className="mx-auto mt-8 grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <div>
            <h1 className="text-2xl font-bold">Your open workbenches</h1>

            <Button
              onClick={handleCreateWorkbenchButtonClicked}
              className="ml-auto mr-4"
            >
              Create Workbench
            </Button>
          </div>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {!workbenches && <div>loading</div>}
              {workbenches?.length === 0 && <div>hey</div>}
              {workbenches?.map((workbench) => (
                <Link
                  href={`/workbenches/${workbench.id}`}
                  key={workbench.id}
                  className="rounded-lg bg-white p-4 shadow-md"
                >
                  <h2 className="text-xl font-bold">{workbench.name}</h2>
                  <p className="text-gray-500">{workbench.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-8 grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <h1 className="text-2xl font-bold">Your collaborative workspaces</h1>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {workspaces?.map((workspace) => (
                <Link
                  href={`/workspaces/${workspace.id}`}
                  key={workspace.id}
                  className="rounded-lg bg-white p-4 shadow-md"
                >
                  <h2 className="text-xl font-bold">{workspace.name}</h2>
                  <p className="text-gray-500">{workspace.description}</p>
                </Link>
              ))}
            </div>
          </div>
          <Button onClick={handleCreateButtonClicked} className="ml-auto mr-4">
            Create Workspace
          </Button>
        </div>
      </main>
      <footer>{/* Footer content */}</footer>
    </div>
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
