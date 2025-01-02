'use client'

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

import { useAppState } from '@/components/store/app-state-context'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

import { useAuth } from './store/auth-context'

interface BreadcrumbItem {
  name: string
  href?: string
}

interface ItemProps {
  name: string
  href?: string
}

// Extract Item component
const BreadcrumbItemComponent = ({ name, href }: ItemProps) => (
  <BreadcrumbItem>
    <BreadcrumbLink asChild>
      {href ? (
        <Link
          href={href}
          prefetch={false}
          className="border-b-2 border-accent text-sm hover:border-b-2 hover:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
        >
          {name}
        </Link>
      ) : (
        <span>{name}</span>
      )}
    </BreadcrumbLink>
  </BreadcrumbItem>
)

export default function Breadcrumbs() {
  const paths = usePathname()
  const params = useParams<{ workspaceId: string; appId: string }>()
  const [items, setItems] = useState<BreadcrumbItem[]>([])
  const {
    workbenches,
    workspaces,
    error,
    setError,
    background,
    setBackground,
    refreshWorkspaces,
    refreshWorkbenches
  } = useAppState()
  const { refreshUser } = useAuth()

  const pathNames = useMemo(
    () => paths?.split('/').filter(Boolean) || [],
    [paths]
  )

  // Utility function for capitalizing
  const capitalize = useCallback(
    (str: string) =>
      str
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    []
  )

  // Generate initial breadcrumb items
  const initialItems = useMemo(
    () =>
      pathNames.map((path, i) => ({
        name: capitalize(path),
        href: pathNames.slice(0, i + 1).join('/')
      })),
    [pathNames, capitalize]
  )

  // Handle data fetching and updates
  const updateBreadcrumbItems = useCallback(async () => {
    const updatedItems: BreadcrumbItem[] = [...initialItems]

    if (params?.workspaceId) {
      try {
        const workspace = workspaces?.find((w) => w.id === params.workspaceId)
        if (workspace?.shortName) {
          updatedItems[1] = {
            ...updatedItems[1],
            name: workspace.shortName
          }
        }
      } catch (error) {
        console.error('Failed to fetch workspace:', error)
      }
    }

    if (params?.appId) {
      try {
        const workbench = workbenches?.find((w) => w.id === params.appId)
        if (workbench?.shortName) {
          updatedItems[2] = {
            ...updatedItems[2],
            name: workbench.shortName
          }
        }
      } catch (error) {
        console.error('Failed to fetch workbench:', error)
      }
    }

    setItems(updatedItems)
  }, [initialItems, params?.workspaceId, params?.appId])

  useEffect(() => {
    setItems(initialItems)
    updateBreadcrumbItems()
  }, [updateBreadcrumbItems, initialItems])

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <Breadcrumb className="pl-2">
      <BreadcrumbList className="text-primary-foreground">
        {paths && paths.length > 1 && <BreadcrumbSeparator />}
        {items.map((item, index) => (
          <Fragment key={item.href}>
            <BreadcrumbItemComponent
              href={item.href ? `/${item.href}` : undefined}
              name={item.name}
            />
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
