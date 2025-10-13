'use client'

import { Filter, Search } from 'lucide-react'
import React, { Suspense } from 'react'

import { GeneratedDataTable } from '@/components/templates/data-table-template'
import {
  GeneratedDataForm,
  GeneratedEquipmentTracker,
  GeneratedKanbanBoard,
  GeneratedMetricsDashboard,
  GeneratedProtocolBuilder,
  GeneratedSampleTracker,
  GeneratedTimeline
} from '@/components/templates/enhanced-components'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { ComponentSpec } from '@/types/component-system'

// Props for generated components
interface GeneratedMetricCardProps {
  title: string
  value: number | string
  description?: string
  trend?: 'up' | 'down' | 'neutral'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive'
}

interface GeneratedProgressBarProps {
  current: number
  total: number
  label?: string
  showPercentage?: boolean
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive'
}

interface GeneratedSearchFilterProps {
  placeholder?: string
  filters?: Array<{
    key: string
    label: string
    options: string[]
  }>
  onSearch?: (query: string) => void
  onFilter?: (filters: Record<string, string>) => void
}

// Generated Metric Card Component
function GeneratedMetricCard({
  title,
  value,
  description,
  trend = 'neutral',
  color = 'primary'
}: GeneratedMetricCardProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-muted-foreground'
  }

  const trendSymbols = {
    up: '↗',
    down: '↘',
    neutral: ''
  }

  return (
    <Card className="min-w-64">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          {trend !== 'neutral' && (
            <span className={`text-sm ${trendColors[trend]}`}>
              {trendSymbols[trend]}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

// Generated Progress Bar Component
function GeneratedProgressBar({
  current,
  total,
  label,
  showPercentage = true,
  color = 'primary'
}: GeneratedProgressBarProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{label || 'Progress'}</span>
            {showPercentage && (
              <span className="text-sm text-muted-foreground">
                {percentage}%
              </span>
            )}
          </div>
          <Progress value={percentage} className="w-full" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{current.toLocaleString()}</span>
            <span>{total.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Generated Search Filter Component
function GeneratedSearchFilter({
  placeholder = 'Search...',
  filters = [],
  onSearch,
  onFilter
}: GeneratedSearchFilterProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeFilters, setActiveFilters] = React.useState<
    Record<string, string>
  >({})

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleFilterChange = (filterKey: string, value: string) => {
    const newFilters = { ...activeFilters, [filterKey]: value }
    setActiveFilters(newFilters)
    onFilter?.(newFilters)
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          {filters.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters</span>
              </div>
              {filters.map((filter) => (
                <div key={filter.key} className="space-y-1">
                  <label className="text-xs text-muted-foreground">
                    {filter.label}
                  </label>
                  <select
                    className="w-full rounded border border-input bg-background px-3 py-1 text-sm"
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                  >
                    <option value="">All</option>
                    {filter.options.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Enhanced component map for dynamic rendering inspired by AgenticGenUI
const componentMap = {
  GeneratedDataTable,
  GeneratedMetricCard,
  GeneratedProgressBar,
  GeneratedSearchFilter,
  GeneratedMetricsDashboard,
  GeneratedEquipmentTracker,
  GeneratedProtocolBuilder,
  GeneratedSampleTracker,
  GeneratedKanbanBoard,
  GeneratedDataForm,
  GeneratedTimeline
} as const

// Loading skeleton for components
function ComponentSkeleton({ type }: { type: string }) {
  switch (type) {
    case 'GeneratedDataTable':
      return (
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      )
    case 'GeneratedMetricCard':
      return (
        <Card className="min-w-64">
          <CardHeader>
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="mt-2 h-3 w-32" />
          </CardContent>
        </Card>
      )
    case 'GeneratedProgressBar':
      return (
        <Card className="w-full">
          <CardContent className="pt-6">
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="mb-2 h-2 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-8" />
            </div>
          </CardContent>
        </Card>
      )
    default:
      return <Skeleton className="h-24 w-full" />
  }
}

// Error boundary for component rendering
function ComponentErrorBoundary({
  children,
  componentSpec
}: {
  children: React.ReactNode
  componentSpec: ComponentSpec
}) {
  return (
    <React.Suspense
      fallback={<ComponentSkeleton type={componentSpec.component} />}
    >
      {children}
    </React.Suspense>
  )
}

// Main dynamic renderer
export interface DynamicRendererProps {
  componentSpec: ComponentSpec
  data?: unknown
  className?: string
  onError?: (error: Error) => void
}

export function DynamicRenderer({
  componentSpec,
  data,
  className = '',
  onError
}: DynamicRendererProps) {
  const [renderError, setRenderError] = React.useState<string | null>(null)

  const resolvedProps = React.useMemo(() => {
    try {
      const props = { ...componentSpec.props }

      // Replace API data placeholders
      if (data) {
        Object.keys(props).forEach((key) => {
          if (
            typeof props[key] === 'string' &&
            props[key].includes('{{API_DATA}}')
          ) {
            props[key] = data
          } else if (
            typeof props[key] === 'string' &&
            props[key].includes('{{API_DATA.')
          ) {
            // Extract nested property path
            const match = props[key].match(/\{\{API_DATA\.(.+?)\}\}/)
            if (match) {
              const path = match[1]
              props[key] = getNestedProperty(data, path)
            }
          }
        })
      }

      return props
    } catch (error) {
      setRenderError(
        error instanceof Error ? error.message : 'Failed to resolve props'
      )
      onError?.(error instanceof Error ? error : new Error('Unknown error'))
      return componentSpec.props
    }
  }, [componentSpec.props, data, onError])

  if (renderError) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertDescription>
          Failed to render component: {renderError}
        </AlertDescription>
      </Alert>
    )
  }

  const Component =
    componentMap[componentSpec.component as keyof typeof componentMap]

  if (!Component) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertDescription>
          Unknown component type: {componentSpec.component}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <ComponentErrorBoundary componentSpec={componentSpec}>
      <div className={className}>
        <Component {...resolvedProps} />
      </div>
    </ComponentErrorBoundary>
  )
}

// Helper function to get nested properties
function getNestedProperty(obj: unknown, path: string): unknown {
  return path.split('.').reduce((current, prop) => current?.[prop], obj)
}
