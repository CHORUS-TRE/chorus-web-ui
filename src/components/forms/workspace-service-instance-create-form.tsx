'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, CirclePlus, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { errorToast } from '@/components/error-toast'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Textarea } from '@/components/ui/textarea'
import {
  WorkspaceServiceInstance,
  WorkspaceServiceInstanceState
} from '@/domain/model/workspace-service-instance'
import { workspaceServiceInstanceCreate } from '@/view-model/workspace-service-instance-view-model'

import { toast } from '../hooks/use-toast'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  chartRegistry: z.string().min(1, 'Chart registry is required'),
  chartRepository: z.string().min(1, 'Chart repository is required'),
  chartTag: z.string().min(1, 'Chart tag is required'),
  valuesOverrideJson: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val?.trim()) return true
        try {
          JSON.parse(val)
          return true
        } catch {
          return false
        }
      },
      { message: 'Must be valid JSON' }
    ),
  credentialsSecretName: z.string().optional(),
  credentialsPaths: z.string().optional(),
  connectionInfoTemplate: z.string().optional()
})

type FormValues = z.infer<typeof schema>

type ServicePreset = {
  title: string
  description: string
  values: Pick<
    FormValues,
    'name' | 'chartRegistry' | 'chartRepository' | 'chartTag'
  > &
    Partial<
      Pick<
        FormValues,
        | 'valuesOverrideJson'
        | 'credentialsSecretName'
        | 'credentialsPaths'
        | 'connectionInfoTemplate'
      >
    >
}

const SERVICE_PRESETS_JSON: Record<string, ServicePreset> = {
  postgres: {
    title: 'PostgreSQL',
    description: 'Relational database service',
    values: {
      name: 'postgres',
      chartRegistry: 'harbor.int.chorus-tre.ch',
      chartRepository: 'services/postgres',
      chartTag: '0.0.4'
    }
  },
  mlflow: {
    title: 'MLFlow',
    description: 'Experiment tracking service',
    values: {
      name: 'mlflow',
      chartRegistry: 'harbor.int.chorus-tre.ch',
      chartRepository: 'services/mlflow',
      chartTag: '0.0.9'
    }
  }
}

const DEFAULT_PRESET_KEY = Object.keys(SERVICE_PRESETS_JSON)[0]
const DEFAULT_PRESET = SERVICE_PRESETS_JSON[DEFAULT_PRESET_KEY]

export function WorkspaceServiceInstanceCreateForm({
  workspaceId,
  onSuccess
}: {
  workspaceId: string
  onSuccess?: (instance: WorkspaceServiceInstance) => void
}) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(DEFAULT_PRESET_KEY)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: DEFAULT_PRESET.values.name,
      chartRegistry: DEFAULT_PRESET.values.chartRegistry,
      chartRepository: DEFAULT_PRESET.values.chartRepository,
      chartTag: DEFAULT_PRESET.values.chartTag,
      valuesOverrideJson: DEFAULT_PRESET.values.valuesOverrideJson ?? '',
      credentialsSecretName: DEFAULT_PRESET.values.credentialsSecretName ?? '',
      credentialsPaths: DEFAULT_PRESET.values.credentialsPaths ?? '',
      connectionInfoTemplate: DEFAULT_PRESET.values.connectionInfoTemplate ?? ''
    }
  })

  function applyPreset(presetKey: string) {
    const preset = SERVICE_PRESETS_JSON[presetKey]
    if (!preset) return

    setSelectedPreset(presetKey)
    form.setValue('name', preset.values.name)
    form.setValue('chartRegistry', preset.values.chartRegistry)
    form.setValue('chartRepository', preset.values.chartRepository)
    form.setValue('chartTag', preset.values.chartTag)
    form.setValue('valuesOverrideJson', preset.values.valuesOverrideJson ?? '')
    form.setValue(
      'credentialsSecretName',
      preset.values.credentialsSecretName ?? ''
    )
    form.setValue('credentialsPaths', preset.values.credentialsPaths ?? '')
    form.setValue(
      'connectionInfoTemplate',
      preset.values.connectionInfoTemplate ?? ''
    )
  }

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    const result = await workspaceServiceInstanceCreate({
      workspaceId,
      name: values.name,
      state: WorkspaceServiceInstanceState.RUNNING,
      chartRegistry: values.chartRegistry,
      chartRepository: values.chartRepository,
      chartTag: values.chartTag,
      valuesOverrideJson: values.valuesOverrideJson?.trim() || undefined,
      credentialsSecretName: values.credentialsSecretName || undefined,
      credentialsPaths: values.credentialsPaths
        ? values.credentialsPaths
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      connectionInfoTemplate: values.connectionInfoTemplate || undefined
    })
    setIsSubmitting(false)

    if (result.error) {
      toast({
        title: 'Error',
        ...errorToast(result.error),
        variant: 'destructive'
      })
      return
    }

    if (result.data) {
      toast({ title: `"${result.data.name}" deployed` })
      setOpen(false)
      setSelectedPreset(DEFAULT_PRESET_KEY)
      form.reset({
        name: DEFAULT_PRESET.values.name,
        chartRegistry: DEFAULT_PRESET.values.chartRegistry,
        chartRepository: DEFAULT_PRESET.values.chartRepository,
        chartTag: DEFAULT_PRESET.values.chartTag,
        valuesOverrideJson: DEFAULT_PRESET.values.valuesOverrideJson ?? '',
        credentialsSecretName:
          DEFAULT_PRESET.values.credentialsSecretName ?? '',
        credentialsPaths: DEFAULT_PRESET.values.credentialsPaths ?? '',
        connectionInfoTemplate:
          DEFAULT_PRESET.values.connectionInfoTemplate ?? ''
      })
      setAdvancedOpen(false)
      onSuccess?.(result.data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="accent-filled" type="button">
          <CirclePlus className="h-4 w-4" />
          Add service
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Deploy a service</DialogTitle>
          <DialogDescription>
            Deploy a Helm-based service into this workspace.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Service template
            </p>

            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(SERVICE_PRESETS_JSON).map(([key, preset]) => (
                <Button
                  key={key}
                  type="button"
                  variant="ghost"
                  aria-pressed={selectedPreset === key}
                  className={`group h-auto min-h-28 flex-col items-start justify-between rounded-xl border px-3 py-3 text-left transition-all duration-200 ${
                    selectedPreset === key
                      ? 'border-primary/50 bg-primary/10 shadow-sm ring-1 ring-primary/20'
                      : 'border-border/80 bg-background hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/40 hover:shadow-sm'
                  }`}
                  onClick={() => applyPreset(key)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {preset.title}
                      </span>
                      {selectedPreset === key && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {preset.description}
                    </p>
                  </div>
                  <div className="mt-2 rounded-md bg-muted/60 px-2 py-1 font-mono text-[11px] text-muted-foreground">
                    {preset.values.chartRepository}:{preset.values.chartTag}
                  </div>
                </Button>
              ))}
            </div>

            {/* Advanced */}
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="flex w-full items-center justify-between bg-muted/20 transition-colors hover:bg-muted/40"
                >
                  <span className="text-xs font-medium">Advanced</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${advancedOpen ? 'rotate-180' : ''}`}
                  />
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="my-service"
                          className="text-muted-foreground placeholder:text-muted-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Chart
                </p>

                <FormField
                  control={form.control}
                  name="chartRegistry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registry</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="registry.example.com"
                          className="text-muted-foreground placeholder:text-muted-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <FormField
                    control={form.control}
                    name="chartRepository"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repository</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="charts/my-service"
                            className="text-muted-foreground placeholder:text-muted-foreground"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="chartTag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tag</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="1.0.0"
                            className="w-28 text-muted-foreground placeholder:text-muted-foreground"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="valuesOverrideJson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Values override (JSON)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder='{"key": "value"}'
                          className="min-h-[80px] font-mono text-xs text-muted-foreground placeholder:text-muted-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="credentialsSecretName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credentials secret name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="my-credentials-secret"
                          className="text-muted-foreground placeholder:text-muted-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="credentialsPaths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credential paths (comma-separated)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="path/to/key1, path/to/key2"
                          className="text-muted-foreground placeholder:text-muted-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="connectionInfoTemplate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connection info template</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="host: {{ .host }}, port: {{ .port }}"
                          className="min-h-[60px] font-mono text-xs text-muted-foreground placeholder:text-muted-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Deploy
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
