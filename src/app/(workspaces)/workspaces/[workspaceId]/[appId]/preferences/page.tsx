'use server'

import Link from 'next/link'
import { CircleX } from 'lucide-react'

import { workbenchGet } from '@/components/actions/workbench-view-model'
import { WorksbenchDeleteForm } from '@/components/forms/workbench-forms'

import { userMe } from '~/components/actions/user-view-model'
import { AppInstanceCreateForm } from '~/components/forms/app-instance-forms'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'

export default async function WorkbenchPage({
  params,
  searchParams
}: {
  params: { appId: string; workspaceId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const workbench = await workbenchGet(params.appId)
  const user = await userMe()

  const workspaceId = params?.workspaceId
  const workbenchId = params?.appId

  return (
    <div>
      <div
        className={`absolute left-0 top-0 z-40 flex h-11 min-w-full items-center justify-end`}
        id="header"
      >
        <Link
          href={`/workspaces/${workspaceId}/${workbenchId}`}
          passHref
          className="text-accent hover:text-accent-foreground"
        >
          <Button
            size="icon"
            className="overflow-hidden rounded-full"
            variant="ghost"
          >
            <CircleX />
          </Button>
        </Link>
      </div>

      <div className="mb-4 flex items-start justify-between border-b pb-2 text-background">
        <h2 className="mt-5 scroll-m-20 first:mt-0">Preferences</h2>
      </div>
      <div className="">
        {/* <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                Open in New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Open in New Window <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Add users</MenubarSubTrigger>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Find</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Search the web</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Find...</MenubarItem>
                  <MenubarItem>Find Next</MenubarItem>
                  <MenubarItem>Find Previous</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem>Cut</MenubarItem>
              <MenubarItem>Copy</MenubarItem>
              <MenubarItem>Paste</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>

              <MenubarItem inset>
                <button id="fsbutton">Toggle Fullscreen</button>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem inset>Hide Sidebar</MenubarItem>
            </MenubarContent>
          </MenubarMenu>

        </Menubar> */}
      </div>
      <Card className="mt-4 h-full w-full border-slate-600 bg-slate-900 bg-opacity-85">
        <CardContent className="h-96">
          <div className="mt-4 w-32 bg-white">
            <WorksbenchDeleteForm id={params.appId} />
          </div>
          <div className="mt-4 w-32 bg-white">
            <AppInstanceCreateForm
              workbenchId={params.appId}
              userId={user.data?.id}
              workspaceId={params.workspaceId}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
