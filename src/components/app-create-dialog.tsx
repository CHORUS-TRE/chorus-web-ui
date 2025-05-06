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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { AppType } from '~/domain/model'

import { appCreate } from './actions/app-view-model'
import { IFormState } from './actions/utils'
import { useAuth } from './store/auth-context'

export type ResourcePreset = {
  requests: {
    cpu: string
    memory: string
    shm: string
  }
  limits: {
    cpu: string
    memory: string
    shm: string
  }
}

export type Presets = {
  auto: ResourcePreset
  nano: ResourcePreset
  micro: ResourcePreset
  small: ResourcePreset
  medium: ResourcePreset
  large: ResourcePreset
  xlarge: ResourcePreset
  '2xlarge': ResourcePreset
}

export const PRESETS: Presets = {
  auto: {
    requests: { cpu: '', memory: '', shm: '' },
    limits: { cpu: '', memory: '', shm: '' }
  },
  nano: {
    requests: { cpu: '100m', memory: '128Mi', shm: '' },
    limits: { cpu: '150m', memory: '192Mi', shm: '2Gi' }
  },
  micro: {
    requests: { cpu: '250m', memory: '256Mi', shm: '' },
    limits: { cpu: '375m', memory: '384Mi', shm: '2Gi' }
  },
  small: {
    requests: { cpu: '500m', memory: '512Mi', shm: '' },
    limits: { cpu: '750m', memory: '768Mi', shm: '' }
  },
  medium: {
    requests: { cpu: '500m', memory: '1024Mi', shm: '' },
    limits: { cpu: '750m', memory: '1536Mi', shm: '' }
  },
  large: {
    requests: { cpu: '1.0', memory: '2048Mi', shm: '' },
    limits: { cpu: '1.5', memory: '3072Mi', shm: '' }
  },
  xlarge: {
    requests: { cpu: '1.0', memory: '3072Mi', shm: '' },
    limits: { cpu: '3.0', memory: '6144Mi', shm: '' }
  },
  '2xlarge': {
    requests: { cpu: '1.0', memory: '3072Mi', shm: '' },
    limits: { cpu: '6.0', memory: '12288Mi', shm: '' }
  }
}

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
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d+)?(Mi|Gi|M|G)$/.test(val),
      'Must be a number followed by Mi, Gi, M, or G (e.g., 128Mi, 1Gi)'
    ),
  kioskConfigURL: z.string().optional(),
  maxCPU: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d+)?(m)?$/.test(val),
      'Must be a number followed by m (e.g., 500m) or no unit (e.g., 1)'
    ),
  minCPU: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d+)?(m)?$/.test(val),
      'Must be a number followed by m (e.g., 500m) or no unit (e.g., 1)'
    ),
  maxMemory: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d+)?(Mi|Gi|M|G)$/.test(val),
      'Must be a number followed by Mi, Gi, M, or G (e.g., 128Mi, 1Gi)'
    ),
  minMemory: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+(\.\d+)?(Mi|Gi|M|G)$/.test(val),
      'Must be a number followed by Mi, Gi, M, or G (e.g., 128Mi, 1Gi)'
    ),
  tenantId: z.string().min(1, 'Tenant ID is required'),
  ownerId: z.string().min(1, 'Owner ID is required'),
  preset: z.string().optional(),
  iconURL: z.string().url('Must be a valid URL').optional()
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
      shmSize: '',
      kioskConfigURL: '',
      maxCPU: '',
      minCPU: '',
      maxMemory: '',
      minMemory: '',
      tenantId: '1',
      ownerId: '',
      preset: 'auto',
      iconURL: ''
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
                  name="iconURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Icon URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter icon URL"
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

              <div className="space-y-4 border-l border-gray-400 pl-8">
                <h3 className="text-sm font-semibold text-muted">
                  Advanced Settings
                </h3>
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

                <div className="rounded-md border border-gray-400 p-4">
                  <FormField
                    control={form.control}
                    name="preset"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Resource Preset
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            if (value) {
                              const preset = PRESETS[value as keyof Presets]
                              if (value === 'auto') {
                                // Clear all resource fields
                                form.setValue('minCPU', '')
                                form.setValue('maxCPU', '')
                                form.setValue('minMemory', '')
                                form.setValue('maxMemory', '')
                                form.setValue('shmSize', '')
                              } else {
                                // Set CPU values - min from requests, max from limits
                                form.setValue('minCPU', preset.requests.cpu)
                                form.setValue('maxCPU', preset.limits.cpu)
                                // Set Memory values - min from requests, max from limits
                                form.setValue(
                                  'minMemory',
                                  preset.requests.memory
                                )
                                form.setValue('maxMemory', preset.limits.memory)
                                // Set Shared Memory (shmSize) from shm
                                form.setValue('shmSize', preset.requests.shm)
                              }
                            }
                          }}
                        >
                          <SelectTrigger className="bg-background text-white placeholder:text-muted-foreground">
                            <SelectValue placeholder="Select a preset" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(PRESETS).map((preset) => {
                              const presetData =
                                PRESETS[preset as keyof Presets]
                              const displayName =
                                preset.charAt(0).toUpperCase() + preset.slice(1)

                              if (preset === 'auto') {
                                return (
                                  <SelectItem key={preset} value={preset}>
                                    {`${displayName} (custom values)`}
                                  </SelectItem>
                                )
                              }

                              const cpuRange = `${presetData.requests.cpu}-${presetData.limits.cpu}`
                              const memoryRange = `${presetData.requests.memory}-${presetData.limits.memory}`
                              const shm = presetData.requests.shm

                              return (
                                <SelectItem key={preset} value={preset}>
                                  {`${displayName} (cpu: ${cpuRange}, mem: ${memoryRange}, shm: ${shm})`}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
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
                          <FormLabel className="text-white">
                            Min Memory
                          </FormLabel>
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
                          <FormLabel className="text-white">
                            Max Memory
                          </FormLabel>
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
