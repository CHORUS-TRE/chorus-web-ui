'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '~/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { App } from '~/domain/model'

import { appUpdate } from './actions/app-view-model'
import { IFormState } from './actions/utils'
import { formSchema } from './app-create-dialog'

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
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: app.name || '',
      description: app.description || '',
      dockerImageName: app.dockerImageName || '',
      dockerImageTag: app.dockerImageTag || '',
      dockerImageRegistry: app.dockerImageRegistry || '',
      shmSize: app.shmSize || '',
      kioskConfigURL: app.kioskConfigURL || '',
      maxCPU: app.maxCPU || '10m',
      minCPU: app.minCPU || '500m',
      maxMemory: app.maxMemory || '64Mi',
      minMemory: app.minMemory || '128Mi',
      tenantId: app.tenantId || '',
      ownerId: app.ownerId || ''
    },
    mode: 'onChange'
  })

  const { formState } = form
  // const isSubmitting = formState.isSubmitting

  // Reset form when app changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: app.name,
        description: app.description,
        dockerImageName: app.dockerImageName,
        dockerImageTag: app.dockerImageTag,
        dockerImageRegistry: app.dockerImageRegistry,
        shmSize: app.shmSize,
        kioskConfigURL: app.kioskConfigURL,
        maxCPU: app.maxCPU,
        minCPU: app.minCPU,
        maxMemory: app.maxMemory,
        minMemory: app.minMemory,
        tenantId: app.tenantId,
        ownerId: app.ownerId
      })
    }
  }, [app, form, open])

  async function onSubmit(data: FormData) {
    try {
      const formData = new FormData()
      formData.append('id', app.id)
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      const result = await appUpdate({} as IFormState, formData)

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
      form.setError('root', {
        type: 'server',
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred'
      })
    }
  }

  const handleSave = () => {
    form.handleSubmit(onSubmit)()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle className="text-white">Edit App Details</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Make changes to your app details here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
                        <FormLabel className="text-white">
                          Description
                        </FormLabel>
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
                          <FormLabel className="text-white">
                            Image Tag
                          </FormLabel>
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

              {formState.errors.root && (
                <p className="text-sm text-destructive">
                  {formState.errors.root.message}
                </p>
              )}
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
