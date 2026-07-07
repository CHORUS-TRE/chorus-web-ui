'use client'

import { Inbox, Search } from 'lucide-react'

import type { InboxTab } from '../_hooks/use-notifications-inbox'

interface InboxEmptyStateProps {
  tab: InboxTab
  hasSearchQuery: boolean
}

export function InboxEmptyState({ tab, hasSearchQuery }: InboxEmptyStateProps) {
  const Icon = hasSearchQuery ? Search : Inbox
  const message = hasSearchQuery
    ? 'No notifications match your search'
    : tab === 'unread'
      ? "You're all caught up"
      : 'No notifications yet'

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Icon className="mb-4 h-12 w-12 text-muted-foreground/30" />
      <p className="text-lg font-medium text-muted-foreground">{message}</p>
    </div>
  )
}
