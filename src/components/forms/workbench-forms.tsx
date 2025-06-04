'use client'

import { CirclePlus, Loader2, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState, useTransition } from 'react'

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
import { Workbench } from '~/domain/model'
import { generateScientistName } from '~/lib/utils'

import { IFormState } from '../actions/utils'
import { DeleteDialog } from '../delete-dialog'
import { Textarea } from '../ui/textarea'

const DEFAULT_VIEWPORT = {
  width: 1080,
  height: 608 // 1080 * (9/16) for 16:9 aspect ratio
}

const initialState: IFormState = {
  data: undefined,
  error: undefined,
  issues: undefined
}

export function WorkbenchCreateForm({
  workspaceId,
  userId,
  onSuccess
}: {
  workspaceId?: string
  userId?: string
  onSuccess?: (sessionId: string) => void
}) {
  const [state, formAction, pending] = useActionState(
    workbenchCreate,
    initialState,
    `/workspaces/${workspaceId}`
  )
  const [open, setOpen] = useState(false)
  const [scientistName, setScientistName] = useState(generateScientistName())
  const [viewportDimensions, setViewportDimensions] = useState(DEFAULT_VIEWPORT)
  const { setNotification } = useAppState()
  const { apps } = useAppState()
  const router = useRouter()
  useEffect(() => {
    // Set initial dimensions
    setViewportDimensions({
      width: Math.floor(window?.visualViewport?.width || DEFAULT_VIEWPORT.width),
      height: Math.floor(window?.visualViewport?.height || DEFAULT_VIEWPORT.height)
    })

    const updateDimensions = () => {
      setViewportDimensions({
        width: Math.floor(window?.visualViewport?.width || DEFAULT_VIEWPORT.width),
        height: Math.floor(window?.visualViewport?.height || DEFAULT_VIEWPORT.height)
      })
    }

    window?.visualViewport?.addEventListener('resize', updateDimensions)
    return () =>
      window?.visualViewport?.removeEventListener('resize', updateDimensions)
  }, [])

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
      setNotification({
        title: 'Success',
        description: 'Session created successfully',
        variant: 'default'
      })

      setOpen(false)

      router.push(
        `/workspaces/${workspaceId}/sessions/${state?.data as string}`
      )

      if (onSuccess) onSuccess(state?.data as string)
    }
  }, [
    state?.data,
    state?.error,
    onSuccess,
    setOpen,
    setNotification,
    router,
    workspaceId
  ])

  const handleSubmit = async (formData: FormData) => {
    try {
      await formAction(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center justify-start gap-1 rounded-full bg-background text-sm text-accent ring-1 ring-accent transition-[gap] duration-500 ease-in-out hover:gap-2 hover:bg-accent-background hover:text-black focus:bg-background focus:ring-2 focus:ring-accent"
          type="button"
          variant="default"
          disabled={pending}
        >
          <CirclePlus className="h-4 w-4" />
          {pending ? 'Creating...' : 'Start new session'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="hidden">Start App</DialogTitle>
        <DialogHeader>
          <DialogDescription asChild>
            <form action={handleSubmit}>
              <Card className="w-full max-w-md border-none bg-background text-white">
                <CardHeader>
                  <CardTitle>Start Session</CardTitle>
                  <CardDescription>
                    Start a new session with a specific app.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name of the Session</Label>
                    <div className="flex gap-2">
                      <Input
                        id="name"
                        name="name"
                        required
                        placeholder="Enter workbench name"
                        value={scientistName}
                        onChange={(e) => setScientistName(e.target.value)}
                        disabled={pending}
                        aria-disabled={pending}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setScientistName(generateScientistName())
                        }
                        aria-label="Generate random scientist name"
                        disabled={pending}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="id">App</Label>
                      <select
                        name="id"
                        id="id"
                        required
                        className="bg-background text-white"
                        disabled={pending}
                        aria-disabled={pending}
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
                      disabled={pending}
                      aria-disabled={pending}
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
                      disabled={pending}
                      aria-disabled={pending}
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
                      disabled={pending}
                      aria-disabled={pending}
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
                      disabled={pending}
                      aria-disabled={pending}
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
                      disabled={pending}
                      aria-disabled={pending}
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
                      disabled={pending}
                      aria-disabled={pending}
                    />
                    <div className="text-xs text-red-500">
                      {
                        state?.issues?.find((e) => e.path.includes('tenantId'))
                          ?.message
                      }
                    </div>
                  </div>
                  <div className="grid hidden gap-2">
                    <Input
                      type="hidden"
                      name="initialResolutionWidth"
                      value={viewportDimensions.width}
                    />
                    <Input
                      type="hidden"
                      name="initialResolutionHeight"
                      value={viewportDimensions.height}
                    />
                  </div>
                  <p aria-live="polite" className="sr-only" role="status">
                    {JSON.stringify(state?.data)}
                  </p>
                  {state?.error && (
                    <p className="text-red-500">{state.error}</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="ml-auto flex items-center justify-start gap-1 rounded-full bg-accent text-sm text-black transition-[gap] duration-500 ease-in-out hover:gap-2 hover:bg-accent-background focus:bg-accent-background focus:ring-2 focus:ring-accent"
                    type="submit"
                    disabled={pending}
                    aria-disabled={pending}
                  >
                    {pending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {`Start ${pending ? '...' : ''}`}
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

export function WorkbenchDeleteForm({
  state: [open, setOpen],
  id,
  onUpdate
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  id?: string
  onUpdate?: () => void
}) {
  const [formState, formAction, pending] = useActionState(
    workbenchDelete,
    initialState
  )
  const [, startTransition] = useTransition()
  const handleDelete = async () => {
    try {
      const formData = new FormData()
      formData.append('id', id || '')
      startTransition(() => {
        formAction(formData)
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (formState?.data) {
      setOpen(false)
      if (onUpdate) onUpdate()
    }
  }, [formState?.data])

  return (
    <DeleteDialog
      open={open}
      onCancel={() => {
        setOpen(false)
      }}
      isDeleting={pending}
      onConfirm={handleDelete}
      title="Delete Session"
      description="The Session and its apps will be deleted. Are you sure? This action cannot be undone."
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
  const [state, formAction] = useActionState(workbenchUpdate, initialState)
  const [scientistName, setScientistName] = useState(workbench.name)
  const { setNotification } = useAppState()
  const [, startTransition] = useTransition()

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

  const handleSubmit = async (formData: FormData) => {
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Session</DialogTitle>
          <DialogDescription>Update your session settings.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <Card className="w-full max-w-md border-none bg-background text-white">
            <CardHeader>
              <CardTitle>Update Session</CardTitle>
              <CardDescription>Update your session settings.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={scientistName}
                    onChange={(e) => setScientistName(e.target.value)}
                    required
                  />
                </div>
                <div className="text-xs text-red-500">
                  {state?.issues?.find((e) => e.path.includes('name'))?.message}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="ml-auto">
                Update
              </Button>
            </CardFooter>
          </Card>
        </form>
      </DialogContent>
    </DialogContainer>
  )
}
