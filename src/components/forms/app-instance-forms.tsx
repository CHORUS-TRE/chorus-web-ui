'use client'

import { Loader2 } from 'lucide-react'
import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'

import { appInstanceCreate } from '@/components/actions/app-instance-view-model'
import { useAppState } from '@/components/store/app-state-context'
import {
  Dialog as DialogContainer,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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

import { IFormState } from '../actions/utils'
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
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Starting...' : 'Start'}
    </Button>
  )
}

export function AppInstanceCreateForm({
  state: [open, setOpen],
  workspaceId,
  workbenchId,
  userId,
  onUpdate
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  workspaceId?: string
  workbenchId?: string
  userId?: string
  onUpdate?: () => void
}) {
  const [state, formAction] = useActionState(appInstanceCreate, initialState)
  const { setNotification } = useAppState()
  const { apps } = useAppState()

  useEffect(() => {
    if (state?.error) {
      setNotification({
        title: 'Error',
        description: state.error,
        variant: 'destructive'
      })
      return
    }

    if (state?.data) {
      setOpen(false)
      if (onUpdate) onUpdate()
    }
  }, [setNotification, state, onUpdate, setOpen])

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogTitle className="hidden">Start App</DialogTitle>
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
                  <div className="grid gap-2">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Name</Label>
                      <select
                        name="id"
                        id="id"
                        className="bg-background text-white"
                        required
                      >
                        <option value="">Choose an app</option>
                        {apps?.map((app) => (
                          <option key={app.id} value={app.id}>
                            {app.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-xs text-red-500">
                      {
                        state?.issues?.find((e) => e.path.includes('name'))
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
                    <Label htmlFor="name">Desktop</Label>
                    <Input
                      id="workbenchId"
                      name="workbenchId"
                      placeholder="Enter workbench id"
                      defaultValue={workbenchId || ''}
                    />
                    <div className="text-xs text-red-500">
                      {
                        state?.issues?.find((e) =>
                          e.path.includes('workbenchId')
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
                    {JSON.stringify(state?.data, null, 2)}
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
