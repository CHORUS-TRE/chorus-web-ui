'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
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
import { App } from '~/domain/model'

import { appUpdate } from './actions/app-view-model'
import { IFormState } from './actions/utils'
import { formSchema, PRESETS, type Presets } from './app-create-dialog'
import { ImageUploadField } from './image-upload-field'

interface AppEditDialogProps {
  app: App
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

type FormData = z.infer<typeof formSchema>
type FormFieldName = keyof FormData

export const AppEditDialog: React.FC<AppEditDialogProps> = ({
  app,
  open,
  onOpenChange,
  onSuccess
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: app.name || '',
      description: app.description || '',
      dockerImageName: app.dockerImageName || '',
      dockerImageTag: app.dockerImageTag || '',
      dockerImageRegistry: app.dockerImageRegistry || '',
      shmSize: app.shmSize || '',
      minEphemeralStorage: app.minEphemeralStorage || '',
      maxEphemeralStorage: app.maxEphemeralStorage || '',
      kioskConfigURL: app.kioskConfigURL || '',
      maxCPU: app.maxCPU || '',
      minCPU: app.minCPU || '',
      maxMemory: app.maxMemory || '',
      minMemory: app.minMemory || '',
      tenantId: app.tenantId || '',
      ownerId: app.ownerId || '',
      preset: 'auto',
      iconURL: app.iconURL || ''
    },
    mode: 'onChange'
  })

  const { formState } = form
  const isSubmitting = formState.isSubmitting

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  useEffect(() => {
    if (!form.formState.isDirty && !form.formState.isSubmitting) {
      form.reset({
        name: app.name || '',
        description: app.description || '',
        dockerImageName: app.dockerImageName || '',
        dockerImageTag: app.dockerImageTag || '',
        dockerImageRegistry: app.dockerImageRegistry || '',
        shmSize: app.shmSize || '',
        minEphemeralStorage: app.minEphemeralStorage || '',
        maxEphemeralStorage: app.maxEphemeralStorage || '',
        kioskConfigURL: app.kioskConfigURL || '',
        maxCPU: app.maxCPU || '',
        minCPU: app.minCPU || '',
        maxMemory: app.maxMemory || '',
        minMemory: app.minMemory || '',
        tenantId: app.tenantId || '',
        ownerId: app.ownerId || '',
        preset: 'auto',
        iconURL: app.iconURL || ''
      })
    }
  }, [app, form])

  async function onSubmit(data: FormData) {

    try {
      const formData = new FormData()
      formData.append('id', app.id)
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      const result = await appUpdate({} as IFormState, formData)
      //wait for 300ms
      await new Promise((resolve) => setTimeout(resolve, 300))

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
        onSuccess()
        onOpenChange(false)
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
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred'
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`bg-background ${showAdvanced ? 'max-w-[800px]' : 'max-w-[400px]'}`}
      >
        <DialogHeader>
          <div className="flex flex-row items-center justify-between">
            <DialogTitle className="text-white">Edit App Details</DialogTitle>
            <Link
              href="#"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex w-max items-center justify-center border-b-2 border-accent bg-transparent text-sm text-muted transition-colors hover:border-b-2 hover:border-accent hover:text-accent data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
              prefetch={false}
            >
              {showAdvanced ? 'Hide Advanced Settings' : 'Advanced Settings'}
            </Link>
          </div>
          <DialogDescription className="text-muted-foreground">
            Make changes to your app details here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...form.register('tenantId')} />
            <input type="hidden" {...form.register('ownerId')} />
            <div
              className={`grid gap-8 ${showAdvanced ? 'grid-cols-2' : 'grid-cols-1'}`}
            >
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
                    <ImageUploadField
                      value={field.value || ''}
                      onChange={field.onChange}
                      error={formState.errors.iconURL?.message}
                    />
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

              {showAdvanced && (
                <div className="space-y-4 border-l border-gray-400 pl-8">
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

                  <div className="space-y-4 rounded-md border border-gray-400 p-4">
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
                                  form.setValue('minEphemeralStorage', '')
                                  form.setValue('maxEphemeralStorage', '')
                                } else {
                                  form.setValue('minCPU', preset.requests.cpu)
                                  form.setValue('maxCPU', preset.limits.cpu)
                                  form.setValue(
                                    'minMemory',
                                    preset.requests.memory
                                  )
                                  form.setValue(
                                    'maxMemory',
                                    preset.limits.memory
                                  )
                                  form.setValue('shmSize', preset.requests.shm)
                                  form.setValue(
                                    'minEphemeralStorage',
                                    preset.requests.ephemeralStorage
                                  )
                                  form.setValue(
                                    'maxEphemeralStorage',
                                    preset.limits.ephemeralStorage
                                  )
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
                                  preset.charAt(0).toUpperCase() +
                                  preset.slice(1)

                                if (preset === 'auto') {
                                  return (
                                    <SelectItem key={preset} value={preset}>
                                      {`${displayName} (custom values)`}
                                    </SelectItem>
                                  )
                                }

                                const cpuRange = `${presetData.requests.cpu}-${presetData.limits.cpu}`
                                const memoryRange = `${presetData.requests.memory}-${presetData.limits.memory}`

                                return (
                                  <SelectItem key={preset} value={preset}>
                                    {`${displayName} (cpu: ${cpuRange}, mem: ${memoryRange})`}
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
                        name="minEphemeralStorage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Min Ephemeral Storage
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
                        name="maxEphemeralStorage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Max Ephemeral Storage
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

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="minCPU"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Min CPU
                            </FormLabel>
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
                            <FormLabel className="text-white">
                              Max CPU
                            </FormLabel>
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
              )}
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
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
