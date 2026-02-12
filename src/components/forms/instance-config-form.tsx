'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Settings2, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

import { useInstanceConfig } from '@/hooks/use-instance-config'
import { Button } from '~/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/card'
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
import { Switch } from '~/components/ui/switch'
import { Textarea } from '~/components/ui/textarea'
import { useIframeCache } from '~/providers/iframe-cache-provider'
import { useDevStoreCache } from '~/stores/dev-store-cache'

import { toast } from '../hooks/use-toast'

const instanceTagSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  label: z.string().min(1, 'Label is required'),
  display: z.boolean()
})

const instanceConfigFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  headline: z.string().min(1, 'Headline is required'),
  tagline: z.string().min(1, 'Tagline is required'),
  website: z.string().url('Must be a valid URL'),
  tags: z.array(instanceTagSchema).min(1, 'At least one tag is required'),
  maxWorkspacesPerUser: z.string().optional(),
  maxSessionsPerUser: z.string().optional(),
  maxAppInstancesPerUser: z.string().optional(),
  sidebarWebapps: z.array(z.string()).optional()
})

type InstanceConfigFormValues = z.infer<typeof instanceConfigFormSchema>

export function InstanceConfigForm() {
  const instanceConfig = useInstanceConfig()
  const { externalWebApps } = useIframeCache()

  const form = useForm<InstanceConfigFormValues>({
    resolver: zodResolver(instanceConfigFormSchema),
    defaultValues: {
      name: instanceConfig.name,
      headline: instanceConfig.headline,
      tagline: instanceConfig.tagline,
      website: instanceConfig.website,
      tags: instanceConfig.tags,
      maxWorkspacesPerUser:
        instanceConfig.limits?.maxWorkspacesPerUser?.toString() ?? '',
      maxSessionsPerUser:
        instanceConfig.limits?.maxSessionsPerUser?.toString() ?? '',
      maxAppInstancesPerUser:
        instanceConfig.limits?.maxAppInstancesPerUser?.toString() ?? '',
      sidebarWebapps: instanceConfig.sidebarWebapps
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tags'
  })

  // Update form when instanceConfig changes (e.g., after save)
  useEffect(() => {
    form.reset({
      name: instanceConfig.name,
      headline: instanceConfig.headline,
      tagline: instanceConfig.tagline,
      website: instanceConfig.website,
      tags: instanceConfig.tags,
      maxWorkspacesPerUser:
        instanceConfig.limits?.maxWorkspacesPerUser?.toString() ?? '',
      maxSessionsPerUser:
        instanceConfig.limits?.maxSessionsPerUser?.toString() ?? '',
      maxAppInstancesPerUser:
        instanceConfig.limits?.maxAppInstancesPerUser?.toString() ?? '',
      sidebarWebapps: instanceConfig.sidebarWebapps
    })
  }, [instanceConfig, form])

  async function onSubmit(data: InstanceConfigFormValues) {
    try {
      const {
        setInstanceName,
        setInstanceHeadline,
        setInstanceTagline,
        setInstanceWebsite,
        setInstanceTags,
        setInstanceLimits,
        setInstanceSidebarWebapps
      } = useDevStoreCache.getState()

      // Parse limit values: empty string → null (unlimited), otherwise number
      const parsedLimits = {
        maxWorkspacesPerUser: data.maxWorkspacesPerUser
          ? parseInt(data.maxWorkspacesPerUser, 10)
          : null,
        maxSessionsPerUser: data.maxSessionsPerUser
          ? parseInt(data.maxSessionsPerUser, 10)
          : null,
        maxAppInstancesPerUser: data.maxAppInstancesPerUser
          ? parseInt(data.maxAppInstancesPerUser, 10)
          : null
      }

      // Save all fields
      const results = await Promise.all([
        setInstanceName(data.name),
        setInstanceHeadline(data.headline),
        setInstanceTagline(data.tagline),
        setInstanceWebsite(data.website),
        setInstanceTags(data.tags),
        setInstanceLimits(parsedLimits),
        data.sidebarWebapps
          ? setInstanceSidebarWebapps(data.sidebarWebapps)
          : Promise.resolve(true)
      ])

      if (results.every(Boolean)) {
        toast({
          title: 'Configuration saved',
          description: 'Instance configuration has been updated successfully.'
        })
      } else {
        toast({
          title: 'Partial save',
          description: 'Some settings could not be saved. Please try again.',
          variant: 'destructive'
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save configuration. Please try again.',
        variant: 'destructive'
      })
    }
  }

  async function handleReset() {
    try {
      const {
        deleteGlobal,
        setInstanceName,
        setInstanceHeadline,
        setInstanceTagline,
        setInstanceWebsite,
        setInstanceTags
      } = useDevStoreCache.getState()

      // Delete all custom values to reset to defaults
      await Promise.all([
        deleteGlobal('instance.name'),
        deleteGlobal('instance.headline'),
        deleteGlobal('instance.tagline'),
        deleteGlobal('instance.website'),
        deleteGlobal('instance.tags'),
        deleteGlobal('instance.limits'),
        deleteGlobal('instance.sidebar_webapps')
      ])

      toast({
        title: 'Configuration reset',
        description: 'Instance configuration has been reset to defaults.'
      })
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to reset configuration. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Instance Configuration
        </CardTitle>
        <CardDescription>
          Configure the basic information displayed throughout the application,
          including the login page and headers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instance Name</FormLabel>
                    <FormControl>
                      <Input placeholder="CHORUS" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of your instance (e.g., CHORUS, MyTRE)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A secure, open-source platform..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Main headline displayed on the login page
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tagline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagline</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your One-Stop Shop for Data, Applications, and AI"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Short tagline displayed below the headline
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://www.chorus-tre.ch/en/"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Link to your organization&apos;s website
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Workspace Tags */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Workspace Types</h3>
                  <p className="text-sm text-muted-foreground">
                    Define the types/tags available for workspaces
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ id: '', label: '', display: true })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Tag
                </Button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <div className="grid flex-1 grid-cols-3 gap-3">
                      <FormField
                        control={form.control}
                        name={`tags.${index}.id`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">ID</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="project"
                                className="h-8"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`tags.${index}.label`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Label</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Project"
                                className="h-8"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`tags.${index}.display`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-xs">Display</FormLabel>
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

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-6 h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Sidebar Navigation</h3>
                <p className="text-sm text-muted-foreground">
                  Select which External Web Apps to display in the left sidebar.
                </p>
              </div>

              {externalWebApps.length === 0 ? (
                <div className="text-sm italic text-muted-foreground">
                  No external web apps configured. Add them via App Store
                  configuration.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="sidebarWebapps"
                    render={() => (
                      <FormItem className="col-span-2 space-y-3">
                        {externalWebApps.map((webapp) => (
                          <FormField
                            key={webapp.id}
                            control={form.control}
                            name="sidebarWebapps"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={webapp.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(webapp.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value || []),
                                              webapp.id
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== webapp.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {webapp.name}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Resource Limits */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Resource Limits</h3>
                <p className="text-sm text-muted-foreground">
                  Set the maximum number of resources each user can create.
                  Leave empty for unlimited.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="maxWorkspacesPerUser"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Workspaces</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Unlimited"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Per user</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxSessionsPerUser"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Sessions</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Unlimited"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Per user</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxAppInstancesPerUser"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max App Instances</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Unlimited"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Per user</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button type="submit">Save Configuration</Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset to Defaults
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
