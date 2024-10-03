'use client'

import { useEffect, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

import {
  workspaceCreate,
  workspaceDelete
} from '@/components/actions/workspace-view-model'
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
import { Textarea } from '~/components/ui/textarea'

import { IFormState } from '../actions/utils'
import { Icons } from '../ui/icons'

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

function DeleteButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" aria-disabled={pending}>
      Delete
    </button>
  )
}

export function WorkspaceCreateForm({ userId }: { userId?: string }) {
  const [state, formAction] = useFormState(workspaceCreate, initialState)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (state?.data) {
      setOpen(false)
    }
  }, [state])

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icons.CirclePlusIcon className="h-3.5 w-3.5" />
          New workspace
        </Button>
      </DialogTrigger>
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

export function WorkspaceDeleteForm({ id }: { id?: string }) {
  const [state, formAction] = useFormState(workspaceDelete, initialState)

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
