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
  icon?: React.ReactNode
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
}>) {
  return (
    <UIButton
      size="sm"
      disabled={disabled}
      type={type}
      className={`flex items-center justify-start gap-1 rounded-full bg-accent text-sm text-black transition-[gap] duration-500 ease-in-out hover:gap-2 hover:bg-accent-background focus:bg-accent-background focus:ring-2 focus:ring-accent ${className}`}
      {...props}
    >
      {children}
    </UIButton>
  )
}
