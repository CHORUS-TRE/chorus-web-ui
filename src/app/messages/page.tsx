'use client'

import {
  AppWindow,
  Bell,
  Cpu,
  FileCheck,
  LaptopMinimal,
  LayoutGrid,
  Package,
  Palette,
  Settings,
  Settings2,
  Shield,
  Store,
  Terminal,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { ROLE_DEFINITIONS } from '@/config/permissions'
import { User } from '@/domain/model/user'
import { useAuthorization } from '@/providers/authorization-provider'
import { useAppState } from '@/stores/app-state-store'
import { listApprovalRequests } from '@/view-model/approval-request-view-model'
import { StatCard } from '~/components/dashboard/stat-card'

const MessagesPage = () => {
  const { can, PERMISSIONS } = useAuthorization()
  const [users, setUsers] = useState<User[]>([])

  const roleCount = Object.keys(ROLE_DEFINITIONS).length

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-semibold text-muted-foreground">
        Messages{' '}
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          href="/messages/notifications"
          title="Notifications"
          icon={Bell}
          value={users?.length || 0}
          description="Registered Users"
        />

        <StatCard
          href="/messages/requests"
          title="Requests"
          icon={Package}
          value={0}
          description="Pending Requests"
        >
          <div className="mt-4 flex items-center text-xs text-muted-foreground">
            <Shield className="mr-1 h-3 w-3" />
            {roleCount} System Roles Defined
          </div>
        </StatCard>
      </div>
    </div>
  )
}

export default MessagesPage
