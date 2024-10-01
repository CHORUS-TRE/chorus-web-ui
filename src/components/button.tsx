import React from 'react'

import { Button as UIButton } from './ui/button'

export function Button({
  children,
  disabled = false,
  type = 'button',
  className,
  ...props
}: Readonly<{
  children: React.ReactNode
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}>) {
  return (
    <UIButton
      size="sm"
      disabled={disabled}
      type={type}
      className={`focus:bg-accent-background flex h-8 items-center justify-center gap-1 rounded-full bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent focus:text-accent focus:ring-2 focus:ring-accent ${className}`}
      {...props}
    >
      {children}
    </UIButton>
  )
}
