'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
import { useAuth } from './store/auth-context'

interface AppCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  defaultType: AppType
}

// Create a form schema that matches our needs
export const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  dockerImageName: z.string().min(1, 'Docker image name is required'),
  dockerImageTag: z.string().min(1, 'Docker image tag is required'),
  dockerImageRegistry: z.string().optional(),
  shmSize: z
    .string()
    .regex(/^\d+[mMgG]$/, 'Must be a number followed by m or g (e.g., 64m, 2g)')
    .optional(),
  kioskConfigURL: z.string().optional(),
  maxCPU: z
    .string()
    .regex(
      /^\d+(\.\d+)?(m)?$/,
      'Must be a number followed by m (e.g., 500m) or no unit (e.g., 1)'
    )
    .optional(),
  minCPU: z
    .string()
    .regex(
      /^\d+(\.\d+)?(m)?$/,
      'Must be a number followed by m (e.g., 500m) or no unit (e.g., 1)'
    )
    .optional(),
  maxMemory: z
    .string()
    .regex(
      /^\d+(\.\d+)?(Mi|Gi|M|G)$/,
      'Must be a number followed by Mi, Gi, M, or G (e.g., 128Mi, 1Gi)'
    )
    .optional(),
  minMemory: z
    .string()
    .regex(
      /^\d+(\.\d+)?(Mi|Gi|M|G)$/,
      'Must be a number followed by Mi, Gi, M, or G (e.g., 128Mi, 1Gi)'
    )
    .optional(),
  tenantId: z.string().min(1, 'Tenant ID is required'),
  ownerId: z.string().min(1, 'Owner ID is required')
})

type FormData = z.infer<typeof formSchema>
type FormFieldName = keyof FormData

export function AppCreateDialog({
  open,
  onOpenChange,
  onSuccess
}: AppCreateDialogProps) {
  const { user } = useAuth()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      dockerImageName: '',
      dockerImageTag: '',
      dockerImageRegistry: '',
      shmSize: '8m',
      kioskConfigURL: '',
      maxCPU: '500m',
      minCPU: '10m',
      maxMemory: '128Mi',
      minMemory: '64Mi',
      tenantId: '1',
      ownerId: ''
    },
    mode: 'onChange'
  })

  const { formState } = form
  const isSubmitting = formState.isSubmitting

  async function onSubmit(data: FormData) {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      const result = await appCreate({} as IFormState, formData)

      if (result.issues) {
        result.issues.forEach((issue) => {
          form.setError(issue.path[0] as FormFieldName, {
            type: 'server',
            message: issue.message
          })
        })
        return
      }

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
      console.error('App creation error:', error)
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

  useEffect(() => {
    if (user) {
      form.setValue('ownerId', user.id)
    }
  }, [user, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle className="text-white">Create New App</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new application to the store
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...form.register('tenantId')} />
            <input type="hidden" {...form.register('ownerId')} />
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
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
                  name="dockerImageRegistry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Docker Image Registry
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., docker.io"
                          className="bg-background text-white placeholder:text-muted-foreground"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dockerImageName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Docker Image
                        </FormLabel>
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
                </div>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="kioskConfigURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Kiosk Config URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter kiosk config URL"
                          className="bg-background text-white placeholder:text-muted-foreground"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shmSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">
                        Shared Memory Size
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., 64m"
                          className="bg-background text-white placeholder:text-muted-foreground"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minCPU"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Min CPU</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., 1"
                            className="bg-background text-white placeholder:text-muted-foreground"
                          />
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxCPU"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Max CPU</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., 2"
                            className="bg-background text-white placeholder:text-muted-foreground"
                          />
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minMemory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Min Memory</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., 1Gi"
                            className="bg-background text-white placeholder:text-muted-foreground"
                          />
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxMemory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Max Memory</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., 2Gi"
                            className="bg-background text-white placeholder:text-muted-foreground"
                          />
                        </FormControl>
                        <FormMessage className="text-destructive" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

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
