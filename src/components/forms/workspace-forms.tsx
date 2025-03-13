'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'

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

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="ml-auto" type="submit" disabled={pending}>
      Create
    </Button>
  )
}

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
  const [state, formAction] = useActionState(workspaceCreate, initialState)

  useEffect(() => {
    if (state?.error) {
      return
    }

    if (state?.data) {
      setOpen(false)
      if (onUpdate) onUpdate()
    }
  }, [state])

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription asChild>
            <form action={formAction}>
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
                      name="name"
                      className="bg-background text-neutral-400"
                      placeholder="Enter workspace name"
                    />
                    <div className="text-xs text-red-500">
                      {
                        state?.issues?.find((e) => e.path.includes('name'))
                          ?.message
                      }
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="shortName">Short Name</Label>
                    <Input
                      id="shortName"
                      name="shortName"
                      className="bg-background text-neutral-400"
                      placeholder="Enter short name"
                    />
                    <div className="text-xs text-red-500">
                      {
                        state?.issues?.find((e) => e.path.includes('shortName'))
                          ?.message
                      }
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter description"
                      className="min-h-[100px] bg-background text-neutral-400"
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
                      defaultValue={userId}
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
                  <div className="grid hidden gap-2">
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

export function WorkspaceDeleteForm({
  state: [open, setOpen],
  id,
  onUpdate
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  id?: string
  onUpdate?: () => void
}) {
  const [state, formAction] = useActionState(workspaceDelete, initialState)
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
      title="Delete Workspace"
      description="Are you sure you want to delete this workspace? This action cannot be undone."
      isDeleting={isDeleting}
    />
  )
}

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

  useEffect(() => {
    if (formState?.error) return
    if (formState?.data) {
      setOpen(false)
      if (onUpdate) onUpdate()
    }
  }, [formState])

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-white">Update Workspace</DialogTitle>
        <DialogDescription>Update workspace information.</DialogDescription>
        <DialogHeader className="mt-4">
          <DialogDescription asChild>
            <form action={formAction}>
              <Card className="w-full max-w-md border-none bg-background text-white">
                <CardContent className="grid gap-4">
                  <input type="hidden" name="id" value={workspace?.id} />
                  <input type="hidden" name="tenantId" value="1" />
                  <input
                    type="hidden"
                    name="userId"
                    value={workspace?.ownerId}
                  />
                  <input
                    type="hidden"
                    name="memberIds"
                    value={workspace?.memberIds.join(',')}
                  />
                  <input
                    type="hidden"
                    name="tags"
                    value={workspace?.tags.join(',')}
                  />

                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={workspace?.name}
                      className="bg-background text-neutral-400"
                    />
                    <div className="text-xs text-red-500">
                      {
                        formState?.issues?.find((e) => e.path.includes('name'))
                          ?.message
                      }
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="shortName">Short Name</Label>
                    <Input
                      id="shortName"
                      name="shortName"
                      defaultValue={workspace?.shortName}
                      className="bg-background text-neutral-400"
                    />
                    <div className="text-xs text-red-500">
                      {
                        formState?.issues?.find((e) =>
                          e.path.includes('shortName')
                        )?.message
                      }
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={workspace?.description}
                      className="min-h-[100px] bg-background text-neutral-400"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={workspace?.status}>
                      <SelectTrigger className="bg-background text-neutral-400">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
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
                  </div>

                  {formState?.error && (
                    <p className="text-red-500">{formState.error}</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto" type="submit">
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
