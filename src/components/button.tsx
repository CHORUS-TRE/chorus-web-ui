import React from 'react'

import { Button as UIButton } from './ui/button'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      disabled = false,
      type = 'button',
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <UIButton
        size="sm"
        disabled={disabled}
        variant={variant}
        type={type}
        className={`flex items-center gap-1 rounded-full bg-transparent text-sm text-accent ring-1 ring-accent transition-[gap] duration-500 ease-in-out hover:gap-2 hover:bg-accent-background hover:text-black focus:bg-accent-background focus:ring-2 focus:ring-accent ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </UIButton>
    )
  }
)

Button.displayName = 'Button'

export { Button }
