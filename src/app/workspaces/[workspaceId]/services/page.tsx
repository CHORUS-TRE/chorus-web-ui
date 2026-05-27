'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  Check,
  Copy,
  Loader2,
  PlugZap,
  Settings,
  Trash2
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { WorkspaceServiceInstanceCreateForm } from '@/components/forms/workspace-service-instance-create-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
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
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import {
  WorkspaceServiceInstance,
  WorkspaceServiceInstanceState,
  WorkspaceServiceInstanceStatus
} from '@/domain/model/workspace-service-instance'
import {
  workspaceServiceInstanceDelete,
  workspaceServiceInstanceList,
  workspaceServiceInstanceUpdate
} from '@/view-model/workspace-service-instance-view-model'

import { toast } from '../../../../components/hooks/use-toast'

// ─── Status config ────────────────────────────────────────────────────────────

type StatusKey = 'Running' | 'Progressing' | 'Stopped' | 'Failed' | 'Deleted'

const STATUS_CONFIG: Record<
  StatusKey,
  { dot: string; badge: string; label: string }
> = {
  Running: {
    dot: 'bg-green-500 animate-pulse',
    badge:
      'bg-green-500/10 text-green-600 border border-green-500/20 dark:text-green-400',
    label: 'Running'
  },
  Progressing: {
    dot: 'bg-amber-500 animate-pulse',
    badge:
      'bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400',
    label: 'Progressing'
  },
  Stopped: {
    dot: 'bg-muted-foreground/40',
    badge: 'bg-muted text-muted-foreground border border-border',
    label: 'Stopped'
  },
  Failed: {
    dot: 'bg-red-500',
    badge:
      'bg-red-500/10 text-red-600 border border-red-500/20 dark:text-red-400',
    label: 'Failed'
  },
  Deleted: {
    dot: 'bg-red-400/50',
    badge: 'bg-red-500/10 text-red-500 border border-red-500/20',
    label: 'Deleted'
  }
}

function StatusBadge({ status }: { status?: string }) {
  const cfg = STATUS_CONFIG[status as StatusKey]
  if (!cfg) return null
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${cfg.badge}`}
    >
      {cfg.label}
    </span>
  )
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy to clipboard"
      className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
    >
      {copied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  )
}

// ─── Parameters dialog ────────────────────────────────────────────────────────

const paramsSchema = z.object({
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

type ParamsFormValues = z.infer<typeof paramsSchema>

function ServiceParametersDialog({
  instance,
  open,
  onOpenChange,
  onUpdate
}: {
  instance: WorkspaceServiceInstance
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (updated: WorkspaceServiceInstance) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ParamsFormValues>({
    resolver: zodResolver(paramsSchema),
    values: {
      valuesOverrideJson: instance.valuesOverrideJson ?? '',
      credentialsSecretName: instance.credentialsSecretName ?? '',
      credentialsPaths: instance.credentialsPaths?.join(', ') ?? '',
      connectionInfoTemplate: instance.connectionInfoTemplate ?? ''
    }
  })

  async function onSubmit(values: ParamsFormValues) {
    if (!instance.id) return
    setIsSubmitting(true)
    const result = await workspaceServiceInstanceUpdate({
      id: instance.id,
      workspaceId: instance.workspaceId,
      name: instance.name,
      state: instance.state ?? WorkspaceServiceInstanceState.RUNNING,
      chartRegistry: instance.chartRegistry ?? '',
      chartRepository: instance.chartRepository ?? '',
      chartTag: instance.chartTag ?? '',
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
        description: result.error,
        variant: 'destructive'
      })
      return
    }
    if (result.data) {
      toast({ title: 'Parameters saved' })
      onUpdate(result.data)
      onOpenChange(false)
    }
  }

  // Rows shown in the service info section
  const infoRows: { label: string; value: string; pre?: boolean }[] = [
    { label: 'Status', value: instance.status ?? instance.state ?? '' },
    { label: 'Chart registry', value: instance.chartRegistry ?? '' },
    { label: 'Chart repository', value: instance.chartRepository ?? '' },
    { label: 'Chart tag', value: instance.chartTag ?? '' },
    {
      label: 'Connection info',
      value: instance.connectionInfo ?? '',
      pre: true
    },
    { label: 'Status message', value: instance.statusMessage ?? '' },
    ...(instance.computedValues
      ? Object.entries(instance.computedValues).map(([k, v]) => ({
          label: k,
          value: v
        }))
      : [])
  ].filter((r) => !!r.value)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlugZap className="h-4 w-4" />
            {instance.name}
          </DialogTitle>
          <DialogDescription>
            Service instance details and advanced parameters.
          </DialogDescription>
        </DialogHeader>

        {/* ── Service info ── */}
        {infoRows.length > 0 && (
          <div className="px-1 py-2">
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Service info
            </p>
            <dl className="space-y-1.5">
              {infoRows.map(({ label, value, pre }) => (
                <div key={label} className="flex items-start gap-3">
                  <dt className="w-36 flex-shrink-0 text-xs text-muted-foreground">
                    {label}
                  </dt>
                  {pre ? (
                    <div className="flex min-w-0 flex-1 items-start gap-2">
                      <pre className="min-w-0 flex-1 whitespace-pre-wrap break-all font-mono text-xs text-foreground">
                        {value}
                      </pre>
                      <CopyButton value={value} />
                    </div>
                  ) : (
                    <dd className="min-w-0 break-all font-mono text-xs text-foreground">
                      {value}
                    </dd>
                  )}
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* ── Parameters form ── */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Advanced parameters
            </p>

            {/* Values override */}
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
                      className="min-h-[100px] font-mono text-xs text-muted-foreground placeholder:text-muted-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Credentials secret name */}
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

            {/* Credentials paths */}
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

            {/* Connection info template */}
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
                      className="min-h-[64px] font-mono text-xs text-muted-foreground placeholder:text-muted-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Service card ─────────────────────────────────────────────────────────────

function ServiceCard({
  instance,
  busyId,
  onDelete,
  onUpdate
}: {
  instance: WorkspaceServiceInstance
  busyId: string | null
  onDelete: (id: string) => void
  onUpdate: (updated: WorkspaceServiceInstance) => void
}) {
  const [paramsOpen, setParamsOpen] = useState(false)
  const isBusy = busyId === instance.id

  const isRunning = instance.state === WorkspaceServiceInstanceState.RUNNING
  const isTransient =
    instance.status === WorkspaceServiceInstanceStatus.PROGRESSING ||
    instance.status === WorkspaceServiceInstanceStatus.UNKNOWN

  const chartLabel =
    [instance.chartRepository, instance.chartTag ?? null]
      .filter(Boolean)
      .join(' · ') || null

  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-md"
        onClick={() => setParamsOpen(true)}
      >
        <CardContent className="flex items-start gap-4 px-5 py-4">
          {/* Service icon */}
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <PlugZap className="h-5 w-5 text-primary" />
          </div>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Name + status badge + chart label on one line */}
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold">{instance.name}</span>
              <StatusBadge status={instance.status} />
              {chartLabel && (
                <span className="text-[11px] text-muted-foreground">
                  {chartLabel}
                </span>
              )}
            </div>

            {/* Connection info as endpoint */}
            {instance.connectionInfo && (
              <div className="mt-0.5 inline-flex items-start gap-1">
                <pre className="line-clamp-2 whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-muted-foreground">
                  {instance.connectionInfo}
                </pre>
                <CopyButton value={instance.connectionInfo} />
              </div>
            )}

            {/* Status message — more prominent while transient */}
            {isTransient && (
              <div className="mt-1.5 flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2 py-1">
                <Loader2 className="h-3 w-3 flex-shrink-0 animate-spin text-amber-600 dark:text-amber-400" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  {instance.statusMessage ?? 'Starting…'}
                </p>
              </div>
            )}
            {!isTransient && instance.statusMessage && (
              <div className="mt-1.5 flex items-start gap-1.5">
                <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  {instance.statusMessage}
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div
            className="flex flex-shrink-0 items-start gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Parameters — only when running */}
            {isRunning && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setParamsOpen(true)}
                aria-label={`Parameters for ${instance.name}`}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}

            {/* Delete */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              disabled={isBusy}
              onClick={() => instance.id && onDelete(instance.id)}
              aria-label={`Delete ${instance.name}`}
            >
              {isBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ServiceParametersDialog
        instance={instance}
        open={paramsOpen}
        onOpenChange={setParamsOpen}
        onUpdate={onUpdate}
      />
    </>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ServiceCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-2.5 w-44" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-28 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-14 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkspaceServicesPage() {
  const params = useParams<{ workspaceId: string }>()
  const workspaceId = params?.workspaceId ?? ''
  const [instances, setInstances] = useState<
    WorkspaceServiceInstance[] | undefined
  >(undefined)
  const [busyId, setBusyId] = useState<string | null>(null)

  const POLL_INTERVAL_MS = 5_000

  const isTransient = (i: WorkspaceServiceInstance) =>
    i.status === WorkspaceServiceInstanceStatus.PROGRESSING ||
    i.status === WorkspaceServiceInstanceStatus.UNKNOWN

  const load = useCallback(async () => {
    if (!workspaceId) return
    const result = await workspaceServiceInstanceList(workspaceId)
    if (result.data) setInstances(result.data)
    if (result.error)
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive'
      })
  }, [workspaceId])

  // Initial load
  useEffect(() => {
    load()
  }, [load])

  // Poll while any instance is in a transient state
  const hasTransient = instances?.some(isTransient) ?? false
  useEffect(() => {
    if (!hasTransient) return
    const id = setInterval(load, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [hasTransient, load])

  function replaceInstance(updated: WorkspaceServiceInstance) {
    setInstances((prev) =>
      prev?.map((i) => (i.id === updated.id ? updated : i))
    )
  }

  async function handleDelete(id: string) {
    setBusyId(id)
    const result = await workspaceServiceInstanceDelete(id)
    setBusyId(null)
    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive'
      })
      return
    }
    setInstances((prev) => prev?.filter((i) => i.id !== id))
    toast({ title: 'Service instance deleted' })
  }

  const createForm = (
    <WorkspaceServiceInstanceCreateForm
      workspaceId={workspaceId}
      onSuccess={(instance) =>
        setInstances((prev) => [...(prev ?? []), instance])
      }
    />
  )

  return (
    <div className="mt-6 w-full space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <PlugZap className="h-5 w-5" />
            Services
          </h2>
          <p className="text-xs text-muted-foreground">
            Helm-based services deployed in this workspace.
          </p>
        </div>
        {instances && instances.length > 0 && createForm}
      </div>

      {/* Loading */}
      {instances === undefined && (
        <div className="grid gap-4 sm:grid-cols-2">
          <ServiceCardSkeleton />
          <ServiceCardSkeleton />
        </div>
      )}

      {/* Empty state */}
      {instances?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <PlugZap className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No services yet</p>
          <p className="mb-6 mt-1 max-w-xs text-xs text-muted-foreground">
            Deploy a Helm-based service into this workspace to get started.
          </p>
          {createForm}
        </div>
      )}

      {/* Service grid */}
      {instances && instances.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {instances.map((instance) => (
            <ServiceCard
              key={instance.id}
              instance={instance}
              busyId={busyId}
              onDelete={handleDelete}
              onUpdate={replaceInstance}
            />
          ))}
        </div>
      )}
    </div>
  )
}
