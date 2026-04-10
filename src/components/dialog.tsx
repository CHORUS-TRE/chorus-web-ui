'use client'

import {
  Dialog as DialogContainer,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import { Button } from './ui/button'
import { Icons } from './ui/icons'

export default function Dialog({
  children,
  triggerText
}: {
  children?: React.ReactNode
  triggerText?: string
}) {
  return (
    <DialogContainer>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="link"
          className="h-8 gap-1 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <Icons.CirclePlusIcon className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {triggerText}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="hidden">{triggerText}</DialogTitle>
        <DialogHeader>
          <DialogDescription asChild>{children}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </DialogContainer>
  )
}
