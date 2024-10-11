import React from 'react'

import { Button as UIButton } from './ui/button'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, disabled = false, type = 'button', className, ...props },
    ref
  ) => {
    return (
      <UIButton
        size="sm"
        disabled={disabled}
        type={type}
        className={`flex items-center justify-start gap-1 rounded-full bg-accent text-sm text-black transition-[gap] duration-500 ease-in-out hover:gap-2 hover:bg-accent-background focus:bg-accent-background focus:ring-2 focus:ring-accent ${className}`}
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
