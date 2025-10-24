import { cva, type VariantProps } from 'class-variance-authority'
import NextLink from 'next/link'
import React from 'react'

import { cn } from '~/lib/utils'

const linkVariants = cva('inline-flex items-center gap-2 transition-colors', {
  variants: {
    variant: {
      default: 'text-foreground hover:text-accent underline',
      nav: 'text-muted underline-offset-4 hover:text-accent hover:underline',
      muted: 'text-muted hover:text-accent',
      accent: 'text-accent hover:text-accent/80'
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
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <NextLink
        ref={ref}
        className={cn(linkVariants({ variant, className }))}
        {...props}
      >
        {children}
      </NextLink>
    )
  }
)

Link.displayName = 'Link'

export { Link, linkVariants }
