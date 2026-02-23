/**
 * Workspace Resources Panel Component
 *
 * Displays resource allocation and usage metrics (GPU, CPU, RAM, Storage)
 *
 * @accessibility
 * - ARIA labels for progress bars with percentage values
 * - Color-blind friendly status indicators
 * - Screen reader announcements for high usage warnings
 * - Accessible data table alternative
 *
 * @eco-design
 * - Memoized resource cards
 * - Minimal re-renders with React.memo
 * - Efficient progress bar updates
 */

'use client'

import {
  AlertTriangle,
  CheckCircle,
  Cpu,
  HardDrive,
  Info,
  MemoryStick,
  Monitor
} from 'lucide-react'
import * as React from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

import type { ResourceAllocation } from '../types/enhanced-models'

// ============================================================================
// Props Interface
// ============================================================================

export interface WorkspaceResourcesPanelProps {
  resources: ResourceAllocation
}

// ============================================================================
// Resource Card Component
// ============================================================================

interface ResourceCardProps {
  icon: React.ElementType
  title: string
  allocated: number
  used: number
  unit: string
  description?: string
  model?: string
}

const ResourceCard = React.memo(function ResourceCard({
  icon: Icon,
  title,
  allocated,
  used,
  unit,
  description,
  model
}: ResourceCardProps) {
  const usagePercentage = allocated > 0 ? (used / allocated) * 100 : 0
  const available = allocated - used

  // Determine status color and icon
  const getStatusConfig = () => {
    if (usagePercentage >= 90) {
      return {
        color: 'destructive' as const,
        icon: AlertTriangle,
        label: 'Critical',
        textColor: 'text-red-600',
        bgColor: 'bg-red-50 dark:bg-red-950'
      }
    } else if (usagePercentage >= 75) {
      return {
        color: 'default' as const,
        icon: AlertTriangle,
        label: 'High',
        textColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950'
      }
    } else {
      return {
        color: 'secondary' as const,
        icon: CheckCircle,
        label: 'Normal',
        textColor: 'text-green-600',
        bgColor: 'bg-green-50 dark:bg-green-950'
      }
    }
  }

  const status = getStatusConfig()
  const StatusIcon = status.icon

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Icon className="h-5 w-5" aria-hidden="true" />
            {title}
          </CardTitle>
          <Badge variant={status.color} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" aria-hidden="true" />
            {status.label}
          </Badge>
        </div>
        {model && (
          <CardDescription className="text-xs">Model: {model}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Usage</span>
            <span
              className="font-medium"
              aria-label={`${usagePercentage.toFixed(1)}% of ${title.toLowerCase()} capacity used`}
            >
              {usagePercentage.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={usagePercentage}
            className="h-3"
            aria-label={`${title} usage progress: ${used} of ${allocated} ${unit} used`}
          />
        </div>

        {/* Numeric Details */}
        <div
          className={`grid grid-cols-3 gap-2 rounded-lg p-3 ${status.bgColor}`}
        >
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Used</div>
            <div className="mt-1 text-lg font-bold">
              {used}
              <span className="ml-1 text-xs font-normal">{unit}</span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-muted-foreground">Available</div>
            <div className="mt-1 text-lg font-bold">
              {available}
              <span className="ml-1 text-xs font-normal">{unit}</span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="mt-1 text-lg font-bold">
              {allocated}
              <span className="ml-1 text-xs font-normal">{unit}</span>
            </div>
          </div>
        </div>

        {/* Warning for high usage */}
        {usagePercentage >= 90 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-sm">Critical Usage</AlertTitle>
            <AlertDescription className="text-xs">
              {title} usage is critically high. Consider freeing resources or
              requesting additional allocation.
            </AlertDescription>
          </Alert>
        )}

        {usagePercentage >= 75 && usagePercentage < 90 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {title} usage is above 75%. Monitor your workloads to prevent
              resource exhaustion.
            </AlertDescription>
          </Alert>
        )}

        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
})

// ============================================================================
// Main Component
// ============================================================================

export function WorkspaceResourcesPanel({
  resources
}: WorkspaceResourcesPanelProps) {
  // Calculate overall resource health
  const calculateOverallHealth = () => {
    const usages = [
      resources.gpu.allocated > 0
        ? (resources.gpu.used / resources.gpu.allocated) * 100
        : 0,
      resources.cpu.allocated > 0
        ? (resources.cpu.used / resources.cpu.allocated) * 100
        : 0,
      resources.ram.allocated > 0
        ? (resources.ram.used / resources.ram.allocated) * 100
        : 0,
      resources.storage.allocated > 0
        ? (resources.storage.used / resources.storage.allocated) * 100
        : 0
    ]

    const avgUsage = usages.reduce((a, b) => a + b, 0) / usages.length
    const maxUsage = Math.max(...usages)

    if (maxUsage >= 90)
      return {
        status: 'critical',
        message: 'One or more resources critically high'
      }
    if (avgUsage >= 75)
      return { status: 'warning', message: 'Overall usage is high' }
    return { status: 'healthy', message: 'All resources operating normally' }
  }

  const health = calculateOverallHealth()

  return (
    <div className="space-y-6">
      {/* Overall Health Banner */}
      <Alert
        variant={health.status === 'critical' ? 'destructive' : 'default'}
        className={
          health.status === 'healthy'
            ? 'border-green-200 bg-green-50 dark:bg-green-950'
            : ''
        }
      >
        {health.status === 'critical' ? (
          <AlertTriangle className="h-4 w-4" />
        ) : health.status === 'warning' ? (
          <Info className="h-4 w-4" />
        ) : (
          <CheckCircle className="h-4 w-4" />
        )}
        <AlertTitle>Resource Health: {health.status.toUpperCase()}</AlertTitle>
        <AlertDescription>{health.message}</AlertDescription>
      </Alert>

      {/* Resource Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <ResourceCard
          icon={Monitor}
          title="GPU"
          allocated={resources.gpu.allocated}
          used={resources.gpu.used}
          unit={resources.gpu.unit}
          model={resources.gpu.model}
          description="Graphics Processing Units for accelerated computing and ML workloads"
        />

        <ResourceCard
          icon={Cpu}
          title="CPU"
          allocated={resources.cpu.allocated}
          used={resources.cpu.used}
          unit={resources.cpu.unit}
          description="Central Processing Units for general computation"
        />

        <ResourceCard
          icon={MemoryStick}
          title="RAM"
          allocated={resources.ram.allocated}
          used={resources.ram.used}
          unit={resources.ram.unit}
          description="Random Access Memory for active data processing"
        />

        <ResourceCard
          icon={HardDrive}
          title="Storage"
          allocated={resources.storage.allocated}
          used={resources.storage.used}
          unit={resources.storage.unit}
          description="Persistent storage for files and datasets"
        />
      </div>

      {/* Accessible Data Table Alternative */}
      <details className="rounded-lg border border-border bg-card p-4">
        <summary className="cursor-pointer text-sm font-medium">
          View Resource Data as Table (Accessible Alternative)
        </summary>
        <table
          className="mt-4 w-full text-sm"
          role="table"
          aria-label="Resource allocation table"
        >
          <thead>
            <tr className="border-b border-border">
              <th className="pb-2 text-left font-medium">Resource</th>
              <th className="pb-2 text-right font-medium">Used</th>
              <th className="pb-2 text-right font-medium">Allocated</th>
              <th className="pb-2 text-right font-medium">Available</th>
              <th className="pb-2 text-right font-medium">Usage %</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="py-2">
                GPU {resources.gpu.model ? `(${resources.gpu.model})` : ''}
              </td>
              <td className="text-right">
                {resources.gpu.used} {resources.gpu.unit}
              </td>
              <td className="text-right">
                {resources.gpu.allocated} {resources.gpu.unit}
              </td>
              <td className="text-right">
                {resources.gpu.allocated - resources.gpu.used}{' '}
                {resources.gpu.unit}
              </td>
              <td className="text-right">
                {resources.gpu.allocated > 0
                  ? (
                      (resources.gpu.used / resources.gpu.allocated) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2">CPU</td>
              <td className="text-right">
                {resources.cpu.used} {resources.cpu.unit}
              </td>
              <td className="text-right">
                {resources.cpu.allocated} {resources.cpu.unit}
              </td>
              <td className="text-right">
                {resources.cpu.allocated - resources.cpu.used}{' '}
                {resources.cpu.unit}
              </td>
              <td className="text-right">
                {resources.cpu.allocated > 0
                  ? (
                      (resources.cpu.used / resources.cpu.allocated) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-2">RAM</td>
              <td className="text-right">
                {resources.ram.used} {resources.ram.unit}
              </td>
              <td className="text-right">
                {resources.ram.allocated} {resources.ram.unit}
              </td>
              <td className="text-right">
                {resources.ram.allocated - resources.ram.used}{' '}
                {resources.ram.unit}
              </td>
              <td className="text-right">
                {resources.ram.allocated > 0
                  ? (
                      (resources.ram.used / resources.ram.allocated) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </td>
            </tr>
            <tr>
              <td className="py-2">Storage</td>
              <td className="text-right">
                {resources.storage.used} {resources.storage.unit}
              </td>
              <td className="text-right">
                {resources.storage.allocated} {resources.storage.unit}
              </td>
              <td className="text-right">
                {resources.storage.allocated - resources.storage.used}{' '}
                {resources.storage.unit}
              </td>
              <td className="text-right">
                {resources.storage.allocated > 0
                  ? (
                      (resources.storage.used / resources.storage.allocated) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </td>
            </tr>
          </tbody>
        </table>
      </details>
    </div>
  )
}

export default WorkspaceResourcesPanel
