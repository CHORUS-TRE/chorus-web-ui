'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, RefreshCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import { ZodIssue } from 'zod'

import { errorToast } from '@/components/error-toast'
import { DisplayTab } from '@/components/forms/session-settings/display-tab'
import { SessionActions } from '@/components/forms/session-settings/session-actions'
import { SessionTab } from '@/components/forms/session-settings/session-tab'
import { TransferTab } from '@/components/forms/session-settings/transfer-tab'
import { useSessionSettings } from '@/components/hooks/use-session-settings'
import { Button } from '@/components/ui/button'
import {
  Dialog as DialogContainer,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  INIT_SETTING_KEYS,
  Workbench,
  WorkbenchUpdateSchema,
  WorkbenchUpdateType
} from '@/domain/model'
import { workbenchUpdate } from '@/view-model/workbench-view-model'

import { toast } from '../hooks/use-toast'

export function WorkbenchUpdateForm({
  state: [open, setOpen],
  workbench,
  onSuccess
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  workbench: Workbench
  onSuccess?: (workbench: Workbench) => void
}) {
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

  const prevOpenRef = useRef(false)

  // Only reset form when the dialog transitions from closed to open,
  // not when workbench prop changes due to polling while the dialog is open
  useEffect(() => {
    const wasOpen = prevOpenRef.current
    prevOpenRef.current = open

    if (open && !wasOpen) {
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

  const sessionId = workbench.id ?? ''
  const { settings } = useSessionSettings(sessionId)

  // Snapshot of the init settings as they were when the dialog opened, so the
  // warning reflects what *this* editing session will cost. Computed during
  // render (React's documented "adjust state while rendering" pattern —
  // see https://react.dev/reference/react/useState#storing-information-from-previous-renders)
  // rather than in a useEffect: an effect runs after paint, so on reopen
  // there would be one painted frame where `openedWith` still held the
  // previous cycle's settings while `settings` already reflected changes
  // persisted (to localStorage) before Cancel — a false-positive warning
  // flash. The previous `open` value is tracked in state, not a ref
  // (per the React docs' own recommendation for this pattern), so this
  // stays clear of both the pre-existing reset effect's `prevOpenRef` and
  // of `react-hooks/refs`, which flags reading/writing a ref's `.current`
  // during render.
  // Note: the effect-based version's defect (stale value for one paint
  // before the effect corrected it) can't be regression-tested under RTL —
  // act() flushes effects synchronously, collapsing that gap — so
  // correctness here rests on this render-time pattern itself, not on a test.
  const [openedWith, setOpenedWith] = useState(settings)
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setOpenedWith(settings)
    }
  }

  const willReconnect = INIT_SETTING_KEYS.some(
    (key) => settings[key] !== openedWith[key]
  )

  async function onSubmit(data: WorkbenchUpdateType) {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })

      const result = await workbenchUpdate({}, formData)

      if (result.issues) {
        result.issues.forEach((issue: ZodIssue) => {
          form.setError(issue.path[0] as keyof WorkbenchUpdateType, {
            type: 'server',
            message: issue.message
          })
        })
        toast({
          title: 'Validation Error',
          description: 'Please check the form for errors.',
          variant: 'destructive'
        })
        return
      }

      if (result.error) {
        toast({
          title: 'Error',
          ...errorToast(result.error),
          variant: 'destructive'
        })
        return
      }

      if (result.data) {
        toast({
          title: 'Success',
          description: 'Session updated successfully'
        })
        if (onSuccess) onSuccess(result.data)
        setOpen(false)
      }
    } catch (err) {
      console.error('Submission error:', err)
      toast({
        title: 'Error',
        description: 'An unexpected error occurred during submission.',
        variant: 'destructive'
      })
    }
  }

  const onInvalid = (errors: FieldErrors<WorkbenchUpdateType>) => {
    console.error('Form validation errors:', errors)
    toast({
      title: 'Form Error',
      description: 'Some required fields are missing or invalid.',
      variant: 'destructive'
    })
  }

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-background sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Session Settings
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Make changes to your session here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-4"
          >
            <input type="hidden" {...form.register('id')} />
            <input type="hidden" {...form.register('tenantId')} />
            <input type="hidden" {...form.register('userId')} />
            <input type="hidden" {...form.register('workspaceId')} />
            <input type="hidden" {...form.register('initialResolutionWidth')} />
            <input
              type="hidden"
              {...form.register('initialResolutionHeight')}
            />
            <input type="hidden" {...form.register('status')} />

            <Tabs defaultValue="session">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="session">Session</TabsTrigger>
                <TabsTrigger value="display">Display</TabsTrigger>
                <TabsTrigger value="transfer">Transfer</TabsTrigger>
              </TabsList>

              <TabsContent value="session" className="pt-4">
                <SessionTab form={form} />
              </TabsContent>

              <TabsContent value="display" className="pt-4">
                <DisplayTab sessionId={workbench.id ?? ''} />
              </TabsContent>

              <TabsContent value="transfer" className="pt-4">
                <TransferTab sessionId={workbench.id ?? ''} />
              </TabsContent>
            </Tabs>

            <SessionActions sessionId={workbench.id ?? ''} />

            {willReconnect && (
              <p className="flex items-center gap-2 rounded-md bg-muted/50 p-2 text-[11px] text-muted-foreground">
                <RefreshCw className="h-3 w-3" />
                Reconnects the session on save — running applications are not
                affected.
              </p>
            )}

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </DialogContainer>
  )
}
