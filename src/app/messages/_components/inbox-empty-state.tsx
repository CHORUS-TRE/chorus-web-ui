'use client'

import { Bell, Inbox } from 'lucide-react'

import type { InboxTab } from '../_hooks/use-inbox-data'

export function InboxEmptyState({ tab }: { tab: InboxTab }) {
  const Icon = tab === 'inbox' ? Inbox : Bell
  const message =
    tab === 'inbox'
      ? 'No messages match your filters'
      : 'No outgoing requests yet'

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Icon className="mb-4 h-12 w-12 text-muted-foreground/30" />
      <p className="text-lg font-medium text-muted-foreground">{message}</p>
    </div>
  )
}
