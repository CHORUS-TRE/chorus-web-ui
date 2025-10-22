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
    | 'accent-ring'
    | 'accent-filled'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      disabled = false,
      type = 'button',
      variant = 'accent-ring',
      className,
      ...props
    },
    ref
  ) => {
    // Custom accent variants
    if (variant === 'accent-ring') {
      return (
        <UIButton
          size="sm"
          disabled={disabled}
          type={type}
          className={`flex items-center justify-center gap-1 rounded-full bg-transparent text-sm text-accent ring-1 ring-accent transition-[gap] duration-500 ease-in-out hover:gap-2 hover:bg-accent-background hover:text-black focus:bg-accent-background focus:ring-2 focus:ring-accent ${className || ''}`}
          ref={ref}
          {...props}
        >
          {children}
        </UIButton>
      )
    }

    if (variant === 'accent-filled') {
      return (
        <UIButton
          size="sm"
          disabled={disabled}
          type={type}
          className={`flex items-center justify-center gap-1 rounded-full bg-accent text-sm text-black transition-[gap] duration-500 ease-in-out hover:gap-2 hover:bg-accent-background focus:bg-accent-background focus:ring-2 focus:ring-accent ${className || ''}`}
          ref={ref}
          {...props}
        >
          {children}
        </UIButton>
      )
    }

    // Default shadcn variants
    return (
      <UIButton
        size="sm"
        disabled={disabled}
        variant={variant}
        type={type}
        className={className}
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
