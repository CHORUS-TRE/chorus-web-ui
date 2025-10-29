import { cva, type VariantProps } from 'class-variance-authority'
import NextLink from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '~/lib/utils'

const linkVariants = cva('nav-link-base nav-link-hover no-underline', {
  variants: {
    variant: {
      default: 'active:text-background active:border-accent',
      nav: 'active:text-background hover:no-border',
      muted: '',
      flex: 'flex gap-2 items-center justify-start'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export interface LinkProps
  extends React.ComponentPropsWithoutRef<typeof NextLink>,
    VariantProps<typeof linkVariants> {
  className?: string
  exact?: boolean
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, exact = false, children, ...props }, ref) => {

    const {href = false} = props
    const pathname = usePathname()
  const isActive =
    exact ? pathname === href as string : pathname?.startsWith(href as string)
  const newClassName = isActive ? `${className} active` : className

    return (
      <NextLink
        ref={ref}
        className={cn(linkVariants({ variant, className: newClassName }))}
        {...props}
      >
        {children}
      </NextLink>
    )
  }
)

Link.displayName = 'Link'

export { Link, linkVariants }
