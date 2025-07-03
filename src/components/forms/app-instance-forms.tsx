'use client'

import { Loader2 } from 'lucide-react'
import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { z } from 'zod'

import { createAppInstance } from '@/components/actions/app-instance-view-model'
import { useAppState } from '@/components/store/app-state-context'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Dialog as DialogContainer,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { AppInstance, Result } from '~/domain/model'

import { toast } from '../hooks/use-toast'

const initialState: Result<AppInstance> = {
  data: undefined,
  issues: undefined
}

export function AppInstanceCreateForm({
  state: [open, setOpen],
  workspaceId,
  sessionId,
  userId,
  onUpdate
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  workspaceId?: string
  sessionId?: string
  userId?: string
  onUpdate?: () => void
}) {
  const [state, formAction] = useActionState(createAppInstance, initialState)
  const { apps } = useAppState()

  useEffect(() => {
    if (state.error) {
      toast({
        title: 'Error',
        description: state.error,
        variant: 'destructive'
      })
    }
    if (state.data && !state.issues) {
      setOpen(false)
      onUpdate?.()
    }
  }, [state, setOpen, onUpdate])

  function SubmitButton() {
    const { pending } = useFormStatus()
    return (
      <Button className="ml-auto" type="submit" disabled={pending}>
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {pending ? 'Starting...' : 'Start'}
      </Button>
    )
  }

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogTitle className="hidden">Start App</DialogTitle>
        <DialogHeader>
          <DialogDescription asChild>
            <form action={formAction}>
              <Card className="w-full max-w-md border-none bg-background text-white">
                <CardHeader className="pb-4">
                  <CardTitle>Start App</CardTitle>
                  <CardDescription>
                    Select an app to launch in the current session.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="appId">App</Label>
                    <select
                      name="appId"
                      id="appId"
                      className="bg-background text-white"
                      required
                    >
                      <option value="">Choose an app</option>
                      {apps?.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.name}
                        </option>
                      ))}
                    </select>
                    <div className="text-xs text-red-500">
                      {
                        state.issues?.find((e: z.ZodIssue) =>
                          e.path.includes('appId')
                        )?.message
                      }
                    </div>
                  </div>
                  <input
                    type="hidden"
                    name="workspaceId"
                    defaultValue={workspaceId || ''}
                  />
                  <input
                    type="hidden"
                    name="workbenchId"
                    defaultValue={sessionId || ''}
                  />
                  <input
                    type="hidden"
                    name="userId"
                    defaultValue={userId || ''}
                  />
                  <input type="hidden" name="tenantId" defaultValue={'1'} />
                  <input type="hidden" name="status" defaultValue={'active'} />

                  {state.error && <p className="text-red-500">{state.error}</p>}
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
