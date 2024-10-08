'use client'

import {
  Dialog as DialogContainer,
  DialogContent,
  DialogDescription,
  DialogHeader,
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
          <Icons.CirclePlusIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {triggerText}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription asChild>{children}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </DialogContainer>
  )
}
