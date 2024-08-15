'use client'

import { useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { useFormState } from 'react-dom' // TODO: update by import { useActionState } from "react" in next NextJS version

import { workspaceCreate } from '@/components/actions/workspace-view-model'

import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'

import { IFormState } from '../actions/utils'

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

export function WorkspaceCreateForm() {
  const [state, formAction] = useFormState(workspaceCreate, initialState)

  useEffect(() => {
    console.log(state)
  }, [state])

  return (
    <form action={formAction}>
      <Card className="w-full max-w-md">
        <CardHeader>
          {/* <CardTitle>Create Workspace</CardTitle> */}
          <CardDescription>
            Fill out the form to create a new workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Enter workspace name" />
            <div className="text-xs text-red-500">
              {state?.issues?.find((e) => e.path.includes('name'))?.message}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="shortName">Short Name</Label>
            <Input
              id="shortName"
              name="shortName"
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
              className="min-h-[100px]"
            />
            <div className="text-xs text-red-500">
              {
                state?.issues?.find((e) => e.path.includes('description'))
                  ?.message
              }
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ownerId">Owner ID</Label>
            <Input id="ownerId" name="ownerId" placeholder="Enter owner ID" />
            <div className="text-xs text-red-500">
              {state?.issues?.find((e) => e.path.includes('ownerId'))?.message}
            </div>
          </div>
          <div className="grid gap-2">
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
          <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="Enter tags separated by commas"
            />
            <div className="text-xs text-red-500">
              {state?.issues?.find((e) => e.path.includes('tags'))?.message}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tenantId">Tenant ID</Label>
            <Input
              id="tenantId"
              name="tenantId"
              placeholder="Enter tenant ID"
              defaultValue={1}
            />
            <div className="text-xs text-red-500">
              {state?.issues?.find((e) => e.path.includes('tenantId'))?.message}
            </div>
          </div>
          <p aria-live="polite" className="sr-only" role="status">
            {state?.data}
          </p>
          {state?.error && <p className="text-red-500">{state.error}</p>}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  )
}
