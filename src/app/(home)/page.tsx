'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { LayoutGrid, Rows3 } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Workbench, Workspace as WorkspaceType } from '@/domain/model'

import { userMe } from '~/components/actions/user-view-model'
import { workbenchList } from '~/components/actions/workbench-view-model'
import { workspaceList } from '~/components/actions/workspace-view-model'
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
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="w-full">
        <h3 className="mb-3 text-muted">Workspaces</h3>
        <Tabs defaultValue="all" className="">
          <div className="mb-4 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="archived" className="hidden sm:flex">
                Archived
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center justify-end gap-0">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted hover:bg-inherit hover:text-accent"
                onClick={() => setShowGrid(true)}
                id="grid-button"
              >
                <LayoutGrid />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted hover:bg-inherit hover:text-accent"
                onClick={() => setShowGrid(false)}
                id="table-button"
              >
                <Rows3 />
              </Button>
            </div>
          </div>
          <TabsContent value="all">
            {!showGrid && <WorkspaceTable />}
            {showGrid && (
              <div
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                id="grid"
              >
                {workspaces?.map((workspace) => (
                  <Link key={workspace.id} href={`/workspaces/${workspace.id}`}>
                    <Card
                      className="flex h-full flex-col justify-between rounded-2xl border-none bg-background text-white transition duration-300 hover:scale-105 hover:shadow-lg"
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

        <div className="align-center mt-4 flex w-full justify-between">
          <h2 className="text-background"></h2>
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
    </>
  )
}
