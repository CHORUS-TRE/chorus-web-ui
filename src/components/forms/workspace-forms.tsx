'use client'

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { zodResolver } from '@hookform/resolvers/zod'
import {
  CheckCircle2,
  Cpu,
  Database,
  Eye,
  Globe,
  HardDrive,
  Loader2,
  Network,
  Server,
  Shield
} from 'lucide-react'
import {
  startTransition,
  useEffect,
  useRef,
  useState,
  useTransition
} from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { errorToast } from '@/components/error-toast'
import { DeleteDialog } from '@/components/forms/delete-dialog'
import { toast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog as DialogContainer,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  DEFAULT_WORKSPACE_CONFIG,
  WORKSPACE_RESOURCE_PRESETS,
  WorkspaceConfig,
  WorkspaceWithDev
} from '@/domain/model'
import { useInstanceLimits } from '@/hooks/use-instance-config'
import {
  workspaceCreateWithDev,
  workspaceDelete,
  workspaceUpdateWithDev
} from '@/view-model/workspace-view-model'

// Form schema for workspace create/update with config fields
const WorkspaceFormSchema = z.object({
  // Base workspace fields
  tenantId: z.string(),
  userId: z.string(),
  name: z.string().min(1, 'Name is required'),
  shortName: z.string().min(3, 'Short name is required'),
  description: z.string().optional(),
  isMain: z.boolean().optional(),
  id: z.string().optional(), // Only for update

  // General config
  image: z.any().optional(),
  descriptionMarkdown: z.string().optional(),

  // Security (API-backed)
  networkPolicy: z.enum(['Open', 'Airgapped', 'FQDNAllowlist']).optional(),
  allowedFqdns: z.array(z.string()).optional(),
  clipboard: z.enum(['disabled', 'to-server', 'to-client', 'both']).optional(),

  // Resources
  resourcePreset: z
    .enum([
      'nano',
      'micro',
      'small',
      'medium',
      'large',
      'xlarge',
      '2xlarge',
      'custom'
    ])
    .optional(),
  gpu: z.number().int().min(0).optional(),
  cpu: z.string().optional(),
  memory: z.string().optional(),
  coldStorageEnabled: z.boolean().optional(),
  coldStorageSize: z.string().optional(),
  hotStorageEnabled: z.boolean().optional(),
  hotStorageSize: z.string().optional(),

  // Services
  serviceGitlab: z.boolean().optional(),
  serviceK8s: z.boolean().optional(),
  serviceHpc: z.boolean().optional(),

  // Visibility
  visibility: z
    .enum(['WORKSPACE_VISIBILITY_PRIVATE', 'WORKSPACE_VISIBILITY_PUBLIC'])
    .optional(),
  contactUserId: z.string().optional()
})

type WorkspaceFormData = z.infer<typeof WorkspaceFormSchema>

export function WorkspaceCreateFormInline({
  userId,
  onSuccess,
  footer
}: {
  userId?: string
  onSuccess?: (workspace: WorkspaceWithDev) => void
  footer?: (ctx: { isSubmitting: boolean }) => React.ReactNode
}) {
  const [activeTab, setActiveTab] = useState('general')
  const [isPending, startTransition] = useTransition()

  const form = useForm<WorkspaceFormData>({
    resolver: zodResolver(WorkspaceFormSchema),
    defaultValues: {
      name: '',
      shortName: 'wks',
      description: '',
      tenantId: '1',
      userId: userId || '',
      isMain: false,
      descriptionMarkdown: '',
      networkPolicy: 'Airgapped',
      allowedFqdns: [],
      clipboard: 'disabled',
      resourcePreset: 'small',
      gpu: 0,
      cpu: '2',
      memory: '4Gi',
      coldStorageEnabled: false,
      coldStorageSize: '100Gi',
      hotStorageEnabled: true,
      hotStorageSize: '10Gi',
      serviceGitlab: false,
      serviceK8s: false,
      serviceHpc: false,
      visibility: 'WORKSPACE_VISIBILITY_PRIVATE',
      contactUserId: ''
    }
  })

  // userId may resolve after mount (e.g. during onboarding), keep it in sync
  useEffect(() => {
    if (userId) form.setValue('userId', userId)
  }, [userId, form])

  async function onSubmit(data: WorkspaceFormData) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      if (value instanceof FileList) {
        if (value.length > 0) {
          formData.append(key, value[0])
        }
        return
      }
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value))
        return
      }
      formData.append(key, String(value))
    })

    startTransition(async () => {
      const result = await workspaceCreateWithDev({}, formData)

      if (result.issues) {
        // Track validation error as a generic error or specific form erro
        result.issues.forEach((issue) => {
          let formField: keyof WorkspaceFormData
          if (issue.path[0] === 'dev') {
            if (issue.path.length === 2) {
              formField = issue.path[1] as keyof WorkspaceFormData
            } else if (issue.path.length >= 3 && issue.path[1] === 'config') {
              formField = issue.path[
                issue.path.length - 1
              ] as keyof WorkspaceFormData
            } else {
              formField = issue.path[
                issue.path.length - 1
              ] as keyof WorkspaceFormData
            }
          } else {
            formField = issue.path[0] as keyof WorkspaceFormData
          }

          form.setError(formField, {
            type: 'server',
            message: issue.message
          })
        })
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
        toast({
          title: 'Success',
          description: 'Workspace created successfully'
        })
        if (onSuccess) onSuccess(result.data)
        form.reset()
      }
    })
  }

  const isSubmitting = form.formState.isSubmitting || isPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="visibility">Visibility</TabsTrigger>
            {/* <TabsTrigger value="resources" className="demo-effect">
              Resources
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <GeneralTabContent form={form} />
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <SecurityTabContent form={form} />
          </TabsContent>

          <TabsContent value="visibility" className="space-y-4">
            <VisibilityTabContent form={form} />
          </TabsContent>

          <TabsContent value="resources" className="demo-effect space-y-4">
            <ResourcesTabContent form={form} />
          </TabsContent>
        </Tabs>

        <input type="hidden" {...form.register('tenantId')} />
        <input type="hidden" {...form.register('userId')} />
        <input type="hidden" {...form.register('shortName')} />

        {footer ? (
          footer({ isSubmitting })
        ) : (
          <div className="mt-6 flex justify-end gap-4">
            <Button
              type="submit"
              variant="accent-filled"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Workspace
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}

export function WorkspaceCreateForm({
  state: [open, setOpen],
  userId,
  children,
  onSuccess
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  userId?: string
  children?: React.ReactNode
  onSuccess?: (workspace: WorkspaceWithDev) => void
}) {
  const { workspaces: workspaceLimits } = useInstanceLimits(userId)

  // Show toast and close dialog when limit is reached
  useEffect(() => {
    if (open && workspaceLimits.isAtLimit) {
      toast({
        title: 'Workspace limit reached',
        description: `You've reached the maximum number of workspaces (${workspaceLimits.current}/${workspaceLimits.max}). Please delete existing workspaces before creating new ones.`,
        variant: 'destructive'
      })
      setOpen(false)
    }
  }, [open, workspaceLimits, setOpen])

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Configure your new workspace settings.
          </DialogDescription>
        </DialogHeader>
        <WorkspaceCreateFormInline
          userId={userId}
          onSuccess={(ws) => {
            onSuccess?.(ws)
            setOpen(false)
          }}
          footer={({ isSubmitting }) => (
            <div className="mt-6 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="accent-filled"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Workspace
              </Button>
            </div>
          )}
        />
      </DialogContent>
    </DialogContainer>
  )
}

export function WorkspaceDeleteForm({
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
    startTransition(async () => {
      const result = await workspaceDelete(id)
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
        toast({
          title: 'Success',
          description: 'Workspace deleted successfully.'
        })
        if (onSuccess) onSuccess()
        setOpen(false)
      }
    })
  }

  return (
    <DeleteDialog
      open={open}
      onCancel={() => setOpen(false)}
      onConfirm={onConfirm}
      isDeleting={isDeleting}
      title="Delete Workspace"
      description="Are you sure you want to delete this workspace? This action cannot be undone."
    />
  )
}

export function WorkspaceUpdateForm({
  state: [open, setOpen],
  trigger,
  workspace,
  onSuccess,
  initialTab = 'general'
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  trigger?: React.ReactNode
  workspace?: WorkspaceWithDev
  onSuccess?: (workspace: WorkspaceWithDev) => void
  initialTab?: 'general' | 'security' | 'resources' | 'services' | 'visibility'
}) {
  const [isPending, startTransition] = useTransition()
  const [removeImage, setRemoveImage] = useState(false)
  const [activeTab, setActiveTab] = useState<string>(initialTab)

  // Get existing config or use defaults
  const getConfig = (): WorkspaceConfig => {
    if (workspace?.dev?.config) {
      return workspace.dev.config as WorkspaceConfig
    }
    return DEFAULT_WORKSPACE_CONFIG
  }
  const existingConfig = getConfig()

  const form = useForm<WorkspaceFormData>({
    resolver: zodResolver(WorkspaceFormSchema),
    defaultValues: {
      id: workspace?.id || '',
      name: workspace?.name || '',
      shortName: workspace?.shortName || 'wks',
      description: workspace?.description || '',
      isMain: workspace?.isMain || false,
      tenantId: '1',
      userId: workspace?.userId || '',
      descriptionMarkdown: existingConfig?.descriptionMarkdown || '',
      networkPolicy: workspace?.networkPolicy || 'Airgapped',
      allowedFqdns: workspace?.allowedFqdns || [],
      clipboard: workspace?.clipboard || 'disabled',
      resourcePreset: existingConfig?.resources?.preset || 'small',
      gpu: existingConfig?.resources?.gpu || 0,
      cpu: existingConfig?.resources?.cpu || '2',
      memory: existingConfig?.resources?.memory || '4Gi',
      coldStorageEnabled:
        existingConfig?.resources?.coldStorage?.enabled || false,
      coldStorageSize: existingConfig?.resources?.coldStorage?.size || '100Gi',
      hotStorageEnabled: existingConfig?.resources?.hotStorage?.enabled || true,
      hotStorageSize: existingConfig?.resources?.hotStorage?.size || '10Gi',
      serviceGitlab: existingConfig?.services?.gitlab || false,
      serviceK8s: existingConfig?.services?.k8s || false,
      serviceHpc: existingConfig?.services?.hpc || false,
      visibility: workspace?.visibility || 'WORKSPACE_VISIBILITY_PRIVATE',
      contactUserId: workspace?.contactUserId || ''
    }
  })

  const prevOpenRef = useRef(false)

  // Only reset form when the dialog transitions from closed to open,
  // not when workspace prop changes due to polling while the dialog is open
  useEffect(() => {
    const wasOpen = prevOpenRef.current
    prevOpenRef.current = open

    if (open && !wasOpen && workspace) {
      const config = workspace.dev?.config
        ? (workspace.dev.config as WorkspaceConfig)
        : DEFAULT_WORKSPACE_CONFIG
      form.reset({
        id: workspace.id || '',
        name: workspace.name || '',
        shortName: workspace.shortName || 'wks',
        description: workspace.description || '',
        isMain: workspace.isMain || false,
        tenantId: '1',
        userId: workspace.userId || '',
        descriptionMarkdown: config?.descriptionMarkdown || '',
        networkPolicy: workspace.networkPolicy || 'Airgapped',
        allowedFqdns: workspace.allowedFqdns || [],
        clipboard: workspace.clipboard || 'disabled',
        resourcePreset: config?.resources?.preset || 'small',
        gpu: config?.resources?.gpu || 0,
        cpu: config?.resources?.cpu || '2',
        memory: config?.resources?.memory || '4Gi',
        coldStorageEnabled: config?.resources?.coldStorage?.enabled || false,
        coldStorageSize: config?.resources?.coldStorage?.size || '100Gi',
        hotStorageEnabled: config?.resources?.hotStorage?.enabled || true,
        hotStorageSize: config?.resources?.hotStorage?.size || '10Gi',
        serviceGitlab: config?.services?.gitlab || false,
        serviceK8s: config?.services?.k8s || false,
        serviceHpc: config?.services?.hpc || false,
        visibility: workspace.visibility || 'WORKSPACE_VISIBILITY_PRIVATE',
        contactUserId: workspace.contactUserId || ''
      })
      setRemoveImage(false)
      setActiveTab(initialTab)
    }
  }, [open, workspace, form, initialTab])

  async function onSubmit(data: WorkspaceFormData) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      if (value instanceof FileList) {
        if (value.length > 0) {
          formData.append(key, value[0])
        }
        return
      }
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value))
        return
      }
      formData.append(key, String(value))
    })
    if (removeImage) {
      formData.append('removeImage', 'true')
    }

    startTransition(async () => {
      const result = await workspaceUpdateWithDev({}, formData)

      if (result.issues) {
        result.issues.forEach((issue) => {
          let formField: keyof WorkspaceFormData
          if (issue.path[0] === 'dev') {
            if (issue.path.length === 2) {
              formField = issue.path[1] as keyof WorkspaceFormData
            } else if (issue.path.length >= 3 && issue.path[1] === 'config') {
              formField = issue.path[
                issue.path.length - 1
              ] as keyof WorkspaceFormData
            } else {
              formField = issue.path[
                issue.path.length - 1
              ] as keyof WorkspaceFormData
            }
          } else {
            formField = issue.path[0] as keyof WorkspaceFormData
          }

          form.setError(formField, {
            type: 'server',
            message: issue.message
          })
        })
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
        toast({
          title: 'Success',
          description: 'Workspace updated successfully'
        })
        if (onSuccess) onSuccess(result.data)
        setOpen(false)
      }
    })
  }

  return (
    <DialogContainer open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Workspace</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Modify your workspace configuration.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="visibility">Visibility</TabsTrigger>
                {/* <TabsTrigger value="resources">Resources</TabsTrigger> */}
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <GeneralTabContent
                  form={form}
                  workspace={workspace}
                  removeImage={removeImage}
                  setRemoveImage={setRemoveImage}
                />
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <SecurityTabContent form={form} workspace={workspace} />
              </TabsContent>

              <TabsContent value="visibility" className="space-y-4">
                <VisibilityTabContent form={form} workspace={workspace} />
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <ResourcesTabContent form={form} />
              </TabsContent>
            </Tabs>

            <input type="hidden" {...form.register('id')} />
            <input type="hidden" {...form.register('tenantId')} />
            <input type="hidden" {...form.register('userId')} />
            <input type="hidden" {...form.register('isMain')} />
            <input type="hidden" {...form.register('shortName')} />

            <div className="mt-6 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="accent-filled"
                disabled={form.formState.isSubmitting || isPending}
              >
                {(form.formState.isSubmitting || isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </DialogContainer>
  )
}

// ============================================================================
// Tab Content Components
// ============================================================================

function GeneralTabContent({
  form,
  workspace: _workspace,
  removeImage: _removeImage,
  setRemoveImage: _setRemoveImage
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  workspace?: WorkspaceWithDev
  removeImage?: boolean
  setRemoveImage?: (value: boolean) => void
}) {
  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardContent className="space-y-4 p-0">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Workspace name"
                  className="text-muted-foreground"
                />
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
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Brief description"
                  className="text-muted-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="descriptionMarkdown"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Detailed Description (Markdown). If your workspace is public,
                you can use this field to describe your workspace and its
                purpose.
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Detailed description with Markdown support..."
                  className="min-h-[120px] font-mono text-sm"
                />
              </FormControl>
              <FormDescription className="text-muted-foreground">
                Supports Markdown formatting for rich documentation
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* <div className="space-y-2">
          <Label>Cover Image</Label>
          {workspace?.dev?.image && !removeImage && (
            <div className="relative mb-2 h-32 w-full overflow-hidden rounded-md bg-muted/20">
              <Image
                src={workspace.dev.image}
                alt="Workspace cover"
                fill
                className="object-cover"
              />
            </div>
          )}
          {workspace?.dev?.image && setRemoveImage && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remove-image"
                checked={removeImage}
                onCheckedChange={(checked) =>
                  setRemoveImage(checked as boolean)
                }
              />
              <Label
                htmlFor="remove-image"
                className="text-sm text-muted-foreground"
              >
                Remove current image
              </Label>
            </div>
          )}
          {!removeImage && (
            <Input type="file" accept="image/*" {...form.register('image')} />
          )}
        </div> */}
      </CardContent>
    </Card>
  )
}

function SecurityTabContent({
  form,
  workspace
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  workspace?: WorkspaceWithDev
}) {
  const networkPolicy = form.watch('networkPolicy')

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardContent className="space-y-6 p-0">
        <div className="flex items-start gap-3">
          <Shield className="mt-1 h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <h4 className="font-medium">Network Policy</h4>
            <p className="mb-3 text-sm text-muted-foreground">
              Control network access for this workspace
            </p>
            <FormField
              control={form.control}
              name="networkPolicy"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-3 rounded-lg border p-3">
                        <RadioGroupItem
                          value="Airgapped"
                          id="network-airgapped"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor="network-airgapped"
                            className="font-medium"
                          >
                            Airgapped
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            No external network access
                          </p>
                        </div>
                        <Network className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="flex items-center space-x-3 rounded-lg border p-3">
                        <RadioGroupItem
                          value="FQDNAllowlist"
                          id="network-fqdn-allowlist"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor="network-fqdn-allowlist"
                            className="font-medium"
                          >
                            FQDN Allowlist
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Only approved destinations
                          </p>
                        </div>
                        <Network className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div className="flex items-center space-x-3 rounded-lg border p-3">
                        <RadioGroupItem value="Open" id="network-open" />
                        <div className="flex-1">
                          <Label htmlFor="network-open" className="font-medium">
                            Open
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Full network access
                          </p>
                        </div>
                        <Network className="h-4 w-4 text-green-500" />
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(workspace?.networkPolicyStatus ||
              workspace?.networkPolicyMessage) && (
              <div className="mt-3 flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/15">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  {workspace.networkPolicyStatus && (
                    <div className="font-medium">
                      Status:{' '}
                      <span className="text-green-500">
                        {workspace.networkPolicyStatus}
                      </span>
                    </div>
                  )}
                  {workspace.networkPolicyMessage && (
                    <div className="text-muted-foreground">
                      {workspace.networkPolicyMessage}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {networkPolicy === 'FQDNAllowlist' && (
          <FormField
            control={form.control}
            name="allowedFqdns"
            render={({ field }) => {
              const value: string[] = field.value || []
              return (
                <FormItem>
                  <FormLabel>Allowed FQDNs</FormLabel>
                  <FormControl>
                    <Textarea
                      value={value.join('\n')}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            .split('\n')
                            .map((s) => s.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder={'api.example.com\n*.internal.corp'}
                      className="min-h-[100px] font-mono text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    One FQDN per line. Wildcards (e.g. *.example.com) are
                    supported by the backend.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        )}

        <FormField
          control={form.control}
          name="clipboard"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Clipboard</FormLabel>
              <FormDescription className="text-muted-foreground">
                Control clipboard access between local machine and workspace
              </FormDescription>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select clipboard mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="disabled">Disabled</SelectItem>
                  <SelectItem value="to-server">
                    To server only (paste into workspace)
                  </SelectItem>
                  <SelectItem value="to-client">
                    To client only (copy from workspace)
                  </SelectItem>
                  <SelectItem value="both">Both directions</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

function VisibilityTabContent({
  form,
  workspace
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
  workspace?: WorkspaceWithDev
}) {
  const visibility = form.watch('visibility')
  const isPublic = visibility === 'WORKSPACE_VISIBILITY_PUBLIC'
  const members = workspace?.dev?.members || []

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardContent className="space-y-6 p-0">
        <div className="flex items-start gap-3">
          <Eye className="mt-1 h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <h4 className="font-medium">Workspace Visibility</h4>
            <p className="mb-3 text-sm text-muted-foreground">
              Control whether this workspace is discoverable by other platform
              users
            </p>
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-3 rounded-lg border p-3">
                        <RadioGroupItem
                          value="WORKSPACE_VISIBILITY_PRIVATE"
                          id="visibility-private"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor="visibility-private"
                            className="font-medium"
                          >
                            Private
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Only members can see this workspace
                          </p>
                        </div>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center space-x-3 rounded-lg border p-3">
                        <RadioGroupItem
                          value="WORKSPACE_VISIBILITY_PUBLIC"
                          id="visibility-public"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor="visibility-public"
                            className="font-medium"
                          >
                            Public
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            All platform users in your organization can discover
                            this workspace
                          </p>
                        </div>
                        <Globe className="h-4 w-4 text-green-500" />
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {isPublic && (
          <div className="flex items-start gap-3">
            <Globe className="mt-1 h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <h4 className="font-medium">Contact Person</h4>
              <p className="mb-3 text-sm text-muted-foreground">
                Shown on the public listing so users know who to reach out to
              </p>
              <FormField
                control={form.control}
                name="contactUserId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(v) =>
                        field.onChange(v === '__none__' ? '' : v)
                      }
                      value={field.value || '__none__'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a contact person" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.firstName} {member.lastName}
                            {member.email ? ` (${member.email})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-muted-foreground">
                      Optional — if not set, no contact info appears on the
                      public listing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ResourcesTabContent({
  form
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
}) {
  const selectedPreset = form.watch('resourcePreset')

  return (
    <Card className="demo-effect border-none bg-transparent shadow-none">
      <CardContent className="space-y-6 p-0">
        {/* Preset Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-muted-foreground" />
            <h4 className="font-medium">Resource Preset</h4>
          </div>
          <FormField
            control={form.control}
            name="resourcePreset"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preset" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(WORKSPACE_RESOURCE_PRESETS).map(
                      ([key, preset]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">
                              {key}
                            </span>
                            <span className="text-muted-foreground">
                              ({preset.cpu} CPU, {preset.memory} RAM)
                            </span>
                          </div>
                        </SelectItem>
                      )
                    )}
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {selectedPreset && selectedPreset !== 'custom' && (
                  <FormDescription>
                    {WORKSPACE_RESOURCE_PRESETS[
                      selectedPreset as keyof typeof WORKSPACE_RESOURCE_PRESETS
                    ]?.description || ''}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* GPU Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-muted-foreground" />
            <h4 className="font-medium">GPU</h4>
          </div>
          <FormField
            control={form.control}
            name="gpu"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(v) => field.onChange(parseInt(v, 10))}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select GPU count" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">No GPU</SelectItem>
                    <SelectItem value="1">1 GPU</SelectItem>
                    <SelectItem value="2">2 GPUs</SelectItem>
                    <SelectItem value="4">4 GPUs</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Storage */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-muted-foreground" />
            <h4 className="font-medium">Storage</h4>
          </div>

          {/* Cold Storage */}
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Cold Storage</span>
              </div>
              <FormField
                control={form.control}
                name="coldStorageEnabled"
                render={({ field }) => (
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                )}
              />
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              Long-term archival storage for large datasets
            </p>
            {form.watch('coldStorageEnabled') && (
              <FormField
                control={form.control}
                name="coldStorageSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="50Gi">50 GB</SelectItem>
                        <SelectItem value="100Gi">100 GB</SelectItem>
                        <SelectItem value="500Gi">500 GB</SelectItem>
                        <SelectItem value="1Ti">1 TB</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Hot Storage */}
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-orange-500" />
                <span className="font-medium">Hot Storage</span>
              </div>
              <FormField
                control={form.control}
                name="hotStorageEnabled"
                render={({ field }) => (
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                )}
              />
            </div>
            <p className="mb-3 text-sm text-muted-foreground">
              Fast SSD storage for active workloads
            </p>
            {form.watch('hotStorageEnabled') && (
              <FormField
                control={form.control}
                name="hotStorageSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="10Gi">10 GB</SelectItem>
                        <SelectItem value="20Gi">20 GB</SelectItem>
                        <SelectItem value="50Gi">50 GB</SelectItem>
                        <SelectItem value="100Gi">100 GB</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
