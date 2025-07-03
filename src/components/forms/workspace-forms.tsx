'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { startTransition, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

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
import {
  Workspace,
  WorkspaceCreateSchema,
  WorkspaceCreateType,
  WorkspaceState,
  WorkspaceUpdateSchema,
  WorkspaceUpdatetype
} from '@/domain/model/workspace'
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
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'

import { toast } from '../hooks/use-toast'

export function WorkspaceCreateForm({
  state: [open, setOpen],
  userId,
  children,
  onSuccess
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  userId?: string
  children?: React.ReactNode
  onSuccess?: (workspace: Workspace) => void
}) {
  const form = useForm<WorkspaceCreateType>({
    resolver: zodResolver(WorkspaceCreateSchema),
    defaultValues: {
      name: '',
      shortName: '',
      description: '',
      tenantId: '1',
      userId: userId || ''
    }
  })

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  async function onSubmit(data: WorkspaceCreateType) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, String(value))
    })
    formData.append('status', WorkspaceState.ACTIVE)

    startTransition(async () => {
      const result = await workspaceCreate({}, formData)

      if (result.issues) {
        result.issues.forEach((issue) => {
          form.setError(issue.path[0] as keyof WorkspaceCreateType, {
            type: 'server',
            message: issue.message
          })
        })
        return
      }

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive'
        })
        return
      }

      if (result.data) {
        toast({
          title: 'Success',
          description: 'Workspace created successfully'
        })
        if (onSuccess) onSuccess(result.data)
        setOpen(false)
        form.reset()
      }
    })
  }

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Fill out the form to create a new workspace.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full border-none bg-background text-white">
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
      </DialogContent>
    </DialogContainer>
  )
}

export function WorkspaceDeleteForm({
  state: [open, setOpen],
  id,
  onSuccess
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  id?: string
  onSuccess?: () => void
}) {
  const [isDeleting, setIsDeleting] = useState(false)

  const onConfirm = async () => {
    if (!id) return
    setIsDeleting(true)
    startTransition(async () => {
      const result = await workspaceDelete(id)
      setIsDeleting(false)

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive'
        })
        return
      }

      if (result.data) {
        toast({
          title: 'Success',
          description: 'Workspace deleted successfully.'
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
      title="Delete Workspace"
      description="Are you sure you want to delete this workspace? This action cannot be undone."
    />
  )
}

export function WorkspaceUpdateForm({
  state: [open, setOpen],
  trigger,
  workspace,
  onSuccess
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  trigger?: React.ReactNode
  workspace?: Workspace
  onSuccess?: (workspace: Workspace) => void
}) {
  const form = useForm<WorkspaceUpdatetype>({
    resolver: zodResolver(WorkspaceUpdateSchema),
    defaultValues: {
      id: workspace?.id || '',
      name: workspace?.name || '',
      shortName: workspace?.shortName || '',
      description: workspace?.description || '',
      status: workspace?.status || WorkspaceState.ACTIVE,
      tenantId: '1',
      userId: workspace?.userId || ''
    }
  })

  useEffect(() => {
    if (open) {
      form.reset({
        id: workspace?.id || '',
        name: workspace?.name || '',
        shortName: workspace?.shortName || '',
        description: workspace?.description || '',
        status: workspace?.status || WorkspaceState.ACTIVE,
        tenantId: '1',
        userId: workspace?.userId || ''
      })
    }
  }, [open, workspace, form])

  async function onSubmit(data: WorkspaceUpdatetype) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, String(value))
    })

    startTransition(async () => {
      const result = await workspaceUpdate({}, formData)

      if (result.issues) {
        result.issues.forEach((issue) => {
          form.setError(issue.path[0] as keyof WorkspaceUpdatetype, {
            type: 'server',
            message: issue.message
          })
        })
        return
      }

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive'
        })
        return
      }

      if (result.data) {
        toast({
          title: 'Success',
          description: 'Workspace updated successfully'
        })
        if (onSuccess) onSuccess(result.data)
        setOpen(false)
      }
    })
  }

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-white">Update Workspace</DialogTitle>
          <DialogDescription>Update workspace information.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="w-full max-w-md border-none bg-background text-white">
              <CardContent className="grid gap-4">
                <input type="hidden" {...form.register('id')} />
                <input type="hidden" {...form.register('tenantId')} />
                <input type="hidden" {...form.register('userId')} />

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
                            WorkspaceState.DELETED
                          ].map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              className="capitalize"
                            >
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors.name && (
                  <p className="text-red-500">
                    {form.formState.errors.name.message}
                  </p>
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
                  Update
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </DialogContent>
    </DialogContainer>
  )
}
