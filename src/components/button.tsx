'use client'

import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

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
    | 'link-underline'
    | 'accent-ring'
    | 'accent-filled'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xs' | null
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      disabled = false,
      type = 'button',
      variant = 'accent-filled',
      size,
      className,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    // Custom accent variants
    if (variant === 'ghost') {
      return (
        <UIButton
          disabled={disabled}
          type={type}
          size={size}
          className={`bg-transparent text-muted hover:bg-transparent hover:text-accent ${className || ''}`}
          ref={ref}
          {...props}
        >
          {children}
        </UIButton>
      )
    }

    if (variant === 'link') {
      return (
        <UIButton
          size={size || 'sm'}
          disabled={disabled}
          type={type}
          className={`focus-visible:no-ring h-8 rounded-none border-b-2 border-transparent bg-transparent text-muted underline-offset-4 hover:bg-transparent hover:text-accent ${className || ''}`}
          ref={ref}
          {...props}
        >
          {children}
        </UIButton>
      )
    }

    if (variant === 'link-underline') {
      return (
        <UIButton
          size={size || 'sm'}
          disabled={disabled}
          type={type}
          className={`focus-visible:no-ring h-8 rounded-none border-b-2 border-transparent bg-transparent text-muted hover:bg-transparent hover:text-accent hover:underline ${className || ''}`}
          ref={ref}
          {...props}
        >
          {children}
        </UIButton>
      )
    }

    if (variant === 'accent-ring') {
      return (
        <UIButton
          size={size || 'sm'}
          disabled={disabled}
          type={type}
          className={`flex items-center justify-center gap-1 rounded-full bg-transparent text-sm text-accent ring-1 ring-accent transition-[gap] duration-500 ease-in-out hover:gap-2 hover:bg-accent-background hover:text-black ${className || ''}`}
          ref={ref}
          {...props}
        >
          {children}
        </UIButton>
      )
    }

    if (variant === 'accent-filled') {
      const isLightTheme = mounted && theme === 'light'
      const themeClasses = isLightTheme
        ? 'bg-accent text-black hover:bg-accent-background'
        : 'bg-transparent text-accent ring-1 ring-accent hover:bg-accent/10'

      return (
        <UIButton
          size={size || 'sm'}
          disabled={disabled}
          type={type}
          className={`flex items-center justify-center gap-1 rounded-full text-xs transition-[gap] duration-500 ease-in-out hover:gap-2 ${themeClasses} ${className || ''}`}
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
        size={size || 'sm'}
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
