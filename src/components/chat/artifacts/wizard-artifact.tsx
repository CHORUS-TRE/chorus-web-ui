'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Brain,
  ChartBar,
  CheckCircle2,
  ChevronRight,
  Database,
  FlaskConical,
  Folder,
  Loader2,
  Users
} from 'lucide-react'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { WorkspaceWithDev } from '@/domain/model'
import { cn } from '@/lib/utils'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAppState } from '@/stores/app-state-store'
import { workspaceCreateWithDev } from '@/view-model/workspace-view-model'

const PROJECT_TYPES = [
  {
    id: 'clinical-study',
    label: 'Clinical Study',
    icon: FlaskConical,
    description: 'RCTs, observational studies, clinical trials'
  },
  {
    id: 'data-analysis',
    label: 'Data Analysis',
    icon: ChartBar,
    description: 'Statistical analysis, epidemiology, biostatistics'
  },
  {
    id: 'ml-training',
    label: 'ML / AI',
    icon: Brain,
    description: 'Machine learning, deep learning, NLP on clinical data'
  },
  {
    id: 'general',
    label: 'General Research',
    icon: Folder,
    description: 'Other research purposes'
  }
]

const WizardSchema = z.object({
  name: z.string().min(3, 'At least 3 characters'),
  shortName: z
    .string()
    .min(3, 'At least 3 characters')
    .max(20, 'Max 20 characters')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  description: z.string().optional()
})
type WizardForm = z.infer<typeof WizardSchema>

interface WizardArtifactProps {
  projectType?: string
  suggestedName?: string | null
  context?: string | null
  onComplete?: () => void
}

export function WizardArtifact({
  projectType: initialType,
  suggestedName,
  context,
  onComplete
}: WizardArtifactProps) {
  const { user } = useAuthentication()
  const refreshWorkspaces = useAppState((s) => s.refreshWorkspaces)

  const [step, setStep] = useState(initialType ? 1 : 0)
  const [selectedType, setSelectedType] = useState(initialType ?? '')
  const [isPending, startTransition] = useTransition()
  const [done, setDone] = useState(false)

  const form = useForm<WizardForm>({
    resolver: zodResolver(WizardSchema),
    defaultValues: {
      name: suggestedName ?? '',
      shortName: suggestedName
        ? suggestedName
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
        : '',
      description: context ?? ''
    }
  })

  const toShortName = (name: string) =>
    name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 20)

  const handleSubmit = form.handleSubmit((data) => {
    if (!user) return
    startTransition(async () => {
      const formData = new FormData()
      formData.set('tenantId', '1')
      formData.set('userId', user.id)
      formData.set('name', data.name)
      formData.set('shortName', data.shortName)
      if (data.description) formData.set('description', data.description)

      const emptyResult: { data?: WorkspaceWithDev; error?: string } = {}
      const result = await workspaceCreateWithDev(
        emptyResult as never,
        formData
      )
      if (result.error) {
        toast({ title: result.error, variant: 'destructive' })
        return
      }
      await refreshWorkspaces()
      setDone(true)
      toast({ title: 'Workspace created!', description: data.name })
      onComplete?.()
    })
  })

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-8">
        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        <p className="font-semibold text-emerald-300">Workspace created!</p>
        <p className="text-center text-sm text-muted-foreground">
          Your new workspace{' '}
          <span className="font-medium text-foreground">
            {form.getValues('name')}
          </span>{' '}
          is ready.
        </p>
      </div>
    )
  }

  const steps = [
    { label: 'Project type', icon: Folder },
    { label: 'Details', icon: Database },
    { label: 'Review', icon: Users }
  ]

  return (
    <div className="overflow-hidden rounded-xl border border-muted/40 bg-contrast-background/60 backdrop-blur-sm">
      {/* Step indicator */}
      <div className="flex items-center gap-0 border-b border-muted/30 px-4 py-3">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center">
            <button
              onClick={() => i < step && setStep(i)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors',
                i === step
                  ? 'bg-primary/20 text-primary'
                  : i < step
                    ? 'cursor-pointer text-muted-foreground hover:text-foreground'
                    : 'text-muted-foreground/40'
              )}
            >
              <s.icon className="h-3.5 w-3.5" />
              {s.label}
            </button>
            {i < steps.length - 1 && (
              <ChevronRight className="mx-0.5 h-3 w-3 text-muted-foreground/30" />
            )}
          </div>
        ))}
      </div>

      <div className="p-4">
        {/* Step 0: Project type */}
        {step === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              What type of research project is this?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PROJECT_TYPES.map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => {
                    setSelectedType(pt.id)
                    setStep(1)
                  }}
                  className={cn(
                    'flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-all',
                    selectedType === pt.id
                      ? 'border-primary bg-primary/10'
                      : 'border-muted/40 bg-background/30 hover:border-muted hover:bg-background/50'
                  )}
                >
                  <pt.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{pt.label}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {pt.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Name & description */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setStep(2)
            }}
            className="space-y-3"
          >
            <p className="text-sm text-muted-foreground">
              {PROJECT_TYPES.find((p) => p.id === selectedType)?.label ??
                'Research'}{' '}
              workspace details
            </p>
            <div className="space-y-1.5">
              <Label className="text-xs">Workspace name</Label>
              <Input
                {...form.register('name', {
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const v = toShortName(e.target.value)
                    form.setValue('shortName', v, { shouldValidate: true })
                  }
                })}
                placeholder="e.g. CARDIOX Study 2025"
                className="h-8 text-sm"
              />
              {form.formState.errors.name && (
                <p className="text-[11px] text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">
                Short name{' '}
                <span className="text-muted-foreground">(used in URLs)</span>
              </Label>
              <Input
                {...form.register('shortName')}
                placeholder="e.g. cardiox-2025"
                className="h-8 font-mono text-sm"
              />
              {form.formState.errors.shortName && (
                <p className="text-[11px] text-destructive">
                  {form.formState.errors.shortName.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">
                Description{' '}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                {...form.register('description')}
                placeholder="Brief description of the research project..."
                className="min-h-16 resize-none text-sm"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep(0)}
              >
                Back
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!form.watch('name') || !form.watch('shortName')}
              >
                Continue
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Review before creating
            </p>
            <div className="space-y-2 rounded-lg border border-muted/30 bg-background/30 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">
                  {PROJECT_TYPES.find((p) => p.id === selectedType)?.label ??
                    selectedType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{form.getValues('name')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Short name</span>
                <span className="font-mono text-xs">
                  {form.getValues('shortName')}
                </span>
              </div>
              {form.getValues('description') && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-muted-foreground">Description</span>
                  <span className="text-xs">
                    {form.getValues('description')}
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button size="sm" onClick={handleSubmit} disabled={isPending}>
                {isPending && (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                )}
                Create workspace
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
