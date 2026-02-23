'use client'

import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'

import { Link } from '@/components/link'
import { useInstanceConfig } from '@/hooks/use-instance-config'
import { useAppState } from '@/stores/app-state-store'
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
  const { workspaces, appInstances, apps, workbenches } = useAppState()
  const { user } = useAuthentication()

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

  const data = useMemo(() => {
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
    const processedSegments = segments.map((s) => ({
      text: s,
      path: (currentHref += `/${s}`)
    }))

    let lastSegmentSkipped = false
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
        const workbench = workbenches?.find((w) => w.id === seg.text)
        if (workbench) {
          // Skip session name - we use the dropdown pill in the header instead
          if (isLast) lastSegmentSkipped = true
          return
        } else {
          const instance = appInstances?.find((i) => i.id === seg.text)
          if (instance) {
            label =
              instance.name ||
              apps?.find((a) => a.id === instance.appId)?.name ||
              label
          }
        }
      } else if (prevSegment === 'users') {
        // Resolve user ID to username or full name
        if (user?.id === seg.text) {
          label = user.username || `${user.firstName} ${user.lastName}`
        }
      } else if (seg.text === 'app-store') {
        // Skip app-store — accessible via session pill menu
        if (isLast) lastSegmentSkipped = true
        return
      } else if (seg.text === 'admin') {
        label = 'Admin'
      }

      items.push({
        label,
        href: seg.path,
        isPage: isLast
      })
    })

    // Ensure the last item is marked as isPage: true, UNLESS we skipped the last segment (the session ID)
    if (items.length > 0 && !lastSegmentSkipped) {
      items[items.length - 1].isPage = true
    }

    return { items, lastSegmentSkipped }
  }, [
    segments,
    pathname,
    workspaces,
    appInstances,
    apps,
    workbenches,
    projectLabel,
    user?.username,
    user?.firstName,
    user?.lastName,
    user?.id
  ])

  const breadcrumbItems = data.items
  const lastSegmentSkipped = data.lastSegmentSkipped

  return (
    <div className="flex items-center justify-between">
      {breadcrumbItems.length > 0 && (
        <>
          <Breadcrumb>
            <BreadcrumbList className="gap-0.5 text-sm">
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
                  {(index < breadcrumbItems.length - 1 ||
                    (item.label === 'Sessions' && lastSegmentSkipped)) && (
                    <BreadcrumbSeparator className="text-muted-foreground" />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </>
      )}
    </div>
  )
}
