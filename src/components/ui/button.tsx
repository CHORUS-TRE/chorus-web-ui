import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-muted text-foreground hover:bg-muted/80',
        ghost:
          'bg-transparent text-muted hover:bg-transparent hover:text-accent',
        link: 'h-8 rounded-none border-b-2 border-transparent bg-transparent text-muted underline-offset-4 hover:bg-transparent hover:text-accent focus-visible:ring-0',
        'link-underline':
          'h-8 rounded-none border-b-2 border-transparent bg-transparent text-muted hover:bg-transparent hover:text-accent hover:underline focus-visible:ring-0',
        'accent-ring':
          'rounded-full bg-transparent text-accent ring-1 ring-accent transition-[gap] duration-500 ease-in-out hover:gap-2 hover:bg-accent-background hover:text-black',
        'accent-filled':
          'rounded-full text-accent ring-1 ring-accent transition-[gap] duration-500 ease-in-out hover:gap-2 bg-transparent hover:bg-accent/10 dark:bg-transparent dark:hover:bg-accent/10 light:bg-accent light:text-black light:hover:bg-accent-background'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        xs: 'h-7 rounded-md px-2 text-xs'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, type = 'button', ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
