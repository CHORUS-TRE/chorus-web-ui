'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, LayoutGrid } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from '@/components/hooks/use-toast'
import { Link } from '@/components/link'
import { useAppState } from '@/stores/app-state-store'
import { appGet, appUpdate } from '@/view-model/app-view-model'
import { Button } from '~/components/button'
import { PRESETS, type Presets } from '~/components/forms/app-create-dialog'
import { ImageUploadField } from '~/components/forms/image-upload-field'
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
import { App, AppState, AppUpdateSchema, Result } from '~/domain/model'

type FormData = z.infer<typeof AppUpdateSchema>
type FormFieldName = keyof FormData

export default function AppEditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { refreshApps } = useAppState()
  const [app, setApp] = useState<App | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(AppUpdateSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    async function fetchApp() {
      try {
        const result = await appGet(id)
        if (result.data) {
          setApp(result.data)
          form.reset({
            name: result.data.name || '',
            description: result.data.description || '',
            status: result.data.status || AppState.ACTIVE,
            dockerImageName: result.data.dockerImageName || '',
            dockerImageTag: result.data.dockerImageTag || '',
            dockerImageRegistry: result.data.dockerImageRegistry || '',
            shmSize: result.data.shmSize || '',
            minEphemeralStorage: result.data.minEphemeralStorage || '',
            maxEphemeralStorage: result.data.maxEphemeralStorage || '',
            kioskConfigURL: result.data.kioskConfigURL || '',
            maxCPU: result.data.maxCPU || '',
            minCPU: result.data.minCPU || '',
            maxMemory: result.data.maxMemory || '',
            minMemory: result.data.minMemory || '',
            tenantId: result.data.tenantId || '',
            userId: result.data.userId || '',
            preset: 'auto',
            iconURL: result.data.iconURL || ''
          })
        } else if (result.error) {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive'
          })
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchApp()
  }, [id, form])

  useEffect(() => {
    if (form.formState.errors) {
      console.error('AppEditPage form errors:', form.formState.errors)
    }
  }, [form.formState.errors])

  async function onSubmit(data: FormData) {
    try {
      const formData = new FormData()
      const completeData = { ...data, id }

      Object.entries(completeData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })

      const result = await appUpdate({} as Result<App>, formData)

      if (result.issues) {
        result.issues.forEach((issue) => {
          form.setError(issue.path[0] as FormFieldName, {
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
          description: 'App updated successfully'
        })
        await refreshApps()
        router.push('/admin/app-store')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Application not found.
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/admin/app-store')}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <LayoutGrid className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Edit {app.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Modify the configuration for this application.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Application Details</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide Advanced Settings' : 'Advanced Settings'}
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <input type="hidden" {...form.register('id')} />
            <input type="hidden" {...form.register('tenantId')} />
            <input type="hidden" {...form.register('userId')} />
            <input type="hidden" {...form.register('status')} />
            <div
              className={`grid gap-8 ${showAdvanced ? 'md:grid-cols-2' : 'grid-cols-1'}`}
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter app name" />
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
                        <Input {...field} placeholder="Enter description" />
                      </FormControl>
                      <FormMessage />
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
                      error={form.formState.errors.iconURL?.message}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="dockerImageRegistry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Docker Image Registry</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., docker.io" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dockerImageName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Docker Image</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., nginx" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dockerImageTag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Tag</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., latest" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {showAdvanced && (
                <div className="space-y-4 md:border-l md:pl-8">
                  <FormField
                    control={form.control}
                    name="kioskConfigURL"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kiosk Config URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter kiosk config URL"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 rounded-md border bg-muted/30 p-4">
                    <FormField
                      control={form.control}
                      name="preset"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resource Preset</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              if (value) {
                                const preset = PRESETS[value as keyof Presets]
                                if (value === 'auto') {
                                  // Keep current values or clear if needed
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
                            <SelectTrigger>
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
                                return (
                                  <SelectItem key={preset} value={preset}>
                                    {`${displayName} (cpu: ${presetData.requests.cpu}, mem: ${presetData.requests.memory})`}
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
                          <FormLabel>Shared Memory Size</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 64m" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="minEphemeralStorage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min Storage</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 1Gi" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maxEphemeralStorage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Storage</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 2Gi" />
                            </FormControl>
                            <FormMessage />
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
                            <FormLabel>Min CPU</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 1" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maxCPU"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max CPU</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 2" />
                            </FormControl>
                            <FormMessage />
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
                            <FormLabel>Min Memory</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 1Gi" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maxMemory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Memory</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 2Gi" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t pt-6 font-semibold">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/app-store')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
