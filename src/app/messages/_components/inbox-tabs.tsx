'use client'

import { Badge } from '~/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'

import type { InboxTab } from '../_hooks/use-inbox-data'

interface InboxTabsProps {
  activeTab: InboxTab
  onTabChange: (tab: InboxTab) => void
  inboxCount: number
  outboxCount: number
  inboxUnreadCount: number
}

export function InboxTabs({
  activeTab,
  onTabChange,
  inboxCount,
  outboxCount,
  inboxUnreadCount
}: InboxTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as InboxTab)}>
      <TabsList>
        <TabsTrigger
          value="inbox"
          className="pb-3 pr-4 pt-2 font-semibold text-muted-foreground"
        >
          Inbox
          {inboxCount > 0 && ` (${inboxCount})`}
          {inboxUnreadCount > 0 && (
            <Badge
              variant="destructive"
              className="no-underline-inherit ml-1 px-1.5 py-0 text-[10px]"
            >
              {inboxUnreadCount}
            </Badge>
          )}
        </TabsTrigger>

        <TabsTrigger
          value="outbox"
          className="pb-3 pr-4 pt-2 font-semibold text-muted-foreground"
        >
          Outbox
          {outboxCount > 0 && ` (${outboxCount})`}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
