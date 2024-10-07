'use server'

import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { formatDistanceToNow } from 'date-fns'
import { LayoutGrid, Rows3 } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu'

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
import { Icons } from '~/components/ui/icons'
import WorkspaceTable from '~/components/workspace-table'

import placeholder from '/public/placeholder.svg'

export default async function Portal() {
  const workbenches = await workbenchList()
  const workspaces = await workspaceList()
  const user = await userMe()

  return (
    <>
      <div className="mb-6 flex items-center justify-between border-b border-muted pb-2">
        <h2 className="mt-5 text-white">Welcome home</h2>
      </div>
      {workbenches.error && (
        <p className="mt-4 text-red-500">{workbenches.error}</p>
      )}

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
            <div className="flex items-center gap-4">
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-none text-primary"
                  id="grid-button"
                >
                  <LayoutGrid />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-4 bg-none text-accent"
                  id="table-button"
                >
                  <Rows3 />
                </Button>
              </div>
            </div>
          </div>
          <TabsContent value="all">
            <div className="hidden" id="table">
              <WorkspaceTable />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" id="grid">
              {workspaces?.data?.map((workspace) => (
                <Link key={workspace.id} href={`/workspaces/${workspace.id}`}>
                  <Card
                    className="flex h-full flex-col justify-between rounded-2xl border-none bg-background text-white transition duration-300 hover:scale-105 hover:bg-accent hover:text-black hover:shadow-lg"
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
          </TabsContent>
          <TabsContent value="active"></TabsContent>
          <TabsContent value="archived"></TabsContent>
        </Tabs>

        <div className="align-center mt-4 flex w-full justify-between">
          <h2 className="text-background"></h2>
          <WorkspaceCreateForm userId={user.data?.id} />
        </div>
      </div>

      {/* <div className="mb-16 w-full">
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
      </div> */}

      <Script id="homepage-grid-swicther">
        {`
        gridButton = document.getElementById('grid-button');
        tableButton = document.getElementById('table-button');
        grid = document.getElementById('grid')
        table = document.getElementById('table')

        gridButton.addEventListener('click', () => {
          grid.style.display = 'grid';
          table.style.display = 'none';

          gridButton.classList.add('text-primary');
          gridButton.classList.remove('text-accent');

          tableButton.classList.remove('text-primary');
          tableButton.classList.add('text-accent');
        })

        tableButton.addEventListener('click', () => {
          table.style.display = 'block';
          grid.style.display = 'none';

          tableButton.classList.add('text-primary');
          tableButton.classList.remove('text-accent');

          gridButton.classList.add('text-accent');
          gridButton.classList.remove('text-primary');
        })
    `}
      </Script>
    </>
  )
}
