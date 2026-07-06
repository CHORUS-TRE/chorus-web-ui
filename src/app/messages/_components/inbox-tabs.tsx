'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import type { InboxTab } from '../_hooks/use-inbox-data'

interface InboxTabsProps {
  activeTab: InboxTab
  onTabChange: (tab: InboxTab) => void
  inboxPendingCount: number
  outboxPendingCount: number
}

export function InboxTabs({
  activeTab,
  onTabChange,
  inboxPendingCount,
  outboxPendingCount
}: InboxTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as InboxTab)}>
      <TabsList>
        <TabsTrigger
          value="inbox"
          className="pb-3 pr-4 pt-2 font-semibold text-muted-foreground"
        >
          Inbox
          {inboxPendingCount > 0 && ` (${inboxPendingCount})`}
        </TabsTrigger>

        <TabsTrigger
          value="outbox"
          className="pb-3 pr-4 pt-2 font-semibold text-muted-foreground"
        >
          Outbox
          {outboxPendingCount > 0 && ` (${outboxPendingCount})`}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
