'use client'

import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

import { workbenchGet } from './actions/workbench-view-model'
import { workspaceGet } from './actions/workspace-view-model'

type Item = {
  name: string
  href: string
}

export default function Breadcrumbs() {
  const paths = usePathname()
  const params = useParams<{ workspaceId: string; appId: string }>()
  const [pathItems, setPathItems] = useState<Item[]>()

  const workspaceId = params?.workspaceId
  const workbenchId = params?.appId

  useEffect(() => {
    const pathNames = paths
      ?.split('/')
      .filter((path) => path)
      ?.filter((path) => path !== 'workspaces')
    setPathItems((items) =>
      pathNames?.map((path, i) => ({
        name: (items && items[i]?.name) || path,
        href: pathNames.slice(0, i + 1).join('/')
      }))
    )
  }, [paths, setPathItems])

  useEffect(() => {
    if (!workspaceId) {
      return
    }

    workspaceGet(workspaceId)
      .then((response) => {
        if (response?.error) {
          /* do something wise*/
        }
        if (response?.data) {
          const pathNames = paths?.split('/').filter((path) => path)
          setPathItems((items) =>
            items
              ?.filter((_, i) => i <= (pathNames?.length || 0))
              ?.map((item, i) => {
                if (i === 0)
                  return {
                    ...item,
                    name: response?.data?.shortName || item.name
                  }

                return item
              })
          )
        }
      })
      .catch((error) => {
        // setError(error.message)
      })
  }, [paths, workspaceId])

  useEffect(() => {
    if (!workbenchId) {
      return
    }
    workbenchGet(workbenchId)
      .then((response) => {
        if (response?.error) {
          /* do something wise*/
        }
        if (response?.data) {
          const pathNames = paths?.split('/').filter((path) => path)
          setPathItems((items) =>
            items
              ?.filter((_, i) => i <= (pathNames?.length || 0))
              ?.map((item, i) => {
                if (i === 1)
                  return {
                    ...item,
                    name: response?.data?.shortName || item.name
                  }

                return item
              })
          )
        }
      })
      .catch((error) => {
        // setError(error.message)
      })
  }, [workbenchId, paths])

  const Item = ({ name, href }: { name: string; href?: string }) => {
    return (
      <BreadcrumbItem>
        <BreadcrumbLink asChild key={href}>
          <>
            {href && (
              <Link
                href={href}
                prefetch={false}
                className="block p-0 px-2 text-accent hover:text-accent-foreground"
              >
                {name}
              </Link>
            )}
            {!href && <span>{name}</span>}
          </>
        </BreadcrumbLink>
      </BreadcrumbItem>
    )
  }

  return (
    <Breadcrumb className="pl-4">
      <BreadcrumbList className="text-primary-foreground">
        {/* <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href='/' prefetch={false} className='hover:text-accent'>
              HOME
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem> */}
        {paths && paths?.length > 1 && <BreadcrumbSeparator />}
        {pathItems?.map((item, index) => (
          <Fragment key={item.href}>
            {index < pathItems.length - 1 && (
              <Item href={`/${item.href}`} name={item.name} />
            )}
            {index === pathItems.length - 1 && <Item name={item.name} />}
            {index < pathItems.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
