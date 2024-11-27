'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '~/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { AppType } from '~/domain/model'

import { appCreate } from './actions/app-view-model'
import { IFormState } from './actions/utils'

interface AppCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  defaultType: AppType
}

// Create a form schema that matches our needs
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  dockerImageName: z.string().min(1, 'Docker image name is required'),
  dockerImageTag: z.string().min(1, 'Docker image tag is required'),
  type: z.string(),
  tenantId: z.string(),
  ownerId: z.string()
})

type FormData = z.infer<typeof formSchema>

export function AppCreateDialog({
  open,
  onOpenChange,
  onSuccess,
  defaultType
}: AppCreateDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      dockerImageName: '',
      dockerImageTag: '',
      type: defaultType,
      tenantId: '1',
      ownerId: '1'
    },
    mode: 'onChange'
  })

  const { formState } = form
  const isSubmitting = formState.isSubmitting
  const isValid = formState.isValid

  async function onSubmit(data: FormData) {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      const result = await appCreate({} as IFormState, formData)
      if (result.data) {
        onOpenChange(false)
        onSuccess()
        form.reset()
      } else if (result.error) {
        form.setError('root', {
          type: 'server',
          message: result.error
        })
      }
    } catch (error) {
      form.setError('root', {
        type: 'server',
        message: 'An unexpected error occurred'
      })
    }
  }

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background">
        <DialogHeader>
          <DialogTitle className="text-white">Create New App</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new application to the store
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter app name"
                      className="bg-background text-white placeholder:text-muted-foreground"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter description"
                      className="bg-background text-white placeholder:text-muted-foreground"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dockerImageName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Docker Image</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., nginx"
                      className="bg-background text-white placeholder:text-muted-foreground"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dockerImageTag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Image Tag</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., latest"
                      className="bg-background text-white placeholder:text-muted-foreground"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />

            <input
              type="hidden"
              {...form.register('type')}
              value={defaultType}
            />
            <input type="hidden" {...form.register('tenantId')} value="1" />
            <input type="hidden" {...form.register('ownerId')} value="1" />

            {formState.errors.root && (
              <p className="text-sm text-destructive">
                {formState.errors.root.message}
              </p>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false)
                  form.reset()
                }}
                className="bg-background text-white"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
