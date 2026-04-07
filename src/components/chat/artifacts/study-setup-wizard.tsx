'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Brain,
  ChartBar,
  CheckCircle2,
  ChevronRight,
  Database,
  FileCheck,
  FlaskConical,
  Folder,
  ImageIcon,
  Loader2,
  Settings,
  TestTubes
} from 'lucide-react'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from '@/components/hooks/use-toast'
import { WorkspaceWithDev } from '@/domain/model'
import { cn } from '@/lib/utils'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAppState } from '@/stores/app-state-store'
import { workspaceCreateWithDev } from '@/view-model/workspace-view-model'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

const STUDY_TYPES = [
  {
    id: 'clinical-trial',
    label: 'Clinical Trial',
    icon: FlaskConical,
    description: 'RCTs, interventional studies, drug/device trials'
  },
  {
    id: 'observational',
    label: 'Observational',
    icon: ChartBar,
    description: 'Prospective or cross-sectional, no intervention'
  },
  {
    id: 'data-analysis',
    label: 'Data Analysis',
    icon: Database,
    description: 'Retrospective analysis, epidemiology, biostatistics'
  },
  {
    id: 'ml-ai',
    label: 'ML / AI',
    icon: Brain,
    description: 'Machine learning, NLP, AI on clinical data'
  },
  {
    id: 'general',
    label: 'General Research',
    icon: Folder,
    description: 'Other research purposes'
  }
] as const

type StudyTypeId = (typeof STUDY_TYPES)[number]['id']

interface RegulatoryItem {
  id: string
  label: string
  description: string
  requiredFor: StudyTypeId[]
  optionalFor: StudyTypeId[]
}

const REGULATORY_ITEMS: RegulatoryItem[] = [
  {
    id: 'cer-vd',
    label: 'CER-VD Ethics Approval',
    description: 'Submit via BASEC portal',
    requiredFor: ['clinical-trial', 'observational', 'ml-ai'],
    optionalFor: ['data-analysis', 'general']
  },
  {
    id: 'swissmedic',
    label: 'Swissmedic Authorization',
    description: 'Required for drug/device trials (Cat. B/C)',
    requiredFor: ['clinical-trial'],
    optionalFor: []
  },
  {
    id: 'snctp',
    label: 'SNCTP Registration',
    description: 'National clinical trial registry (Kofam)',
    requiredFor: ['clinical-trial'],
    optionalFor: []
  },
  {
    id: 'dmc',
    label: 'DMC Charter',
    description: 'Data Monitoring Committee — risk-dependent',
    requiredFor: [],
    optionalFor: ['clinical-trial']
  },
  {
    id: 'insurance',
    label: 'Insurance Certificate',
    description: 'Required for interventional studies',
    requiredFor: ['clinical-trial'],
    optionalFor: ['observational']
  },
  {
    id: 'general-consent',
    label: 'General Consent Check',
    description: 'Verify patient consent via HORUS Consent',
    requiredFor: ['data-analysis', 'ml-ai'],
    optionalFor: ['observational', 'general']
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

interface StudySetupWizardProps {
  studyType?: string | null
  suggestedName?: string | null
  regulatoryStatus?: string | null
  dataNeedsHint?: string | null
  context?: string | null
  onComplete?: () => void
}

// ────────────────────────────────────────────
// Component
// ────────────────────────────────────────────

export function StudySetupWizard({
  studyType: initialType,
  suggestedName,
  regulatoryStatus,
  dataNeedsHint,
  context,
  onComplete
}: StudySetupWizardProps) {
  const { user } = useAuthentication()
  const refreshWorkspaces = useAppState((s) => s.refreshWorkspaces)

  const [step, setStep] = useState(initialType ? 1 : 0)
  const [selectedType, setSelectedType] = useState<string>(initialType ?? '')
  const [checkedRegulatory, setCheckedRegulatory] = useState<
    Record<string, 'required' | 'done' | 'na'>
  >({})
  const [dataNeeds, setDataNeeds] = useState({
    cdw: dataNeedsHint === 'cdw',
    external: dataNeedsHint === 'external',
    imaging: dataNeedsHint === 'imaging',
    biobank: dataNeedsHint === 'biobank'
  })
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

  // Auto-populate regulatory checklist when study type changes
  const populateRegulatory = (type: string) => {
    const initial: Record<string, 'required' | 'done' | 'na'> = {}
    for (const item of REGULATORY_ITEMS) {
      if (item.requiredFor.includes(type as StudyTypeId)) {
        initial[item.id] = regulatoryStatus === 'approved' ? 'done' : 'required'
      } else if (item.optionalFor.includes(type as StudyTypeId)) {
        initial[item.id] = 'na'
      }
    }
    setCheckedRegulatory(initial)
  }

  const handleSubmit = form.handleSubmit((data) => {
    if (!user) return
    startTransition(async () => {
      const formData = new FormData()
      formData.set('tenantId', '1')
      formData.set('userId', user.id)
      formData.set('name', data.name)
      formData.set('shortName', data.shortName)
      if (data.description) formData.set('description', data.description)

      // Map study type + data needs → workspace dev config
      const needsGpu = selectedType === 'ml-ai'
      const isInterventional = selectedType === 'clinical-trial'
      const needsColdStorage = dataNeeds.cdw || dataNeeds.imaging

      formData.set('network', isInterventional ? 'restricted' : 'standard')
      formData.set('allowCopyPaste', isInterventional ? 'false' : 'true')
      formData.set('resourcePreset', needsGpu ? 'gpu' : 'standard')
      if (needsGpu) formData.set('gpu', '1')
      formData.set('coldStorageEnabled', needsColdStorage ? 'true' : 'false')
      formData.set('hotStorageEnabled', 'true')
      formData.set('serviceGitlab', 'true')
      formData.set('serviceK8s', selectedType === 'ml-ai' ? 'true' : 'false')
      formData.set('serviceHpc', needsGpu ? 'true' : 'false')

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

  // ── Done state ──
  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-8">
        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        <p className="font-semibold text-emerald-300">Workspace created!</p>
        <p className="text-center text-sm text-muted-foreground">
          Your study workspace{' '}
          <span className="font-medium text-foreground">
            {form.getValues('name')}
          </span>{' '}
          is ready.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-1.5 text-[11px]">
          {dataNeeds.cdw && (
            <Badge variant="outline">Next: Request CDW data</Badge>
          )}
          {Object.values(checkedRegulatory).some((v) => v === 'required') && (
            <Badge variant="outline">Next: Complete regulatory</Badge>
          )}
          {!dataNeeds.cdw &&
            !Object.values(checkedRegulatory).some((v) => v === 'required') && (
              <Badge variant="outline">Next: Add team members</Badge>
            )}
        </div>
      </div>
    )
  }

  // ── Steps ──
  const steps = [
    { label: 'Study type', icon: FlaskConical },
    { label: 'Regulatory', icon: FileCheck },
    { label: 'Data needs', icon: Database },
    { label: 'Workspace', icon: Settings },
    { label: 'Review', icon: CheckCircle2 }
  ]

  return (
    <div className="overflow-hidden rounded-xl border border-muted/40 bg-contrast-background/60 backdrop-blur-sm">
      {/* Step indicator */}
      <div className="flex items-center gap-0 overflow-x-auto border-b border-muted/30 px-3 py-2.5">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center">
            <button
              onClick={() => i < step && setStep(i)}
              className={cn(
                'flex items-center gap-1 whitespace-nowrap rounded-lg px-1.5 py-1 text-[11px] font-medium transition-colors',
                i === step
                  ? 'bg-primary/20 text-primary'
                  : i < step
                    ? 'cursor-pointer text-muted-foreground hover:text-foreground'
                    : 'text-muted-foreground/40'
              )}
            >
              <s.icon className="h-3 w-3" />
              {s.label}
            </button>
            {i < steps.length - 1 && (
              <ChevronRight className="mx-0.5 h-3 w-3 text-muted-foreground/30" />
            )}
          </div>
        ))}
      </div>

      <div className="p-4">
        {/* ── Step 0: Study Type ── */}
        {step === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              What type of research study is this?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {STUDY_TYPES.map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => {
                    setSelectedType(pt.id)
                    populateRegulatory(pt.id)
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

        {/* ── Step 1: Regulatory Checklist ── */}
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Regulatory requirements for{' '}
              {STUDY_TYPES.find((t) => t.id === selectedType)?.label}
            </p>
            <div className="space-y-2">
              {REGULATORY_ITEMS.filter(
                (item) =>
                  item.requiredFor.includes(selectedType as StudyTypeId) ||
                  item.optionalFor.includes(selectedType as StudyTypeId)
              ).map((item) => {
                const state = checkedRegulatory[item.id]
                const isRequired = item.requiredFor.includes(
                  selectedType as StudyTypeId
                )

                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-2 rounded-lg border border-muted/30 px-3 py-2"
                  >
                    <Checkbox
                      checked={state === 'done'}
                      onCheckedChange={(checked) =>
                        setCheckedRegulatory((prev) => ({
                          ...prev,
                          [item.id]: checked ? 'done' : 'required'
                        }))
                      }
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                        {isRequired ? (
                          <Badge
                            variant="destructive"
                            className="px-1 py-0 text-[9px]"
                          >
                            required
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="px-1 py-0 text-[9px]"
                          >
                            optional
                          </Badge>
                        )}
                        {state === 'done' && (
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
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
              <Button size="sm" onClick={() => setStep(2)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 2: Data Needs ── */}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              What data will you need for this study?
            </p>
            <div className="space-y-2">
              {[
                {
                  key: 'cdw' as const,
                  icon: Database,
                  label: 'Clinical Data Warehouse (CDW)',
                  description:
                    'Patient data from CHUV — via DSI extraction process'
                },
                {
                  key: 'external' as const,
                  icon: Folder,
                  label: 'External Data Import',
                  description: 'Bring external datasets into your workspace'
                },
                {
                  key: 'imaging' as const,
                  icon: ImageIcon,
                  label: 'Medical Imaging',
                  description: 'De-identified DICOM images via HORUS Image'
                },
                {
                  key: 'biobank' as const,
                  icon: TestTubes,
                  label: 'Genomic Biobank Samples',
                  description:
                    'Samples from BGC — requires scientific committee approval'
                }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() =>
                    setDataNeeds((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key]
                    }))
                  }
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all',
                    dataNeeds[item.key]
                      ? 'border-primary bg-primary/5'
                      : 'border-muted/30 hover:border-muted'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-4 w-4',
                      dataNeeds[item.key]
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{item.label}</span>
                    <p className="text-[11px] text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  {dataNeeds[item.key] && (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button size="sm" onClick={() => setStep(3)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Workspace Config ── */}
        {step === 3 && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setStep(4)
            }}
            className="space-y-3"
          >
            <p className="text-sm text-muted-foreground">
              Configure your workspace
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
                onClick={() => setStep(2)}
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

        {/* ── Step 4: Review ── */}
        {step === 4 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Review before creating
            </p>
            <div className="space-y-2 rounded-lg border border-muted/30 bg-background/30 p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Study type</span>
                <span className="font-medium">
                  {STUDY_TYPES.find((t) => t.id === selectedType)?.label ??
                    selectedType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Workspace</span>
                <span className="font-medium">{form.getValues('name')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Short name</span>
                <span className="font-mono text-xs">
                  {form.getValues('shortName')}
                </span>
              </div>

              {/* Regulatory summary */}
              <div className="flex flex-col gap-1 border-t border-muted/20 pt-2">
                <span className="text-muted-foreground">Regulatory</span>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(checkedRegulatory)
                    .filter(([, v]) => v !== 'na')
                    .map(([id, state]) => {
                      const item = REGULATORY_ITEMS.find((r) => r.id === id)
                      return (
                        <Badge
                          key={id}
                          variant={state === 'done' ? 'default' : 'destructive'}
                          className="text-[10px]"
                        >
                          {state === 'done' ? '✓' : '○'} {item?.label}
                        </Badge>
                      )
                    })}
                </div>
              </div>

              {/* Data needs summary */}
              {Object.values(dataNeeds).some(Boolean) && (
                <div className="flex flex-col gap-1 border-t border-muted/20 pt-2">
                  <span className="text-muted-foreground">Data needs</span>
                  <div className="flex flex-wrap gap-1">
                    {dataNeeds.cdw && (
                      <Badge variant="secondary" className="text-[10px]">
                        CDW
                      </Badge>
                    )}
                    {dataNeeds.external && (
                      <Badge variant="secondary" className="text-[10px]">
                        External
                      </Badge>
                    )}
                    {dataNeeds.imaging && (
                      <Badge variant="secondary" className="text-[10px]">
                        Imaging
                      </Badge>
                    )}
                    {dataNeeds.biobank && (
                      <Badge variant="secondary" className="text-[10px]">
                        Biobank
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(3)}>
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
