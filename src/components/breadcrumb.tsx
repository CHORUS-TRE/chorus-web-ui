'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

export default function Breadcrumbs() {
  const paths = usePathname()
  const pathNames = paths?.split('/').filter((path) => path)
  const pathItems = pathNames?.map((path, i) => ({
    name: path.toUpperCase(),
    path: pathNames.slice(0, i + 1).join('/')
  }))

  const Item = ({ name, href }: { name: string; href: string }) => (
    <BreadcrumbItem>
      <BreadcrumbLink asChild key={href}>
        <Link href={href} prefetch={false}>
          {name}
        </Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  )

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbLink asChild>
          <Link href="/" prefetch={false}>
            CHORUS
          </Link>
        </BreadcrumbLink>
        {paths && paths?.length > 1 && <BreadcrumbSeparator />}
        {pathItems?.map((item, index) => (
          <Fragment key={item.path}>
            <Item href={`/${item.path}`} name={item.name} />
            {index < pathItems.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
