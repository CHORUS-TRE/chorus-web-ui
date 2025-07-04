'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { startTransition, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ZodIssue } from 'zod'

import { workbenchUpdate } from '@/components/actions/workbench-view-model'
import {
  Dialog as DialogContainer,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Workbench,
  WorkbenchUpdateSchema,
  WorkbenchUpdateType
} from '@/domain/model'
import { Button } from '~/components/button'
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

  useEffect(() => {
    if (open) {
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
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, String(value))
    })

    startTransition(async () => {
      const result = await workbenchUpdate({}, formData)

      if (result.issues) {
        result.issues.forEach((issue: ZodIssue) => {
          form.setError(issue.path[0] as keyof WorkbenchUpdateType, {
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
          description: 'Session updated successfully'
        })
        if (onSuccess) onSuccess(result.data)
        setOpen(false)
      }
    })
  }

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-background text-white">
        <DialogHeader>
          <DialogTitle>Edit Session</DialogTitle>
          <DialogDescription>
            Make changes to your session here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="w-full max-w-md border-none bg-background text-white">
              <CardContent className="grid gap-4">
                <input type="hidden" {...form.register('id')} />
                <input type="hidden" {...form.register('tenantId')} />
                <input type="hidden" {...form.register('userId')} />
                <input type="hidden" {...form.register('workspaceId')} />
                <input
                  type="hidden"
                  {...form.register('initialResolutionWidth')}
                />
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
                        <Input {...field} />
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
                        <Textarea {...field} className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </DialogContent>
    </DialogContainer>
  )
}
