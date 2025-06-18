'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CirclePlus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { startTransition, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ZodIssue } from 'zod'

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
import {
  Workbench,
  WorkbenchCreateSchema,
  WorkbenchCreateType,
  WorkbenchStatus,
  WorkbenchUpdateSchema,
  WorkbenchUpdateType
} from '@/domain/model'
import { Button } from '~/components/button'
import { DeleteDialog } from '~/components/forms/delete-dialog'
import { Card, CardContent, CardFooter } from '~/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'

import { Textarea } from '../ui/textarea'

const DEFAULT_VIEWPORT = {
  width: 1080,
  height: 608 // 1080 * (9/16) for 16:9 aspect ratio
}

export function WorkbenchCreateForm({
  workspaceId,
  workspaceName,
  userId,
  onSuccess,
  openOnStart = false
}: {
  workspaceId: string
  workspaceName?: string
  userId?: string
  onSuccess?: (workbench: Workbench) => void
  openOnStart?: boolean
}) {
  const [open, setOpen] = useState(openOnStart)
  const [viewportDimensions, setViewportDimensions] = useState(DEFAULT_VIEWPORT)
  const { setNotification } = useAppState()
  const router = useRouter()

  const form = useForm<WorkbenchCreateType>({
    resolver: zodResolver(WorkbenchCreateSchema),
    defaultValues: {
      name: `${workspaceName}-session`,
      workspaceId: workspaceId,
      userId: userId || '2',
      tenantId: '1',
      status: WorkbenchStatus.ACTIVE,
      description: '',
      initialResolutionHeight: viewportDimensions.height,
      initialResolutionWidth: viewportDimensions.width
    }
  })

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
    if (open) {
      form.reset({
        name: `${workspaceName}-session`,
        workspaceId: workspaceId,
        userId: userId || '2',
        tenantId: '1',
        status: WorkbenchStatus.ACTIVE,
        description: '',
        initialResolutionHeight: viewportDimensions.height,
        initialResolutionWidth: viewportDimensions.width
      })
    }
  }, [
    open,
    form,
    workspaceId,
    workspaceName,
    userId,
    viewportDimensions.height,
    viewportDimensions.width
  ])

  async function onSubmit(data: WorkbenchCreateType) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, String(value))
    })

    startTransition(async () => {
      const result = await workbenchCreate({}, formData)

      if (result.issues) {
        result.issues.forEach((issue: ZodIssue) => {
          form.setError(issue.path[0] as keyof WorkbenchCreateType, {
            type: 'server',
            message: issue.message
          })
        })
        return
      }

      if (result.error) {
        setNotification({
          title: 'Error',
          description: result.error,
          variant: 'destructive'
        })
        return
      }

      if (result.data) {
        setNotification({
          title: 'Success',
          description: 'Session created successfully'
        })
        setOpen(false)
        router.push(
          `/workspaces/${workspaceId}/sessions/${result.data.id as string}`
        )
        if (onSuccess) onSuccess(result.data)
      }
    })
  }

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center justify-start gap-1 rounded-full bg-background text-sm text-accent ring-1 ring-accent transition-[gap] duration-500 ease-in-out hover:gap-2 hover:bg-accent-background hover:text-black focus:bg-background focus:ring-2 focus:ring-accent"
          type="button"
          variant="default"
          disabled={form.formState.isSubmitting}
        >
          <CirclePlus className="h-4 w-4" />
          {form.formState.isSubmitting ? 'Creating...' : 'Start session'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background text-white">
        <DialogHeader>
          <DialogTitle>Start Session</DialogTitle>
          <DialogDescription>Start a new session.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="w-full max-w-md border-none bg-background text-white">
              <CardContent className="grid gap-4">
                <input
                  type="hidden"
                  {...form.register('initialResolutionWidth')}
                />
                <input
                  type="hidden"
                  {...form.register('initialResolutionHeight')}
                />
                <input type="hidden" {...form.register('workspaceId')} />
                <input type="hidden" {...form.register('userId')} />
                <input type="hidden" {...form.register('tenantId')} />
                <input type="hidden" {...form.register('status')} />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of the Session</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          required
                          placeholder="Enter session name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter description"
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button
                  className="ml-auto"
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </DialogContent>
    </DialogContainer>
  )
}

export function WorkbenchDeleteForm({
  state: [open, setOpen],
  id,
  onSuccess
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  id?: string
  onSuccess?: () => void
}) {
  const { setNotification } = useAppState()
  const [isDeleting, setIsDeleting] = useState(false)

  const onConfirm = async () => {
    if (!id) return
    setIsDeleting(true)
    startTransition(async () => {
      const result = await workbenchDelete(id)
      setIsDeleting(false)

      if (result.error) {
        setNotification({
          title: 'Error',
          description: result.error,
          variant: 'destructive'
        })
        return
      }

      if (result.data) {
        setNotification({
          title: 'Success',
          description: 'Session deleted successfully.'
        })
        if (onSuccess) onSuccess()
        setOpen(false)
      }
    })
  }

  return (
    <DeleteDialog
      open={open}
      onCancel={() => setOpen(false)}
      onConfirm={onConfirm}
      isDeleting={isDeleting}
      title="Delete Session"
      description="Are you sure you want to delete this session? This action cannot be undone."
    />
  )
}

export function WorkbenchUpdateForm({
  state: [open, setOpen],
  workbench,
  onSuccess
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  workbench: Workbench
  onSuccess?: (workbench: Workbench) => void
}) {
  const { setNotification } = useAppState()
  const form = useForm<WorkbenchUpdateType>({
    resolver: zodResolver(WorkbenchUpdateSchema),
    defaultValues: {
      id: workbench.id,
      name: workbench.name,
      description: workbench.description,
      status: workbench.status,
      tenantId: workbench.tenantId,
      userId: workbench.userId,
      workspaceId: workbench.workspaceId,
      initialResolutionHeight: workbench.initialResolutionHeight,
      initialResolutionWidth: workbench.initialResolutionWidth
    }
  })

  useEffect(() => {
    if (open) {
      form.reset({
        id: workbench.id,
        name: workbench.name,
        description: workbench.description,
        status: workbench.status,
        tenantId: workbench.tenantId,
        userId: workbench.userId,
        workspaceId: workbench.workspaceId,
        initialResolutionHeight: workbench.initialResolutionHeight,
        initialResolutionWidth: workbench.initialResolutionWidth
      })
    }
  }, [open, workbench, form])

  async function onSubmit(data: WorkbenchUpdateType) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, String(value))
    })

    startTransition(async () => {
      const result = await workbenchUpdate({}, formData)

      if (result.issues) {
        result.issues.forEach((issue: ZodIssue) => {
          form.setError(issue.path[0] as keyof WorkbenchUpdateType, {
            type: 'server',
            message: issue.message
          })
        })
        return
      }

      if (result.error) {
        setNotification({
          title: 'Error',
          description: result.error,
          variant: 'destructive'
        })
        return
      }

      if (result.data) {
        setNotification({
          title: 'Success',
          description: 'Session updated successfully'
        })
        if (onSuccess) onSuccess(result.data)
        setOpen(false)
      }
    })
  }

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Session</DialogTitle>
          <DialogDescription>
            Make changes to your session here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="w-full max-w-md border-none bg-background text-white">
              <CardContent className="grid gap-4">
                <input type="hidden" {...form.register('id')} />
                <input type="hidden" {...form.register('tenantId')} />
                <input type="hidden" {...form.register('userId')} />
                <input type="hidden" {...form.register('workspaceId')} />
                <input
                  type="hidden"
                  {...form.register('initialResolutionWidth')}
                />
                <input
                  type="hidden"
                  {...form.register('initialResolutionHeight')}
                />
                <input type="hidden" {...form.register('status')} />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button
                  className="ml-auto"
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </DialogContent>
    </DialogContainer>
  )
}
