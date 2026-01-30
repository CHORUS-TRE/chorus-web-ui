'use client'

import { Home, Maximize, Minimize } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'

import { Link } from '@/components/link'
import { useInstanceConfig } from '@/hooks/use-instance-config'
import { useFullscreenContext } from '@/providers/fullscreen-provider'
import { useAppState } from '@/stores/app-state-store'
import { Button } from '~/components/button'
import { useAuthentication } from '~/providers/authentication-provider'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from './breadcrumb'

export function AppBreadcrumb() {
  const pathname = usePathname()
  const instanceConfig = useInstanceConfig()
  const { workspaces, appInstances, apps } = useAppState()
  const { user } = useAuthentication()
  const { isFullscreen, toggleFullscreen } = useFullscreenContext()

  const projectLabel = useMemo(
    () =>
      instanceConfig.tags.find((tag) => tag.id === 'project')?.label ||
      'Workspaces',
    [instanceConfig]
  )

  const segments = useMemo(
    () => pathname.split('/').filter(Boolean),
    [pathname]
  )

  // Check if we're on a session page
  const isSessionPage = useMemo(() => {
    const sessionPageRegex = /^\/workspaces\/[^/]+\/sessions\/[^/]+$/
    return sessionPageRegex.test(pathname)
  }, [pathname])

  const breadcrumbItems = useMemo(() => {
    const items: {
      label: string
      href: string
      icon?: React.ComponentType<{ className?: string }>
      isPage?: boolean
      iconOnly?: boolean
    }[] = []

    // Always start with Home icon
    items.push({
      label: '',
      href: '/',
      // icon: Home,
      isPage: pathname === '/',
      iconOnly: true
    })

    let currentHref = ''
    const processedSegments = segments.map((s, i) => ({
      text: s,
      path: (currentHref += `/${s}`)
    }))

    processedSegments.forEach((seg, index) => {
      const isLast = index === segments.length - 1
      let label = seg.text.charAt(0).toUpperCase() + seg.text.slice(1)

      // Name resolution for collection names and IDs
      if (seg.text === 'workspaces') {
        label = projectLabel
      } else if (seg.text === 'sessions') {
        label = 'Sessions'
      } else if (seg.text === 'services') {
        label = 'Services'
      }

      // Name resolution for IDs
      const prevSegment = segments[index - 1]
      if (prevSegment === 'workspaces') {
        const workspace = workspaces?.find((w) => w.id === seg.text)
        if (workspace) label = workspace.name
      } else if (prevSegment === 'sessions' || prevSegment === 'services') {
        const instance = appInstances?.find((i) => i.id === seg.text)
        if (instance) {
          const app = apps?.find((a) => a.id === instance.appId)
          if (app) label = app.name
        }
      } else if (prevSegment === 'users') {
        // Resolve user ID to username or full name
        if (user?.id === seg.text) {
          label = user.username || `${user.firstName} ${user.lastName}`
        }
      } else if (seg.text === 'app-store') {
        label = 'App Store'
      } else if (seg.text === 'admin') {
        label = 'Admin'
      }

      items.push({
        label,
        href: seg.path,
        isPage: isLast
      })
    })

    return items
  }, [
    segments,
    pathname,
    workspaces,
    appInstances,
    apps,
    projectLabel,
    instanceConfig.name
  ])

  return (
    <div className="flex items-center justify-between">
      {breadcrumbItems.length > 0 && (
        <>
          <Breadcrumb>
            <BreadcrumbList className="gap-0.5 text-xs">
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={item.href}>
                  <BreadcrumbItem>
                    {item.isPage ? (
                      <BreadcrumbPage className="flex max-w-[200px] items-center gap-0.5 truncate font-medium text-foreground">
                        {item.icon && <item.icon className="h-3.5 w-3.5" />}
                        {!item.iconOnly && item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          href={item.href}
                          className="flex items-center gap-0.5 transition-opacity hover:opacity-80"
                        >
                          {item.icon && <item.icon className="h-3.5 w-3.5" />}
                          {!item.iconOnly && (
                            <span className="max-w-[150px] truncate text-muted-foreground hover:text-foreground">
                              {item.label}
                            </span>
                          )}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbItems.length - 1 && (
                    <BreadcrumbSeparator className="text-muted-foreground" />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </>
      )}

      {/* Fullscreen button - only on session pages */}
      {isSessionPage && (
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="ml-2 h-8 px-2 text-muted-foreground hover:text-foreground"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  )
}
