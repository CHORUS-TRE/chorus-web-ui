'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UrlObject } from 'url'

export default function NavLink({
  href,
  exact = false,
  children,
  className,
  ...props
}: {
  href: string
  exact?: boolean
  className?: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname?.startsWith(href)
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
