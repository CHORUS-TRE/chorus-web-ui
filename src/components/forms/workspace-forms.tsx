'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { startTransition, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from '@/components/hooks/use-toast'
import {
  Dialog as DialogContainer,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Workspace,
  WorkspaceCreateSchema,
  WorkspaceCreateType,
  WorkspaceState,
  WorkspaceUpdateSchema,
  WorkspaceUpdatetype
} from '@/domain/model/workspace'
import {
  setWorkspaceImage,
  setWorkspaceTag
} from '@/view-model/dev-store-view-model'
import {
  workspaceCreate,
  workspaceDelete,
  workspaceUpdate
} from '@/view-model/workspace-view-model'
import { Button } from '~/components/button'
import { Card, CardContent, CardFooter } from '~/components/card'
import { DeleteDialog } from '~/components/forms/delete-dialog'
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
import { Textarea } from '~/components/ui/textarea'

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
  const FormSchema = WorkspaceCreateSchema.extend({
    tag: z.enum(['center', 'project']).optional(),
    image: z.any().optional()
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      shortName: '',
      description: '',
      tenantId: '1',
      userId: userId || '',
      isMain: false,
      tag: 'project'
    }
  })

  useEffect(() => {
    if (!open) {
      form.reset({
        name: '',
        shortName: '',
        description: '',
        tenantId: '1',
        userId: userId || '',
        isMain: false
      })
    }
  }, [open, form, userId])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'tag' && key !== 'image' && value) {
        formData.append(key, String(value))
      }
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
        // Save tag and image to DevStore
        if (result.data.id) {
          let imageBase64: string | undefined
          if (
            data.image &&
            Array.isArray(data.image) &&
            data.image.length > 0
          ) {
            const file = data.image[0] as File
            await new Promise<void>((resolve) => {
              const reader = new FileReader()
              reader.onloadend = async () => {
                imageBase64 = reader.result as string
                await setWorkspaceImage(result.data!.id, imageBase64)
                resolve()
              }
              reader.readAsDataURL(file as Blob)
            })
          }

          if (data.tag) {
            await setWorkspaceTag(result.data.id, data.tag)
          }

          // Update local cache immediately
          const cacheKey = `workspace_meta_${result.data.id}`
          const meta = {
            image: imageBase64,
            tag: data.tag
          }
          localStorage.setItem(cacheKey, JSON.stringify(meta))
        }

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="w-full border-none bg-background">
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
                {/* <div className="grid gap-2">
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
              </div> */}
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

                <div className="grid gap-2">
                  <Label htmlFor="tag">Tag</Label>
                  <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background text-neutral-400">
                              <SelectValue placeholder="Select a tag" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="project">Project</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    {...form.register('image')}
                    className="bg-background text-neutral-400"
                  />
                </div>

                <input type="hidden" {...form.register('tenantId')} />
                <input type="hidden" {...form.register('userId')} />
                <input type="hidden" {...form.register('shortName')} />
              </CardContent>
              <CardFooter className="flex justify-end gap-4">
                <Button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    form.reset()
                  }}
                  className="text-muted ring-muted focus:bg-background focus:text-accent"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
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
  const FormSchema = WorkspaceUpdateSchema.extend({
    tag: z.enum(['center', 'project']).optional(),
    image: z.any().optional()
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: workspace?.id || '',
      name: workspace?.name || '',
      shortName: workspace?.shortName || 'wks',
      description: workspace?.description || '',
      isMain: workspace?.isMain || false,
      tenantId: '1',
      userId: workspace?.userId || '',
      tag: workspace?.tag
      // image: workspace?.image // We can't set file input value
    }
  })

  useEffect(() => {
    if (open) {
      form.reset({
        id: workspace?.id || '',
        name: workspace?.name || '',
        shortName: workspace?.shortName || 'wks',
        description: workspace?.description || '',
        isMain: workspace?.isMain || false,
        tenantId: '1',
        userId: workspace?.userId || '',
        tag: workspace?.tag
      })
    }
  }, [open, workspace, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'tag' && key !== 'image' && value) {
        formData.append(key, String(value))
      }
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
        // Save tag and image to DevStore
        if (result.data.id) {
          let imageBase64: string | undefined
          if (
            data.image &&
            Array.isArray(data.image) &&
            data.image.length > 0
          ) {
            const file = data.image[0] as File
            await new Promise<void>((resolve) => {
              const reader = new FileReader()
              reader.onloadend = async () => {
                imageBase64 = reader.result as string
                await setWorkspaceImage(result.data!.id, imageBase64)
                resolve()
              }
              reader.readAsDataURL(file as Blob)
            })
          }

          if (data.tag) {
            await setWorkspaceTag(result.data.id, data.tag)
          }

          // Update local cache immediately
          const cacheKey = `workspace_meta_${result.data.id}`
          const meta = {
            image: imageBase64 || result.data.image,
            tag: data.tag || result.data.tag
          }
          localStorage.setItem(cacheKey, JSON.stringify(meta))
        }

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
          <DialogTitle>Update Workspace</DialogTitle>
          <DialogDescription>Update workspace information.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="w-full max-w-md border-none bg-background">
              <CardContent className="grid gap-4">
                <input type="hidden" {...form.register('id')} />
                <input type="hidden" {...form.register('tenantId')} />
                <input type="hidden" {...form.register('userId')} />
                <input type="hidden" {...form.register('isMain')} />
                <input type="hidden" {...form.register('shortName')} />

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

                {/* <FormField
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
                /> */}

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

                {form.formState.errors.name && (
                  <p className="text-red-500">
                    {form.formState.errors.name.message}
                  </p>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="tag">Tag</Label>
                  <FormField
                    control={form.control}
                    name="tag"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background text-neutral-400">
                              <SelectValue placeholder="Select a tag" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="project">Project</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image">Image</Label>
                  {workspace?.image && (
                    <div className="relative mb-2 h-32 w-full overflow-hidden rounded-md bg-muted/20">
                      <Image
                        src={workspace.image}
                        alt="Current workspace image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    {...form.register('image')}
                    className="bg-background text-neutral-400"
                  />
                </div>
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
