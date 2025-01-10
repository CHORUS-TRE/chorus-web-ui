'use client'

import { useEffect, useState } from 'react'
import { CirclePlus, Loader2, RefreshCw, TriangleAlert } from 'lucide-react'
import { useFormState, useFormStatus } from 'react-dom'

import {
  workbenchCreate,
  workbenchDelete,
  workbenchUpdate
} from '@/components/actions/workbench-view-model'
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
import { App, Workbench } from '~/domain/model'
import { useToast } from '~/hooks/use-toast'
import { generateScientistName } from '~/lib/utils'

import { IFormState } from '../actions/utils'
import { DeleteDialog } from '../delete-dialog'
import { Textarea } from '../ui/textarea'

const initialState: IFormState = {
  data: undefined,
  error: undefined,
  issues: undefined
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      className="ml-auto flex items-center justify-start gap-1 rounded-full bg-accent text-sm text-black transition-[gap] duration-500 ease-in-out hover:gap-2 hover:bg-accent-background focus:bg-accent-background focus:ring-2 focus:ring-accent"
      type="submit"
      disabled={pending}
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Start
    </Button>
  )
}

export function WorkbenchCreateForm({
  workspaceId,
  userId,
  onUpdate
}: {
  workspaceId?: string
  userId?: string
  onUpdate?: (id: string) => void
}) {
  const [state, formAction] = useFormState(
    workbenchCreate,
    initialState,
    `/workspaces/${workspaceId}`
  )
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const [scientistName, setScientistName] = useState(generateScientistName())
  const { toast } = useToast()
  const { refreshWorkbenches, apps } = useAppState()

  useEffect(() => {
    if (state?.error) {
      return
    }

    if (state?.data) {
      setOpen(false)
      if (onUpdate) onUpdate(state?.data as string)
    }
  }, [state])

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
        className: 'bg-background text-white',
        duration: 1000
      })
    }
  }, [error])

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center justify-start gap-1 rounded-full bg-background text-sm text-accent ring-1 ring-accent transition-[gap] duration-500 ease-in-out hover:gap-2 hover:bg-accent-background hover:text-black focus:bg-background focus:ring-2 focus:ring-accent"
          type="button"
          variant="default"
        >
          <CirclePlus className="h-3.5 w-3.5" />
          Start new desktop
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="hidden">Start App</DialogTitle>
        <DialogHeader>
          <DialogDescription asChild>
            <form action={formAction}>
              <Card className="w-full max-w-md border-none bg-background text-white">
                <CardHeader>
                  <CardTitle>Start Desktop</CardTitle>
                  <CardDescription>
                    Start a new desktop with a specific app.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name of the Desktop</Label>
                    <div className="flex gap-2">
                      <Input
                        id="name"
                        name="name"
                        required
                        placeholder="Enter workbench name"
                        value={scientistName}
                        onChange={(e) => setScientistName(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setScientistName(generateScientistName())
                        }
                        aria-label="Generate random scientist name"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="name">App</Label>
                      <select
                        name="id"
                        id="id"
                        required
                        className="bg-background text-white"
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

export function WorkbenchDeleteForm({
  state: [open, setOpen],
  id,
  onUpdate
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  id?: string
  onUpdate?: () => void
}) {
  const [state, formAction] = useFormState(workbenchDelete, initialState)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const formData = new FormData()
      formData.append('id', id || '')
      await formAction(formData)
      setIsDeleting(false)
      setOpen(false)
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error(error)
      setIsDeleting(false)
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    if (!open) {
      setIsDeleting(false)
    }
  }, [open])

  return (
    <DeleteDialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!isDeleting) {
          setOpen(newOpen)
        }
      }}
      onConfirm={handleDelete}
      title="Quit Desktop"
      description="The Desktop will be stopped and the apps will be closed. Are you sure you want to delete this desktop and it's apps? This action cannot be undone."
      isDeleting={isDeleting}
    />
  )
}

export function WorkbenchUpdateForm({
  state: [open, setOpen],
  workbench,
  onUpdate
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  workbench: Workbench
  onUpdate?: () => void
}) {
  const [state, formAction] = useFormState(workbenchUpdate, initialState)
  const { toast } = useToast()
  const [scientistName, setScientistName] = useState(workbench.name)

  useEffect(() => {
    if (state?.error) {
      toast({
        title: 'Error',
        description: state.error,
        variant: 'destructive',
        className: 'bg-background text-white',
        duration: 1000
      })
      return
    }

    if (state?.data) {
      setOpen(false)
      if (onUpdate) onUpdate()
    }
  }, [state, onUpdate, setOpen])

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogTitle className="hidden">Update Desktop</DialogTitle>
        <DialogHeader>
          <DialogDescription asChild>
            <form action={formAction}>
              <Card className="w-full max-w-md border-none bg-background text-white">
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Edit desktop settings.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name of the Desktop</Label>
                    <div className="flex gap-2">
                      <Input
                        id="name"
                        name="name"
                        required
                        placeholder="Enter workbench name"
                        value={scientistName}
                        onChange={(e) => setScientistName(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setScientistName(generateScientistName())
                        }
                        aria-label="Generate random scientist name"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid hidden gap-2">
                    <Input id="id" name="id" defaultValue={workbench.id} />
                    <Input
                      id="workspaceId"
                      name="workspaceId"
                      defaultValue={workbench.workspaceId}
                    />
                    <Input
                      id="tenantId"
                      name="tenantId"
                      defaultValue={workbench.tenantId}
                    />
                    <Input
                      id="ownerId"
                      name="ownerId"
                      defaultValue={workbench.ownerId}
                    />
                  </div>
                  <div className="grid hidden gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter description"
                      className="min-h-[100px]"
                      defaultValue={workbench.description}
                    />
                  </div>
                  {state?.error && (
                    <p className="text-red-500">{state.error}</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="ml-auto flex items-center justify-start gap-1 rounded-full bg-accent text-sm text-black transition-[gap] duration-500 ease-in-out hover:gap-2 hover:bg-accent-background focus:bg-accent-background focus:ring-2 focus:ring-accent"
                    type="submit"
                  >
                    Update
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </DialogContainer>
  )
}
