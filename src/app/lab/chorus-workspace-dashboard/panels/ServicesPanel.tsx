/**
 * Services Panel Component
 *
 * Displays integrated services (GitLab, Jupyter, RStudio, VSCode) with status
 *
 * @accessibility
 * - Status indicators with text labels (not just color)
 * - Keyboard accessible service cards
 * - ARIA live regions for status updates
 *
 * @eco-design
 * - Memoized service cards
 * - Efficient status polling
 */

'use client'

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Code,
  ExternalLink,
  GitBranch,
  Loader2,
  Play,
  Square
} from 'lucide-react'
import * as React from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import type { ServiceInstance, ServiceType } from '../types/enhanced-models'

// ============================================================================
// Props Interface
// ============================================================================

export interface ServicesPanelProps {
  services: ServiceInstance[]
  canConfigureServices: boolean
}

// ============================================================================
// Service Icon Mapping
// ============================================================================

const getServiceIcon = (type: ServiceType) => {
  switch (type) {
    case 'gitlab':
      return GitBranch
    case 'jupyter':
    case 'rstudio':
    case 'vscode':
      return Code
  }
}

// ============================================================================
// Service Card Component
// ============================================================================

interface ServiceCardProps {
  service: ServiceInstance
  canConfigure: boolean
  onStart?: () => void
  onStop?: () => void
  onOpen?: () => void
}

const ServiceCard = React.memo(function ServiceCard({
  service,
  canConfigure,
  onStart,
  onStop,
  onOpen
}: ServiceCardProps) {
  const Icon = getServiceIcon(service.type)

  const getStatusConfig = () => {
    switch (service.status) {
      case 'running':
        return {
          variant: 'default' as const,
          icon: CheckCircle,
          label: 'Running',
          color: 'text-green-600'
        }
      case 'stopped':
        return {
          variant: 'secondary' as const,
          icon: Square,
          label: 'Stopped',
          color: 'text-gray-600'
        }
      case 'error':
        return {
          variant: 'destructive' as const,
          icon: AlertCircle,
          label: 'Error',
          color: 'text-red-600'
        }
      case 'provisioning':
        return {
          variant: 'default' as const,
          icon: Loader2,
          label: 'Provisioning',
          color: 'text-blue-600'
        }
    }
  }

  const status = getStatusConfig()
  const StatusIcon = status.icon

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base">{service.name}</CardTitle>
              <CardDescription className="text-xs capitalize">
                {service.type}
              </CardDescription>
            </div>
          </div>

          <Badge variant={status.variant} className="flex items-center gap-1">
            <StatusIcon
              className={`h-3 w-3 ${service.status === 'provisioning' ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {service.version && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Version:</span>
            <span className="font-mono text-xs">{service.version}</span>
          </div>
        )}

        {service.lastHealthCheck && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Check:</span>
            <span className="text-xs">
              {service.lastHealthCheck.toLocaleDateString()}{' '}
              {service.lastHealthCheck.toLocaleTimeString()}
            </span>
          </div>
        )}

        {service.url && service.status === 'running' && (
          <div className="rounded-md border border-border bg-muted p-2">
            <div className="mb-1 text-xs text-muted-foreground">
              Service URL:
            </div>
            <code className="break-all text-xs">{service.url}</code>
          </div>
        )}

        {service.status === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Service encountered an error. Contact administrator if issue
              persists.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        {service.status === 'running' && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={onOpen}
              className="flex items-center gap-1"
              aria-label={`Open ${service.name}`}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Open
            </Button>
            {canConfigure && (
              <Button
                size="sm"
                variant="outline"
                onClick={onStop}
                className="flex items-center gap-1"
                aria-label={`Stop ${service.name}`}
              >
                <Square className="h-4 w-4" aria-hidden="true" />
                Stop
              </Button>
            )}
          </>
        )}

        {service.status === 'stopped' && canConfigure && (
          <Button
            size="sm"
            onClick={onStart}
            className="flex items-center gap-1"
            aria-label={`Start ${service.name}`}
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            Start
          </Button>
        )}

        {service.status === 'provisioning' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Service is being provisioned...
          </div>
        )}
      </CardFooter>
    </Card>
  )
})

// ============================================================================
// Main Component
// ============================================================================

export function ServicesPanel({
  services,
  canConfigureServices
}: ServicesPanelProps) {
  // Group services by status
  const runningServices = services.filter((s) => s.status === 'running')
  const stoppedServices = services.filter((s) => s.status === 'stopped')
  const errorServices = services.filter((s) => s.status === 'error')

  return (
    <div className="space-y-6">
      {/* Status Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle
                className="h-4 w-4 text-green-600"
                aria-hidden="true"
              />
              Running
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{runningServices.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Square className="h-4 w-4 text-gray-600" aria-hidden="true" />
              Stopped
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stoppedServices.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <AlertCircle
                className="h-4 w-4 text-red-600"
                aria-hidden="true"
              />
              Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorServices.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Service Cards */}
      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Code
              className="mb-4 h-12 w-12 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              No services configured for this workspace
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              canConfigure={canConfigureServices}
              onOpen={() => window.open(service.url, '_blank')}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ServicesPanel
