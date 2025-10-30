'use client'

import { type VariantProps } from 'class-variance-authority'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { UrlObject } from 'url'

import { linkVariants } from '@/components/link'
import { cn } from '@/lib/utils'

export interface LinkProps
  extends React.ComponentPropsWithoutRef<typeof NextLink>,
    VariantProps<typeof linkVariants> {
  className?: string
}

const NavKink2 = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, children, ...props }, ref) => {
    // simplified: active styling handled by consumer NavLink below

    return (
      <NextLink
        className={`inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent hover:text-black data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-black ${cn(linkVariants({ variant, className }))} `}
        ref={ref}
        {...props}
      >
        {children}
      </NextLink>
    )
  }
)

NavKink2.displayName = 'NavKink2'

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
    <NextLink
      href={href as unknown as UrlObject}
      className={`inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent hover:text-inherit data-[active]:border-b-2 data-[active]:border-accent data-[state=open]:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-foreground ${newClassName} no-underline`}
      {...props}
    >
      {children}
    </NextLink>
  )
}
