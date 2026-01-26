'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CirclePlus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { startTransition, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ZodIssue } from 'zod'

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
  WorkbenchStatus
} from '@/domain/model'
import { workbenchCreate } from '@/view-model/workbench-view-model'
import { Button } from '~/components/button'
import { Card, CardContent, CardFooter } from '~/components/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'

import { useAuthentication } from '@/providers/authentication-provider'
import { useAppState } from '@/stores/app-state-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { toast } from '../hooks/use-toast'
import { Textarea } from '../ui/textarea'

const DEFAULT_VIEWPORT = {
  width: 1080,
  height: 608 // 1080 * (9/16) for 16:9 aspect ratio
}

export function WorkbenchCreateForm({
  workspaceId: initialWorkspaceId,
  workspaceName,
  userId,
  onSuccess,
  openOnStart = false
}: {
  workspaceId?: string
  workspaceName?: string
  userId?: string
  onSuccess?: (workbench: Workbench) => void
  openOnStart?: boolean
}) {
  const [open, setOpen] = useState(openOnStart)
  const [isCreating, setIsCreating] = useState(false)
  const [viewportDimensions, setViewportDimensions] = useState(DEFAULT_VIEWPORT)
  const router = useRouter()
  const { workspaces } = useAppState()
  const { user } = useAuthentication()

  const myWorkspaces = useMemo(() => {
    return workspaces?.filter((workspace) => {
      const isOwner = workspace.userId === user?.id
      const isMember = user?.rolesWithContext?.some(
        (role) => role.context.workspace === workspace.id
      )
      return isOwner || isMember
    })
  }, [workspaces, user])

  const form = useForm<WorkbenchCreateType>({
    resolver: zodResolver(WorkbenchCreateSchema),
    defaultValues: {
      name: workspaceName ? `${workspaceName}-session` : 'new-session',
      workspaceId: initialWorkspaceId || '',
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
      width: Math.floor(
        window?.visualViewport?.width || DEFAULT_VIEWPORT.width
      ),
      height: Math.floor(
        window?.visualViewport?.height || DEFAULT_VIEWPORT.height
      )
    })

    const updateDimensions = () => {
      setViewportDimensions({
        width: Math.floor(
          window?.visualViewport?.width || DEFAULT_VIEWPORT.width
        ),
        height: Math.floor(
          window?.visualViewport?.height || DEFAULT_VIEWPORT.height
        )
      })
    }
    window?.visualViewport?.addEventListener('resize', updateDimensions)
    return () =>
      window?.visualViewport?.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (open) {
      form.reset({
        name: workspaceName ? `${workspaceName}-session` : 'new-session',
        workspaceId: initialWorkspaceId || form.getValues('workspaceId') || '',
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
    initialWorkspaceId,
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

    setIsCreating(true)
    startTransition(async () => {
      const result = await workbenchCreate({}, formData)
      setIsCreating(false)

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
          description: `Session is creating. Redirecting to session...`
        })
        setOpen(false)

        router.push(
          `/workspaces/${data.workspaceId}/sessions/${result.data.id as string}`
        )
        await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait for the backend cache to be updated
        if (onSuccess) onSuccess(result.data)
      }
    })
  }

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="accent-filled" type="button" disabled={isCreating}>
          <CirclePlus className="h-4 w-4" />
          {isCreating ? 'Creating...' : 'Create session'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background">
        <DialogHeader>
          <DialogTitle>Create Session</DialogTitle>
          <DialogDescription>Create a new session.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="w-full max-w-md border-none bg-background">
              <CardContent className="grid gap-4">
                <input
                  type="hidden"
                  {...form.register('initialResolutionWidth')}
                />
                <input
                  type="hidden"
                  {...form.register('initialResolutionHeight')}
                />
                <input type="hidden" {...form.register('userId')} />
                <input type="hidden" {...form.register('tenantId')} />
                <input type="hidden" {...form.register('status')} />

                <FormField
                  control={form.control}
                  name="workspaceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!!initialWorkspaceId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a workspace" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {myWorkspaces && myWorkspaces.length > 0 ? (
                            myWorkspaces.map((workspace) => (
                              <SelectItem key={workspace.id} value={workspace.id}>
                                {workspace.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No available workspace
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                <Button className="ml-auto" type="submit" disabled={isCreating}>
                  {isCreating && (
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
