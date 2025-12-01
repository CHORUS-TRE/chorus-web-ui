import { cva, type VariantProps } from 'class-variance-authority'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { cn } from '~/lib/utils'

const linkVariants = cva('nav-link-base', {
  variants: {
    variant: {
      default: 'items-center nav-link-hover [&.active]:nav-link-active',
      nav: 'nav-link-hover active:text-foreground hover:no-border',
      muted:
        'text-muted font-semibold nav-link-hover underline decoration-[0.14rem] underline-offset-[0.3rem] bg-background/30 ',
      flex: 'nav-link-hover flex gap-2 items-center justify-start',
      rounded:
        'border border-muted/40 rounded-2xl  hover:border-accent animate-all duration-300',
      underline:
        'text-accent hover:text-accent hover:underline hover:no-border underline-offset-4'
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
    const pathname = usePathname()

    const { href = false } = props
    const isActive = exact
      ? pathname === (href as string)
      : pathname?.startsWith(href as string)
    const newClassName = isActive ? 'active' : ''

    return (
      <NextLink
        ref={ref}
        className={cn(linkVariants({ variant, className }), newClassName)}
        {...props}
      >
        {children}
      </NextLink>
    )
  }
)

Link.displayName = 'Link'

export { Link, linkVariants }
