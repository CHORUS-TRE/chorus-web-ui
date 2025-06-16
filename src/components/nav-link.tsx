'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UrlObject } from 'url'

export default function NavLink({
  enabled = true,
  href,
  exact = false,
  children,
  className,
  ...props
}: {
  enabled?: boolean
  href: string
  exact?: boolean
  className?: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isActive =
    !enabled || exact ? pathname === href : pathname?.startsWith(href)
  const newClassName = isActive ? `${className} active` : className

  return (
    <Link
      href={href as unknown as UrlObject}
      className={newClassName}
      {...props}
    >
      {children}
    </Link>
  )
}
