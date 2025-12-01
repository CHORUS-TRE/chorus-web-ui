'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Globe, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useIframeCache } from '@/providers/iframe-cache-provider'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Textarea } from '~/components/ui/textarea'
import { ExternalWebApp } from '~/domain/model'

import { DeleteDialog } from './delete-dialog'

// Form schema - same as ExternalWebAppSchema but with auto-generated id
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

interface WebAppCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WebAppCreateDialog({
  open,
  onOpenChange
}: WebAppCreateDialogProps) {
  const {
    externalWebApps,
    addExternalWebApp,
    updateExternalWebApp,
    removeExternalWebApp
  } = useIframeCache()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingWebApp, setEditingWebApp] = useState<ExternalWebApp | null>(
    null
  )
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [webappToDelete, setWebappToDelete] = useState<ExternalWebApp | null>(
    null
  )

  const form = useForm<WebAppFormValues>({
    resolver: zodResolver(WebAppFormSchema),
    defaultValues: {
      name: '',
      url: '',
      description: '',
      iconUrl: ''
    }
  })

  const resetForm = () => {
    form.reset({
      name: '',
      url: '',
      description: '',
      iconUrl: ''
    })
    setEditingWebApp(null)
  }

  const handleEdit = (webapp: ExternalWebApp) => {
    setEditingWebApp(webapp)
    form.reset({
      name: webapp.name,
      url: webapp.url,
      description: webapp.description || '',
      iconUrl: webapp.iconUrl || ''
    })
  }

  const handleDeleteClick = (webapp: ExternalWebApp) => {
    setWebappToDelete(webapp)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!webappToDelete) return

    setIsSubmitting(true)
    await removeExternalWebApp(webappToDelete.id)
    setIsSubmitting(false)
    setDeleteDialogOpen(false)
    setWebappToDelete(null)
  }

  const onSubmit = async (data: WebAppFormValues) => {
    setIsSubmitting(true)

    try {
      if (editingWebApp) {
        // Update existing
        const webapp: ExternalWebApp = {
          id: editingWebApp.id,
          name: data.name,
          url: data.url,
          description: data.description,
          iconUrl: data.iconUrl
        }
        await updateExternalWebApp(webapp)
      } else {
        // Create new with auto-generated id
        const id = data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')

        // Check if id already exists, if so append a number
        let finalId = id
        let counter = 1
        while (externalWebApps.some((app) => app.id === finalId)) {
          finalId = `${id}-${counter}`
          counter++
        }

        const webapp: ExternalWebApp = {
          id: finalId,
          name: data.name,
          url: data.url,
          description: data.description,
          iconUrl: data.iconUrl
        }
        await addExternalWebApp(webapp)
      }

      resetForm()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Manage Services
            </DialogTitle>
            <DialogDescription>
              Add external web applications that can be loaded in iframes.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Form */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">
                {editingWebApp ? 'Edit Web App' : 'Add New Web App'}
              </h3>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
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
                            rows={2}
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

                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting
                        ? 'Saving...'
                        : editingWebApp
                          ? 'Update'
                          : 'Add Web App'}
                    </Button>
                    {editingWebApp && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>

            {/* List of existing services */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">
                Existing Services ({externalWebApps.length})
              </h3>

              {externalWebApps.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                  No services configured yet
                </div>
              ) : (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {externalWebApps.map((webapp) => (
                      <div
                        key={webapp.id}
                        className={`flex items-center justify-between rounded-lg border p-3 ${
                          editingWebApp?.id === webapp.id
                            ? 'border-accent bg-accent/10'
                            : ''
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-medium">{webapp.name}</div>
                          <div className="truncate text-xs text-muted-foreground">
                            {webapp.url}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(webapp)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(webapp)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={deleteDialogOpen}
        onCancel={() => {
          setDeleteDialogOpen(false)
          setWebappToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={isSubmitting}
        title="Delete Web App"
        description={`Are you sure you want to delete "${webappToDelete?.name}"? This action cannot be undone.`}
      />
    </>
  )
}
