'use client'

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Cpu,
  Database,
  GitBranch,
  HardDrive,
  Loader2,
  Network,
  Server,
  Shield,
  Users
} from 'lucide-react'
import Image from 'next/image'
import { startTransition, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from '@/components/hooks/use-toast'
import {
  Dialog as DialogContainer,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  DEFAULT_WORKSPACE_CONFIG,
  WORKSPACE_RESOURCE_PRESETS,
  WorkspaceConfig,
  WorkspaceWithDev
} from '@/domain/model'
import {
  workspaceCreateWithDev,
  workspaceDelete,
  workspaceUpdateWithDev
} from '@/view-model/workspace-view-model'
import { Button } from '~/components/button'
import { Card, CardContent } from '~/components/card'
import { DeleteDialog } from '~/components/forms/delete-dialog'
import { Checkbox } from '~/components/ui/checkbox'
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
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Switch } from '~/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Textarea } from '~/components/ui/textarea'

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
  tag: z.enum(['center', 'project']).optional(),
  image: z.any().optional(),
  descriptionMarkdown: z.string().optional(),

  // Security
  network: z.enum(['closed', 'whitelist', 'open']).optional(),
  allowCopyPaste: z.boolean().optional(),

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
  serviceHpc: z.boolean().optional()
})

type WorkspaceFormData = z.infer<typeof WorkspaceFormSchema>

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
  const [activeTab, setActiveTab] = useState('general')

  const form = useForm<WorkspaceFormData>({
    resolver: zodResolver(WorkspaceFormSchema),
    defaultValues: {
      name: '',
      shortName: 'wks',
      description: '',
      tenantId: '1',
      userId: userId || '',
      isMain: false,
      tag: 'project',
      descriptionMarkdown: '',
      network: 'closed',
      allowCopyPaste: false,
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
      serviceHpc: false
    }
  })

  useEffect(() => {
    if (!open) {
      form.reset()
      setActiveTab('general')
    }
  }, [open, form])

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
      formData.append(key, String(value))
    })

    startTransition(async () => {
      const result = await workspaceCreateWithDev({}, formData)

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
          description: result.error,
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
        setOpen(false)
        form.reset()
      }
    })
  }

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <GeneralTabContent form={form} />
              </TabsContent>

              <TabsContent value="security" className="demo-effect space-y-4">
                <SecurityTabContent form={form} />
              </TabsContent>

              <TabsContent value="resources" className="demo-effect space-y-4">
                <ResourcesTabContent form={form} />
              </TabsContent>

              <TabsContent value="services" className="demo-effect space-y-4">
                <ServicesTabContent form={form} />
              </TabsContent>
            </Tabs>

            <input type="hidden" {...form.register('tenantId')} />
            <input type="hidden" {...form.register('userId')} />
            <input type="hidden" {...form.register('shortName')} />

            <div className="mt-6 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false)
                  form.reset()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Workspace
              </Button>
            </div>
          </form>
        </Form>
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
          description: result.error,
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
  onSuccess
}: {
  state: [open: boolean, setOpen: (open: boolean) => void]
  trigger?: React.ReactNode
  workspace?: WorkspaceWithDev
  onSuccess?: (workspace: WorkspaceWithDev) => void
}) {
  const [removeImage, setRemoveImage] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

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
      tag: workspace?.dev?.tag,
      descriptionMarkdown: existingConfig?.descriptionMarkdown || '',
      network: existingConfig?.security?.network || 'closed',
      allowCopyPaste: existingConfig?.security?.allowCopyPaste || false,
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
      serviceHpc: existingConfig?.services?.hpc || false
    }
  })

  useEffect(() => {
    if (open && workspace) {
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
        tag: workspace.dev?.tag,
        descriptionMarkdown: config?.descriptionMarkdown || '',
        network: config?.security?.network || 'closed',
        allowCopyPaste: config?.security?.allowCopyPaste || false,
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
        serviceHpc: config?.services?.hpc || false
      })
      setRemoveImage(false)
      setActiveTab('general')
    }
  }, [open, workspace, form])

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
          description: result.error,
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
          <DialogDescription>
            Modify your workspace configuration.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 grid grid-cols-5">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
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
                <SecurityTabContent form={form} />
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <ResourcesTabContent form={form} />
              </TabsContent>

              <TabsContent value="team" className="space-y-4">
                <TeamTabContent workspace={workspace} />
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                <ServicesTabContent form={form} />
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
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
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
  workspace,
  removeImage,
  setRemoveImage
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
                <Input {...field} placeholder="Workspace name" />
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
                <Input {...field} placeholder="Brief description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
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
              <FormDescription>
                Supports Markdown formatting for rich documentation
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workspace type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
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
        </div>
      </CardContent>
    </Card>
  )
}

function SecurityTabContent({
  form
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
}) {
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
              name="network"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-3 rounded-lg border p-3">
                        <RadioGroupItem value="closed" id="network-closed" />
                        <div className="flex-1">
                          <Label
                            htmlFor="network-closed"
                            className="font-medium"
                          >
                            Closed
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            No external network access
                          </p>
                        </div>
                        <Network className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="flex items-center space-x-3 rounded-lg border p-3">
                        <RadioGroupItem
                          value="whitelist"
                          id="network-whitelist"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor="network-whitelist"
                            className="font-medium"
                          >
                            Whitelist
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Only approved destinations
                          </p>
                        </div>
                        <Network className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div className="flex items-center space-x-3 rounded-lg border p-3">
                        <RadioGroupItem value="open" id="network-open" />
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
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="allowCopyPaste"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Allow Copy/Paste
                    </FormLabel>
                    <FormDescription>
                      Enable clipboard access between local machine and
                      workspace
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
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
    <Card className="border-none bg-transparent shadow-none">
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

function TeamTabContent({ workspace }: { workspace?: WorkspaceWithDev }) {
  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardContent className="p-0">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h4 className="font-medium">Team Members</h4>
        </div>

        {workspace?.dev?.members && workspace.dev.members.length > 0 ? (
          <div className="space-y-2">
            {workspace.dev.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                    {member.firstName?.[0]}
                    {member.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-medium">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.username}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {member.id === workspace.userId ? 'Owner' : 'Member'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No team members yet. Add users from the workspace users page.
          </p>
        )}

        <p className="mt-4 text-sm text-muted-foreground">
          To manage team members and roles, go to the workspace&apos;s Users
          tab.
        </p>
      </CardContent>
    </Card>
  )
}

function ServicesTabContent({
  form
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
}) {
  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardContent className="space-y-4 p-0">
        <p className="text-sm text-muted-foreground">
          Enable additional services for this workspace
        </p>

        <FormField
          control={form.control}
          name="serviceGitlab"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <GitBranch className="h-5 w-5 text-orange-500" />
                <div className="space-y-0.5">
                  <FormLabel className="text-base">GitLab</FormLabel>
                  <FormDescription>
                    Version control and CI/CD pipeline
                  </FormDescription>
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceK8s"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-blue-500" />
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Kubernetes</FormLabel>
                  <FormDescription>
                    Container orchestration platform
                  </FormDescription>
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceHpc"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Cpu className="h-5 w-5 text-purple-500" />
                <div className="space-y-0.5">
                  <FormLabel className="text-base">HPC</FormLabel>
                  <FormDescription>
                    High Performance Computing cluster access
                  </FormDescription>
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
