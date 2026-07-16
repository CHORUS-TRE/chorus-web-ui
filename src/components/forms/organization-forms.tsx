'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { errorToast } from '@/components/error-toast'
import { CountrySelectField } from '@/components/forms/country-select-field'
import { DeleteDialog } from '@/components/forms/delete-dialog'
import { ImageUploadField } from '@/components/forms/image-upload-field'
import { toast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Organization, Result } from '@/domain/model'
import { isValidCountryCode } from '@/lib/countries'
import {
  organizationCreate,
  organizationDelete,
  organizationLogoDataUrl,
  organizationLogoGet,
  organizationUpdate
} from '@/view-model/organization-view-model'

export const ORGANIZATION_LOGO_MAX_BYTES = 500 * 1024

const OrganizationFormSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  country: z
    .string()
    .refine((value): boolean => value === '' || isValidCountryCode(value), {
      message: 'Select a valid country'
    })
    .optional(),
  city: z.string().optional(),
  contactUserId: z.string().optional(),
  websiteUrl: z.string().optional(),
  logoDataUrl: z.string().optional()
})

type OrganizationFormData = z.infer<typeof OrganizationFormSchema>
type OrganizationFormFieldName = keyof OrganizationFormData

const DEFAULT_VALUES: OrganizationFormData = {
  id: undefined,
  tenantId: '1',
  name: '',
  description: '',
  country: '',
  city: '',
  contactUserId: '',
  websiteUrl: '',
  logoDataUrl: ''
}

// Capitalizes the first letter of each word, applied live as the user types.
function capitalizeWords(value: string): string {
  return value.replace(/(^|\s)\S/g, (char) => char.toUpperCase())
}

// Splits a `data:<contentType>;base64,<data>` URI into its parts.
function parseDataUrl(
  dataUrl: string
): { contentType: string; data: string } | undefined {
  const match = /^data:(.+);base64,(.+)$/.exec(dataUrl)
  if (!match) return undefined
  return { contentType: match[1], data: match[2] }
}

function buildFormData(data: OrganizationFormData): FormData {
  const formData = new FormData()
  if (data.id) formData.append('id', data.id)
  formData.append('tenantId', data.tenantId)
  formData.append('name', data.name)
  if (data.description) formData.append('description', data.description)
  if (data.country) formData.append('country', data.country)
  if (data.city) formData.append('city', data.city)
  if (data.contactUserId) formData.append('contactUserId', data.contactUserId)
  if (data.websiteUrl) formData.append('websiteUrl', data.websiteUrl)

  if (data.logoDataUrl) {
    const logo = parseDataUrl(data.logoDataUrl)
    if (logo) formData.append('logo', JSON.stringify(logo))
  }

  return formData
}

function applyServerIssues(
  form: ReturnType<typeof useForm<OrganizationFormData>>,
  issues: Result<Organization>['issues']
) {
  issues?.forEach((issue) => {
    const path = issue.path[0] as string
    const field = (
      path === 'logo' ? 'logoDataUrl' : path
    ) as OrganizationFormFieldName
    form.setError(field, {
      type: 'server',
      message: issue.message
    })
  })
}

export function OrganizationCreateForm({
  state: [open, setOpen],
  trigger,
  onSuccess
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  trigger?: React.ReactNode
  onSuccess?: (organization: Organization) => void
}) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(OrganizationFormSchema),
    defaultValues: DEFAULT_VALUES
  })

  useEffect(() => {
    if (!open) form.reset(DEFAULT_VALUES)
  }, [open, form])

  async function onSubmit(data: OrganizationFormData) {
    const formData = buildFormData({
      ...data,
      contactUserId: data.contactUserId || '1'
    })

    startTransition(async () => {
      const result = await organizationCreate({}, formData)

      if (result.issues) {
        applyServerIssues(form, result.issues)
        return
      }

      if (result.error) {
        toast({
          title: 'Error',
          ...errorToast(result.error),
          variant: 'destructive'
        })
        return
      }

      if (result.data) {
        toast({ title: 'Success', description: 'Organization created' })
        onSuccess?.(result.data)
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-[480px] bg-background">
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new organization to the platform.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...form.register('tenantId')} />
            <OrganizationFormFields form={form} />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="bg-background"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function OrganizationUpdateForm({
  state: [open, setOpen],
  organization,
  onSuccess
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  organization?: Organization
  onSuccess?: (organization: Organization) => void
}) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(OrganizationFormSchema),
    defaultValues: DEFAULT_VALUES
  })

  const prevOpenRef = useRef(false)

  // Only reset (and fetch the logo) when the dialog transitions closed -> open,
  // not on every re-render caused by a parent list refresh.
  useEffect(() => {
    const wasOpen = prevOpenRef.current
    prevOpenRef.current = open

    if (open && !wasOpen && organization) {
      form.reset({
        id: organization.id,
        tenantId: organization.tenantId || '1',
        name: organization.name || '',
        description: organization.description || '',
        country: organization.country || '',
        city: organization.city || '',
        contactUserId: organization.contactUserId || '',
        websiteUrl: organization.websiteUrl || '',
        logoDataUrl: ''
      })

      organizationLogoGet(organization.id).then((result) => {
        const dataUrl = organizationLogoDataUrl(result.data)
        if (dataUrl) form.setValue('logoDataUrl', dataUrl)
      })
    }
  }, [open, organization, form])

  async function onSubmit(data: OrganizationFormData) {
    const formData = buildFormData(data)

    startTransition(async () => {
      const result = await organizationUpdate({}, formData)

      if (result.issues) {
        applyServerIssues(form, result.issues)
        return
      }

      if (result.error) {
        toast({
          title: 'Error',
          ...errorToast(result.error),
          variant: 'destructive'
        })
        return
      }

      if (result.data) {
        toast({ title: 'Success', description: 'Organization updated' })
        onSuccess?.(result.data)
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[480px] bg-background">
        <DialogHeader>
          <DialogTitle>Update Organization</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Modify this organization&apos;s details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...form.register('id')} />
            <input type="hidden" {...form.register('tenantId')} />
            <OrganizationFormFields form={form} />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="bg-background"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export function OrganizationDeleteForm({
  state: [open, setOpen],
  id,
  onSuccess
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  id?: string
  onSuccess?: () => void
}) {
  const [isDeleting, setIsDeleting] = useState(false)

  const onConfirm = async () => {
    if (!id) return
    setIsDeleting(true)
    const result = await organizationDelete(id)
    setIsDeleting(false)

    if (result.error) {
      toast({
        title: 'Error',
        ...errorToast(result.error),
        variant: 'destructive'
      })
      return
    }

    if (result.data) {
      toast({ title: 'Success', description: 'Organization deleted' })
      onSuccess?.()
      setOpen(false)
    }
  }

  return (
    <DeleteDialog
      open={open}
      onCancel={() => setOpen(false)}
      onConfirm={onConfirm}
      isDeleting={isDeleting}
      title="Delete Organization"
      description="This will permanently delete this organization. This action cannot be undone."
    />
  )
}

function OrganizationFormFields({
  form
}: {
  form: ReturnType<typeof useForm<OrganizationFormData>>
}) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter organization name" />
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
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter description" />
            </FormControl>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="logoDataUrl"
        render={({ field }) => (
          <ImageUploadField
            label="Logo"
            value={field.value || ''}
            onChange={field.onChange}
            error={form.formState.errors.logoDataUrl?.message}
            maxSizeBytes={ORGANIZATION_LOGO_MAX_BYTES}
          />
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <CountrySelectField
              value={field.value || ''}
              onChange={field.onChange}
              error={form.formState.errors.country?.message}
            />
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) =>
                    field.onChange(capitalizeWords(e.target.value))
                  }
                  placeholder="e.g., Lausanne"
                />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="websiteUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website URL</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://example.org" />
            </FormControl>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contactUserId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact User ID</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Optional" />
            </FormControl>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />
    </div>
  )
}
