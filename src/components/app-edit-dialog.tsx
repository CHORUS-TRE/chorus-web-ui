'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
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

interface AppEditDialogProps {
  app: App
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

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
      type: app.type,
      tenantId: app.tenantId,
      ownerId: app.ownerId
    },
    mode: 'onChange'
  })

  const { formState } = form
  // const isSubmitting = formState.isSubmitting

  // Reset form when app changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: app.name || '',
        description: app.description || '',
        dockerImageName: app.dockerImageName || '',
        dockerImageTag: app.dockerImageTag || '',
        type: app.type,
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
      console.error('App update error:', error)
      form.setError('root', {
        type: 'server',
        message: 'An unexpected error occurred'
      })
    }
  }

  const handleSave = () => {
    onSubmit(form.getValues())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit App Details</DialogTitle>
          <DialogDescription>
            Make changes to your app details here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
                value={app.type}
              />
              <input
                type="hidden"
                {...form.register('tenantId')}
                value={app.tenantId}
              />
              <input
                type="hidden"
                {...form.register('ownerId')}
                value={app.ownerId}
              />

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
