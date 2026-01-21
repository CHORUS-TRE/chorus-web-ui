'use client'

import { Home } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'

import { Link } from '@/components/link'
import { useInstanceConfig } from '@/hooks/use-instance-config'
import { useAppState } from '@/stores/app-state-store'

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
  const { workspaces, appInstances } = useAppState()

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

  const breadcrumbItems = useMemo(() => {
    const items: {
      label: string
      href: string
      icon?: React.ComponentType<{ className?: string }>
      isPage?: boolean
      iconOnly?: boolean
    }[] = []

    // Always start with Home icon and instance name
    items.push({
      label: instanceConfig.name,
      href: '/',
      icon: Home,
      isPage: pathname === '/',
      iconOnly: false
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
      } else if (seg.text === 'webapps') {
        label = 'Services'
      }

      // Name resolution for IDs
      const prevSegment = segments[index - 1]
      if (prevSegment === 'workspaces') {
        const workspace = workspaces?.find((w) => w.id === seg.text)
        if (workspace) label = workspace.name
      } else if (prevSegment === 'sessions' || prevSegment === 'webapps') {
        const instance = appInstances?.find((i) => i.id === seg.text)
        if (instance) label = instance?.name
      } else if (seg.text === 'app-store') {
        label = 'App Store'
      } else if (seg.text === 'admin') {
        label = 'Settings'
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
    projectLabel,
    instanceConfig.name
  ])

  return (
    <div className="flex items-center">
      {breadcrumbItems.length > 0 && (
        <>
          <Breadcrumb>
            <BreadcrumbList className="gap-1 text-sm">
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={item.href}>
                  <BreadcrumbItem>
                    {item.isPage ? (
                      <BreadcrumbPage className="flex max-w-[200px] items-center gap-2 truncate font-medium text-foreground">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {!item.iconOnly && item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          href={item.href}
                          className="flex items-center gap-2 transition-opacity hover:opacity-80"
                        >
                          {item.icon && <item.icon className="h-4 w-4" />}
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
                    <BreadcrumbSeparator className="mx-1 text-muted-foreground" />
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
