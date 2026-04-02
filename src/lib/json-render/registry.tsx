'use client'

import {
  type BaseComponentProps,
  type ComponentRegistry,
  type ComponentRenderProps
} from '@json-render/react'
import { shadcnComponents } from '@json-render/shadcn'
import {
  Activity,
  CheckCircle,
  CheckCircle2,
  Circle,
  CircleDot,
  Clock,
  Database,
  FileText,
  MonitorCog,
  Settings,
  Shield,
  User,
  Users
} from 'lucide-react'
import React, { useEffect } from 'react'

import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  users: Users,
  database: Database,
  shield: Shield,
  'file-text': FileText,
  settings: Settings,
  activity: Activity,
  clock: Clock,
  'check-circle': CheckCircle
}

interface WorkflowHeaderProps {
  title: string
  currentStep: number
  totalSteps: number
}

interface WorkflowStepProps {
  title: string
  description?: string
  status: 'completed' | 'current' | 'upcoming'
  responsible?: string
  system?: string
  docRef?: string
}

interface StatusFieldProps {
  label: string
  value: string
  variant?: 'success' | 'warning' | 'danger' | 'muted' | 'default'
}

interface InfoCardProps {
  title: string
  icon?: string
}

/**
 * Bridge: the Renderer passes ComponentRenderProps { element, children, emit, on }
 * but shadcn components expect BaseComponentProps { props, children, emit, on, bindings }
 * This wraps a shadcn component to extract element.props → props.
 */
function wrapShadcn<P extends Record<string, unknown>>(
  ShadcnComponent: React.ComponentType<BaseComponentProps<P>>
): React.ComponentType<ComponentRenderProps> {
  return function WrappedShadcn({
    element,
    children,
    emit,
    on,
    bindings
  }: ComponentRenderProps) {
    return (
      <ShadcnComponent
        props={element.props as P}
        emit={emit}
        on={on}
        bindings={bindings}
      >
        {children}
      </ShadcnComponent>
    )
  }
}

export const chorusRegistry: ComponentRegistry = {
  // shadcn base components (wrapped for Renderer compatibility)
  Card: wrapShadcn(shadcnComponents.Card),
  Stack: wrapShadcn(shadcnComponents.Stack),
  Grid: wrapShadcn(shadcnComponents.Grid),
  Text: wrapShadcn(shadcnComponents.Text),
  Badge: wrapShadcn(shadcnComponents.Badge),
  Separator: wrapShadcn(shadcnComponents.Separator),
  Heading: wrapShadcn(shadcnComponents.Heading),
  Alert: wrapShadcn(shadcnComponents.Alert),
  Progress: wrapShadcn(shadcnComponents.Progress),
  Table: wrapShadcn(shadcnComponents.Table),

  // Chorus: WorkflowHeader
  WorkflowHeader: ({ element }: ComponentRenderProps<WorkflowHeaderProps>) => {
    const p = element.props
    return (
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold">{p.title}</h3>
          <p className="text-xs text-muted-foreground">
            {p.totalSteps} steps — Step {p.currentStep + 1} of {p.totalSteps}
          </p>
        </div>
      </div>
    )
  },

  // Chorus: WorkflowStep
  WorkflowStep: ({ element }: ComponentRenderProps<WorkflowStepProps>) => {
    const p = element.props
    const icon =
      p.status === 'completed' ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
      ) : p.status === 'current' ? (
        <CircleDot className="h-4 w-4 shrink-0 text-primary" />
      ) : (
        <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
      )

    return (
      <div
        className={cn(
          'rounded-md px-3 py-2',
          p.status === 'current' && 'bg-primary/5'
        )}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span
            className={cn(
              'flex-1 text-sm',
              p.status === 'completed' && 'text-muted-foreground line-through',
              p.status === 'current' && 'font-medium text-foreground',
              p.status === 'upcoming' && 'text-muted-foreground'
            )}
          >
            {p.title}
          </span>
          {p.status === 'current' && (
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              current
            </span>
          )}
        </div>
        <div className="mt-1 pl-6">
          <p className="text-xs text-muted-foreground/80">{p.description}</p>
          {(p.responsible ?? p.system ?? p.docRef) && (
            <div className="mt-1.5 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
              {p.responsible && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {p.responsible}
                </span>
              )}
              {p.system && (
                <span className="flex items-center gap-1">
                  <MonitorCog className="h-3 w-3" />
                  {p.system}
                </span>
              )}
              {p.docRef && (
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {p.docRef}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    )
  },

  // Chorus: StatusField
  StatusField: ({ element }: ComponentRenderProps<StatusFieldProps>) => {
    const p = element.props
    const variantClass: Record<string, string> = {
      success: 'text-emerald-500',
      warning: 'text-amber-500',
      danger: 'text-red-500',
      muted: 'text-muted-foreground',
      default: 'text-foreground'
    }
    return (
      <div className="flex items-center justify-between py-1">
        <span className="text-xs text-muted-foreground">{p.label}</span>
        <span
          className={cn(
            'text-xs font-medium',
            variantClass[p.variant ?? 'default']
          )}
        >
          {p.value}
        </span>
      </div>
    )
  },

  // Chorus: InfoCard
  InfoCard: ({ element, children }: ComponentRenderProps<InfoCardProps>) => {
    const p = element.props
    const Icon = p.icon ? ICON_MAP[p.icon] : null
    return (
      <div className="rounded-md border bg-card p-3">
        <div className="mb-2 flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <h4 className="text-xs font-semibold">{p.title}</h4>
        </div>
        {children}
      </div>
    )
  },

  // Chorus: DataLoader
  DataLoader: ({ emit }: ComponentRenderProps) => {
    useEffect(() => {
      if (emit) emit('load', {})
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return null
  },

  // Chorus: StatusBadge
  StatusBadge: ({
    element
  }: ComponentRenderProps<{ status: string; label?: string }>) => {
    const { status, label } = element.props
    const variantClass: Record<string, string> = {
      active: 'bg-emerald-500/10 text-emerald-500',
      inactive: 'bg-amber-500/10 text-amber-500',
      deleted: 'bg-red-500/10 text-red-500'
    }
    const cls = variantClass[status] ?? 'bg-muted text-muted-foreground'
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
          cls
        )}
      >
        {label ?? status}
      </span>
    )
  },

  // Chorus: SearchResultItem
  SearchResultItem: ({
    element
  }: ComponentRenderProps<{
    title: string
    collection: string
    passage: string
    document: string
  }>) => {
    const { title, collection, passage, document } = element.props
    const COLLECTION_LABELS: Record<string, string> = {
      bpr: 'BPR QMS',
      dsi: 'DSI',
      chorus: 'Chorus',
      all: 'All Collections'
    }
    return (
      <div className="space-y-1 rounded-lg border border-muted/30 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-xs font-medium">{title}</span>
          </div>
          <span className="shrink-0 rounded-full border px-1.5 py-0.5 text-[10px]">
            {COLLECTION_LABELS[collection] ?? collection}
          </span>
        </div>
        <p className="line-clamp-3 text-xs text-muted-foreground">{passage}</p>
        <p className="text-[10px] text-muted-foreground/60">{document}</p>
      </div>
    )
  },

  // Chorus: WorkspacePickerItem
  WorkspacePickerItem: ({
    element,
    emit
  }: ComponentRenderProps<{
    id: string
    name: string
    status: string
    memberCount: number
    workbenchCount: number
  }>) => {
    const { id, name, status, memberCount, workbenchCount } = element.props
    const variantClass: Record<string, string> = {
      active: 'bg-emerald-500/10 text-emerald-500',
      inactive: 'bg-amber-500/10 text-amber-500',
      deleted: 'bg-red-500/10 text-red-500'
    }
    const cls = variantClass[status] ?? 'bg-muted text-muted-foreground'
    return (
      <button
        type="button"
        onClick={() => emit?.('click', { workspaceId: id })}
        className="flex w-full items-center justify-between rounded-lg border border-muted/30 px-3 py-2 text-left text-xs transition-colors hover:border-primary/40 hover:bg-primary/5"
      >
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{name}</span>
          <span className="text-muted-foreground">
            {memberCount} members · {workbenchCount} sessions
          </span>
        </div>
        <span
          className={cn(
            'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
            cls
          )}
        >
          {status}
        </span>
      </button>
    )
  },
}
