'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import type { InboxTab } from '../_hooks/use-notifications-inbox'

interface InboxTabsProps {
  activeTab: InboxTab
  onTabChange: (tab: InboxTab) => void
  unreadCount: number
}

export function InboxTabs({
  activeTab,
  onTabChange,
  unreadCount
}: InboxTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as InboxTab)}>
      <TabsList>
        <TabsTrigger
          value="unread"
          className="pb-3 pr-4 pt-2 font-semibold text-muted-foreground"
        >
          Unread
          {unreadCount > 0 && ` (${unreadCount})`}
        </TabsTrigger>

        <TabsTrigger
          value="all"
          className="pb-3 pr-4 pt-2 font-semibold text-muted-foreground"
        >
          All
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
