'use client'

import { useEffect, useState } from 'react'
import { CirclePlus, TriangleAlert } from 'lucide-react'
import { useFormState, useFormStatus } from 'react-dom'

import {
  workbenchCreate,
  workbenchDelete
} from '@/components/actions/workbench-view-model'
import {
  Dialog as DialogContainer,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger
} from '@/components/ui/dialog'

import { Button } from '~/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { App } from '~/domain/model'

import { appList } from '../actions/app-view-model'
import { IFormState } from '../actions/utils'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Textarea } from '../ui/textarea'

const initialState: IFormState = {
  data: undefined,
  error: undefined,
  issues: undefined
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="ml-auto" type="submit" disabled={pending}>
      Start
    </Button>
  )
}

function DeleteButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" aria-disabled={pending}>
      Delete
    </Button>
  )
}

export function WorkbenchCreateForm({
  workspaceId,
  userId,
  cb
}: {
  workspaceId?: string
  userId?: string
  cb?: (id: string) => void
}) {
  const [state, formAction] = useFormState(
    workbenchCreate,
    initialState,
    '/workspaces/8'
  )
  const [open, setOpen] = useState(false)
  const [apps, setApps] = useState<App[]>([])
  const [error, setError] = useState<string>()

  useEffect(() => {
    appList().then((res) => {
      if (res.error) {
        setError(res.error)
        return
      }

      if (!res.data) {
        setError('There is no apps available')
        return
      }

      setApps(res.data)
    })
  }, [])

  useEffect(() => {
    if (state?.error) {
      return
    }

    if (state?.data) {
      setOpen(false)
      if (cb) cb(state?.data as string)
    }
  }, [state])

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CirclePlus className="h-3.5 w-3.5" />
          Start new app
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription asChild>
            <form action={formAction}>
              <Card className="w-full max-w-md border-none bg-background text-white">
                <CardHeader>
                  <CardTitle>Start App</CardTitle>
                  <CardDescription>
                    Fill out the form to start a new app.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {error && (
                    <Alert variant="destructive">
                      <TriangleAlert className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid gap-2">
                    {/* <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeho lder="Enter workbench name" /> */}
                    <div className="grid gap-3">
                      <Label htmlFor="name">Name</Label>
                      <select
                        name="id"
                        id="id"
                        className="bg-background text-white"
                      >
                        <option value="">Choose an app</option>
                        {apps.map((app) => (
                          <option key={app.id} value={app.name}>
                            {app.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-xs text-red-500">
                      {
                        state?.issues?.find((e) => e.path.includes('id'))
                          ?.message
                      }
                    </div>
                  </div>
                  <div className="grid hidden gap-2">
                    <Label htmlFor="name">Workspace</Label>
                    <Input
                      id="workspaceId"
                      name="workspaceId"
                      placeholder="Enter workspace name"
                      defaultValue={workspaceId || ''}
                    />
                    <div className="text-xs text-red-500">
                      {
                        state?.issues?.find((e) =>
                          e.path.includes('workspaceId')
                        )?.message
                      }
                    </div>
                  </div>
                  <div className="grid hidden gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter description"
                      className="min-h-[100px]"
                    />
                    <div className="text-xs text-red-500">
                      {
                        state?.issues?.find((e) =>
                          e.path.includes('description')
                        )?.message
                      }
                    </div>
                  </div>
                  <div className="grid hidden gap-2">
                    <Label htmlFor="ownerId">Owner ID</Label>
                    <Input
                      id="ownerId"
                      name="ownerId"
                      placeholder="Enter owner ID"
                      defaultValue={userId || '2'}
                    />
                    <div className="text-xs text-red-500">
                      {
                        state?.issues?.find((e) => e.path.includes('ownerId'))
                          ?.message
                      }
                    </div>
                  </div>
                  <div className="grid hidden gap-2">
                    <Label htmlFor="memberIds">Member IDs</Label>
                    <Textarea
                      id="memberIds"
                      name="memberIds"
                      placeholder="Enter member IDs separated by commas"
                      className="min-h-[100px]"
                    />
                    <div className="text-xs text-red-500">
                      {
                        state?.issues?.find((e) => e.path.includes('memberIds'))
                          ?.message
                      }
                    </div>
                  </div>
                  <div className="grid hidden gap-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      name="tags"
                      placeholder="Enter tags separated by commas"
                    />
                    <div className="text-xs text-red-500">
                      {
                        state?.issues?.find((e) => e.path.includes('tags'))
                          ?.message
                      }
                    </div>
                  </div>
                  <div className="hidden gap-2">
                    <Label htmlFor="tenantId">Tenant ID</Label>
                    <Input
                      id="tenantId"
                      name="tenantId"
                      placeholder="Enter tenant ID"
                      defaultValue={1}
                    />
                    <div className="text-xs text-red-500">
                      {
                        state?.issues?.find((e) => e.path.includes('tenantId'))
                          ?.message
                      }
                    </div>
                  </div>
                  <p aria-live="polite" className="sr-only" role="status">
                    {JSON.stringify(state?.data)}
                  </p>
                  {state?.error && (
                    <p className="text-red-500">{state.error}</p>
                  )}
                </CardContent>
                <CardFooter>
                  <SubmitButton />
                </CardFooter>
              </Card>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </DialogContainer>
  )
}

export function WorksbenchDeleteForm({ id }: { id?: string }) {
  const [state, formAction] = useFormState(workbenchDelete, initialState)

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <DeleteButton />
      <p aria-live="polite" className="sr-only" role="status">
        {JSON.stringify(state?.data, null, 2)}
      </p>
    </form>
  )
}
