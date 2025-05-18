'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState
} from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  workspaceCreate,
  workspaceDelete,
  workspaceUpdate
} from '@/components/actions/workspace-view-model'
import {
  Dialog as DialogContainer,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Workspace } from '@/domain/model'
import { WorkspaceState } from '@/domain/model/workspace'
import { Button } from '~/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'

import { IFormState } from '../actions/utils'
import { DeleteDialog } from '../delete-dialog'

const initialState: IFormState = {
  data: undefined,
  error: undefined,
  issues: undefined
}

const workspaceFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  shortName: z.string().min(1, 'Short name is required'),
  description: z.string().optional(),
  tenantId: z.string(),
  userId: z.string(),
  memberIds: z.string(),
  tags: z.string()
})

type WorkspaceFormData = z.infer<typeof workspaceFormSchema>

export function WorkspaceCreateForm({
  state: [open, setOpen],
  userId,
  children,
  onUpdate
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  userId?: string
  children?: React.ReactNode
  onUpdate?: () => void
}) {
  const [formState, formAction] = useActionState(workspaceCreate, initialState)
  const hasHandledSuccess = useRef(false)
  const form = useForm<WorkspaceFormData>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: {
      name: '',
      shortName: '',
      description: '',
      tenantId: '1',
      userId: userId || '',
      memberIds: '',
      tags: ''
    }
  })

  useEffect(() => {
    if (!open) {
      hasHandledSuccess.current = false
      form.reset()
      return
    }

    if (formState?.error) {
      return
    }

    if (formState?.data && !hasHandledSuccess.current) {
      hasHandledSuccess.current = true
      setOpen(false)
      if (onUpdate) onUpdate()
    }
  }, [formState, onUpdate, setOpen, open, form])

  async function onSubmit(data: WorkspaceFormData) {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('shortName', data.shortName)
    formData.append('description', data.description || '')
    formData.append('tenantId', data.tenantId)
    formData.append('ownerId', data.userId)
    formData.append('memberIds', data.memberIds)
    formData.append('tags', data.tags)

    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle className="hidden">Create Workspace</DialogTitle>
        <DialogHeader>
          <DialogDescription asChild>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="w-full max-w-md border-none bg-background text-white">
                <CardHeader>
                  <CardTitle>Create Workspace</CardTitle>
                  <CardDescription>
                    Fill out the form to create a new workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      {...form.register('name')}
                      className="bg-background text-neutral-400"
                      placeholder="Enter workspace name"
                    />
                    {form.formState.errors.name && (
                      <div className="text-xs text-red-500">
                        {form.formState.errors.name.message}
                      </div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="shortName">Short Name</Label>
                    <Input
                      id="shortName"
                      {...form.register('shortName')}
                      className="bg-background text-neutral-400"
                      placeholder="Enter short name"
                    />
                    {form.formState.errors.shortName && (
                      <div className="text-xs text-red-500">
                        {form.formState.errors.shortName.message}
                      </div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...form.register('description')}
                      placeholder="Enter description"
                      className="min-h-[100px] bg-background text-neutral-400"
                    />
                    {form.formState.errors.description && (
                      <div className="text-xs text-red-500">
                        {form.formState.errors.description.message}
                      </div>
                    )}
                  </div>
                  <input type="hidden" {...form.register('tenantId')} />
                  <input type="hidden" {...form.register('userId')} />
                  <input type="hidden" {...form.register('memberIds')} />
                  <input type="hidden" {...form.register('tags')} />
                  <p aria-live="polite" className="sr-only" role="status">
                    {JSON.stringify(formState?.data, null, 2)}
                  </p>
                  {formState?.error && (
                    <p className="text-red-500">{formState.error}</p>
                  )}
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
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </DialogContainer>
  )
}

export function WorkspaceDeleteForm({
  state: [open, setOpen],
  id,
  onUpdate
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  id?: string
  onUpdate?: () => void
}) {
  const [formState, formAction] = useActionState(workspaceDelete, initialState)
  const [isDeleting, setIsDeleting] = useState(false)
  const hasHandledSuccess = useRef(false)

  useEffect(() => {
    if (!open) {
      hasHandledSuccess.current = false
      setIsDeleting(false)
      return
    }

    if (formState?.error) {
      setIsDeleting(false)
      return
    }

    if (formState?.data && !hasHandledSuccess.current) {
      hasHandledSuccess.current = true
      setIsDeleting(false)
      setOpen(false)
      if (onUpdate) onUpdate()
    }
  }, [formState, onUpdate, setOpen, open])

  return (
    <DeleteDialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!isDeleting) {
          setOpen(newOpen)
        }
      }}
      onConfirm={() => {
        setIsDeleting(true)
        const formData = new FormData()
        formData.append('id', id || '')
        startTransition(() => {
          formAction(formData)
        })
      }}
      isDeleting={isDeleting}
      title="Delete Workspace"
      description="Are you sure you want to delete this workspace? This action cannot be undone."
    />
  )
}

const workspaceUpdateFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  shortName: z.string().min(1, 'Short name is required'),
  description: z.string().optional(),
  status: z.nativeEnum(WorkspaceState),
  tenantId: z.string(),
  userId: z.string(),
  memberIds: z.string(),
  tags: z.string()
})

type WorkspaceUpdateFormData = z.infer<typeof workspaceUpdateFormSchema>

export function WorkspaceUpdateForm({
  state: [open, setOpen],
  trigger,
  workspace,
  onUpdate
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  trigger?: React.ReactNode
  workspace?: Workspace
  onUpdate?: () => void
}) {
  const [formState, formAction] = useActionState(workspaceUpdate, initialState)
  const form = useForm<WorkspaceUpdateFormData>({
    resolver: zodResolver(workspaceUpdateFormSchema),
    defaultValues: {
      id: workspace?.id || '',
      name: workspace?.name || '',
      shortName: workspace?.shortName || '',
      description: workspace?.description || '',
      status: workspace?.status || WorkspaceState.ACTIVE,
      tenantId: '1',
      userId: workspace?.ownerId || '',
      memberIds: workspace?.memberIds?.join(',') || '',
      tags: workspace?.tags?.join(',') || ''
    }
  })

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  useEffect(() => {
    if (formState?.error) return
    if (formState?.data) {
      setOpen(false)
      if (onUpdate) onUpdate()
    }
  }, [formState, onUpdate, setOpen])

  async function onSubmit(data: WorkspaceUpdateFormData) {
    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('name', data.name)
    formData.append('shortName', data.shortName)
    formData.append('description', data.description || '')
    formData.append('status', data.status)
    formData.append('tenantId', data.tenantId)
    formData.append('userId', data.userId)
    formData.append('memberIds', data.memberIds)
    formData.append('tags', data.tags)

    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-white">Update Workspace</DialogTitle>
        <DialogDescription>Update workspace information.</DialogDescription>
        <DialogHeader className="mt-4">
          <DialogDescription asChild>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Form {...form}>
                <Card className="w-full max-w-md border-none bg-background text-white">
                  <CardContent className="grid gap-4">
                    <input type="hidden" {...form.register('id')} />
                    <input type="hidden" {...form.register('tenantId')} />
                    <input type="hidden" {...form.register('userId')} />
                    <input type="hidden" {...form.register('memberIds')} />
                    <input type="hidden" {...form.register('tags')} />

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-background text-neutral-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shortName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Short Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-background text-neutral-400"
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
                              className="min-h-[100px] bg-background text-neutral-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background text-neutral-400">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[
                                WorkspaceState.ACTIVE,
                                WorkspaceState.INACTIVE,
                                WorkspaceState.ARCHIVED
                              ].map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {formState?.error && (
                      <p className="text-red-500">{formState.error}</p>
                    )}
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

                      {form.formState.isSubmitting ? 'Updating...' : 'Update'}
                    </Button>
                  </CardFooter>
                </Card>
              </Form>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </DialogContainer>
  )
}
