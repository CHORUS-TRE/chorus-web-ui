'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import { ZodIssue } from 'zod'

import {
  Dialog as DialogContainer,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Workbench,
  WorkbenchUpdateSchema,
  WorkbenchUpdateType
} from '@/domain/model'
import { workbenchUpdate } from '@/view-model/workbench-view-model'
import { Button } from '~/components/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'

import { toast } from '../hooks/use-toast'
import { Textarea } from '../ui/textarea'

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
          description: result.error,
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
      <DialogContent className="bg-background sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Session</DialogTitle>
          <DialogDescription>
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

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Session name" />
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
                      className="min-h-[100px] resize-none"
                      placeholder="Session description (optional)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
