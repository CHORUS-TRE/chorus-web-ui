'use server'

import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { userMe } from '~/components/actions/user-view-model'
import { workbenchList } from '~/components/actions/workbench-view-model'
import { workspaceList } from '~/components/actions/workspace-view-model'
import { WorkspaceCreateForm } from '~/components/forms/workspace-forms'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'

import placeholder from '/public/placeholder.svg'

export default async function Portal() {
  const workbenches = await workbenchList()
  const workspaces = await workspaceList()
  const user = await userMe()

  return (
    <>
      <div className="mb-8 flex items-start justify-between border-b pb-2">
        <h1
          className="mt-5 scroll-m-20
        text-background first:mt-0"
        >
          Welcome home
        </h1>
      </div>
      {workbenches.error && (
        <p className="mt-4 text-red-500">{workbenches.error}</p>
      )}

      <div className="mb-16 w-full ">
        <div className="align-center mb-2 flex w-full justify-between">
          <h2 className="text-background">Workspaces</h2>
          <WorkspaceCreateForm userId={user.data?.id} />
        </div>

        <Tabs defaultValue="all" className="mb-4">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="yours">Yours</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workspaces?.data?.map((workspace) => (
            <Link key={workspace.id} href={`/workspaces/${workspace.id}`}>
              <Card
                className="flex h-full flex-col justify-between rounded-xl border-none hover:bg-accent hover:shadow-lg"
                key={workspace.id}
              >
                <CardHeader className="">
                  <CardTitle>{workspace.shortName}</CardTitle>
                  <CardDescription>{workspace.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {
                      workbenches?.data?.filter(
                        (w) => w.workspaceId === workspace.id
                      )?.length
                    }{' '}
                    apps running
                  </p>
                  <p>
                    {user.data?.firstName} {user.data?.lastName}
                  </p>
                  <p className="text-xs">
                    Updated {formatDistanceToNow(workspace.updatedAt)} ago
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-16 w-full">
        <h2 className="mb-2 text-xl  text-background">
          Getting started with CHORUS
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <Link href="#">
              <div className="relative max-w-xs overflow-hidden bg-cover bg-no-repeat">
                <Image
                  src={placeholder}
                  alt="Placeholder user"
                  className="aspect-video"
                />
                <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-accent bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-60"></div>
              </div>
            </Link>
            <CardHeader>
              <CardTitle>Getting started</CardTitle>
              <CardDescription>Get started with your research.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <Link href="#">
              <div className="relative max-w-xs overflow-hidden bg-cover bg-no-repeat">
                <Image
                  src={placeholder}
                  alt="Placeholder user"
                  className="aspect-video"
                />
                <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-accent bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-60"></div>
              </div>
            </Link>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Learn more about the platform.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <Link href="#">
              <div className="relative max-w-xs overflow-hidden bg-cover bg-no-repeat">
                <Image
                  src={placeholder}
                  alt="Placeholder user"
                  className="aspect-video"
                />
                <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-accent bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-60"></div>
              </div>
            </Link>
            <CardHeader>
              <CardTitle>Footprint</CardTitle>
              <CardDescription>Your environmental impact.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <Link href="#">
              <div className="relative max-w-xs overflow-hidden bg-cover bg-no-repeat">
                <Image
                  src={placeholder}
                  alt="Placeholder user"
                  className="aspect-video"
                />
                <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-accent bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-60"></div>
              </div>
            </Link>
            <CardHeader>
              <CardTitle>Poll</CardTitle>
              <CardDescription>
                What would you like to see in the next release?
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  )
}
