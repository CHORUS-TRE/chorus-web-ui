'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ArrowRight, LayoutGrid, Rows3, Settings } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Workbench, Workspace as WorkspaceType } from '@/domain/model'

import { userMe } from '~/components/actions/user-view-model'
import { workbenchList } from '~/components/actions/workbench-view-model'
import { workspaceList } from '~/components/actions/workspace-view-model'
import { Button as ThemedButton } from '~/components/button'
import { WorkspaceCreateForm } from '~/components/forms/workspace-forms'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import WorkspaceTable from '~/components/workspace-table'

export default function Portal() {
  const [showGrid, setShowGrid] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [workspaces, setWorkspaces] = useState<WorkspaceType[] | null>(null)
  const [workbenches, setWorkbenches] = useState<Workbench[]>()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      workspaceList()
        .then((response) => {
          if (response?.error) setError(response.error)
          if (response?.data) setWorkspaces(response.data)
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

      userMe().then((response) => {
        if (response?.error) setError(response.error)
        if (response?.data) setUser(response.data)
      })
    } catch (error) {
      setError(error.message)
    }
  }, [])

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="mt-5 text-white">Welcome home</h2>
        <Link href="#" className="mt-5 cursor-default text-muted">
          <Settings />
        </Link>
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="w-full">
        <div className="flex items-center justify-between">
          <h3 className="mb-3 mr-8 flex-grow text-muted">Workspaces</h3>
          <div className="mb-4 flex justify-end">
            <WorkspaceCreateForm
              userId={user?.id}
              cb={() => {
                workspaceList()
                  .then((response) => {
                    if (response?.error) setError(response.error)
                    if (response?.data) setWorkspaces(response.data)
                  })
                  .catch((error) => {
                    setError(error.message)
                  })
              }}
            />
          </div>
        </div>
        <Tabs defaultValue="all" className="">
          <div className="mb-4 grid grid-flow-col grid-rows-1 gap-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger
                disabled
                value="active"
                className="cursor-default hover:border-b-transparent"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                disabled
                value="archived"
                className="hidden cursor-default hover:border-b-transparent sm:flex"
              >
                Archived
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center justify-end gap-0">
              <Button
                variant="ghost"
                size="sm"
                className={`border border-transparent text-muted hover:bg-inherit hover:text-accent ${showGrid ? 'border-accent' : ''}`}
                onClick={() => setShowGrid(true)}
                id="grid-button"
                disabled={showGrid}
              >
                <LayoutGrid />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`border border-transparent text-muted hover:bg-inherit hover:text-accent ${!showGrid ? 'border-accent' : ''}`}
                onClick={() => setShowGrid(false)}
                id="table-button"
                disabled={!showGrid}
              >
                <Rows3 />
              </Button>
            </div>
          </div>
          <TabsContent value="all" className="border-none">
            {!showGrid && (
              <WorkspaceTable
                cb={() => {
                  workspaceList()
                    .then((response) => {
                      if (response?.error) setError(response.error)
                      if (response?.data) setWorkspaces(response.data)
                    })
                    .catch((error) => {
                      setError(error.message)
                    })
                }}
              />
            )}
            {showGrid && (
              <div
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                id="grid"
              >
                {workspaces?.map((workspace) => (
                  <Link key={workspace.id} href={`/workspaces/${workspace.id}`}>
                    <Card
                      className="flex h-full flex-col justify-between rounded-2xl border-secondary bg-background text-white transition duration-300 hover:border-accent hover:shadow-lg"
                      key={workspace.id}
                    >
                      <CardHeader className="">
                        <CardTitle>{workspace.shortName}</CardTitle>
                        <CardDescription>
                          {workspace.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          {
                            workbenches?.filter(
                              (w) => w.workspaceId === workspace.id
                            )?.length
                          }{' '}
                          apps running
                        </p>
                        <p>
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs">
                          Updated {formatDistanceToNow(workspace.updatedAt)} ago
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="active"></TabsContent>
          <TabsContent value="archived"></TabsContent>
        </Tabs>
      </div>
    </>
  )
}
