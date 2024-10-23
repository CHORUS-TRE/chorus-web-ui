'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { CircleX } from 'lucide-react'

import { workbenchGet } from '@/components/actions/workbench-view-model'
import { WorksbenchDeleteForm } from '@/components/forms/workbench-forms'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { Button } from '~/components/button'
import { useNavigation } from '~/components/store/navigation-context'
import { Workbench } from '~/domain/model'

export default function WorkbenchPreferencesPage() {
  const [error, setError] = useState<string | null>(null)
  const [workbench, setWorkbench] = useState<Workbench | null>(null)
  const [deleted, setDeleted] = useState<boolean>(false)

  const router = useRouter()
  const params = useParams<{ workspaceId: string; appId: string }>()
  const { setBackground } = useNavigation()

  const workspaceId = params?.workspaceId
  const workbenchId = params?.appId

  useEffect(() => {
    if (!workbenchId) return

    workbenchGet(workbenchId)
      .then((response) => {
        if (response?.error) setError(response.error)
        if (response?.data) setWorkbench(response?.data)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [workbenchId])

  return (
    <div>
      {deleted && (
        <Alert className="absolute bottom-2 right-2 z-10 w-96 bg-white text-black">
          <AlertTitle>Success !</AlertTitle>
          <AlertDescription>
            Workbench was deleted, redirecting to workspace...
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert className="absolute bottom-2 right-2 z-10 w-96 bg-white text-black">
          <AlertTitle>Error ! </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="mb-6 flex items-center justify-between pb-2">
        <h2 className="mt-5 text-muted">
          <span className="font-semibold text-white">{workbench?.name}</span>
        </h2>
        <Link
          href={`/workspaces/${workspaceId}/${workbenchId}`}
          className="mt-5 text-muted hover:bg-transparent hover:text-accent"
        >
          <Button>
            <CircleX />
          </Button>
        </Link>{' '}
      </div>

      <h3 className="text-white">Preferences</h3>

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
      <div className="mt-4 flex flex-col items-start justify-between gap-4">
        <WorksbenchDeleteForm
          id={params.appId}
          cb={() => {
            setDeleted(true)
            setTimeout(() => {
              setBackground(undefined)
              router.replace(`/workspaces/${workspaceId}`)
            }, 2000)
          }}
        />
      </div>
    </div>
  )
}
