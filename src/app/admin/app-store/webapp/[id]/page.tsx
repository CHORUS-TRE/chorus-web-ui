'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, Globe } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from '@/components/hooks/use-toast'
import { useIframeCache } from '@/providers/iframe-cache-provider'
import { Button } from '~/components/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { ExternalWebApp } from '~/domain/model'

const WebAppFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z
    .string()
    .min(1, 'URL is required')
    .refine(
      (val) => /^https?:\/\/.+/.test(val),
      'Must be a valid HTTP or HTTPS URL'
    ),
  description: z.string().optional(),
  iconUrl: z
    .string()
    .refine(
      (val) =>
        !val ||
        val === '' ||
        /^https?:\/\/.+/.test(val) ||
        /^data:image\/[a-zA-Z]+;base64,/.test(val),
      'Must be a valid URL or base64 image'
    )
    .optional()
})

type WebAppFormValues = z.infer<typeof WebAppFormSchema>

export default function WebAppEditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { externalWebApps, updateExternalWebApp } = useIframeCache()
  const [loading, setLoading] = useState(true)
  const [webapp, setWebapp] = useState<ExternalWebApp | null>(null)

  const form = useForm<WebAppFormValues>({
    resolver: zodResolver(WebAppFormSchema),
    defaultValues: {
      name: '',
      url: '',
      description: '',
      iconUrl: ''
    }
  })

  useEffect(() => {
    // Find webapp in initial load or when externalWebApps changes
    const found = externalWebApps.find((app) => app.id === id)
    if (found) {
      setWebapp(found)
      form.reset({
        name: found.name,
        url: found.url,
        description: found.description || '',
        iconUrl: found.iconUrl || ''
      })
      setLoading(false)
    } else if (externalWebApps.length > 0) {
      // If we have data but id not found
      setLoading(false)
    }
  }, [id, externalWebApps, form])

  const onSubmit = async (data: WebAppFormValues) => {
    try {
      if (!webapp) return

      const updatedWebApp: ExternalWebApp = {
        id: webapp.id,
        name: data.name,
        url: data.url,
        description: data.description,
        iconUrl: data.iconUrl
      }

      const success = await updateExternalWebApp(updatedWebApp)
      if (success) {
        toast({
          title: 'Success',
          description: 'Service updated successfully'
        })
        router.push('/admin/app-store')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update service',
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

  if (!webapp) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Service not found.
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/admin/app-store')}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <Globe className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Service</h1>
            <p className="text-sm text-muted-foreground">
              Modify the configuration for this external service.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="My Web App" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The URL must allow embedding in an iframe
                  </FormDescription>
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
                      placeholder="A brief description of this web app"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iconUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/icon.png"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL to an icon image (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 border-t pt-6">
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
