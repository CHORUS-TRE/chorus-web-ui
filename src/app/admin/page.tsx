'use client'

import {
  Bell,
  Cpu,
  FileCheck,
  LayoutGrid,
  Package,
  Palette,
  Settings,
  Shield,
  Terminal,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { PERMISSIONS, ROLE_DEFINITIONS } from '@/config/permissions'
import { User } from '@/domain/model/user'
import { useAuthorization } from '@/providers/authorization-provider'
import { useAppState } from '@/stores/app-state-store'
import { listUsers } from '@/view-model/user-view-model'
import { StatCard } from '~/components/dashboard/stat-card'

const AdminPage = () => {
  const { can } = useAuthorization()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    async function loadUsers() {
      if (can(PERMISSIONS.listUsers, { user: '*' })) {
        const result = await listUsers()
        if (result.data) {
          setUsers(result.data)
        }
      }
    }
    loadUsers()
  }, [can])

  const {
    workspaces,
    workbenches,
    apps,
    appInstances,
    notifications,
    approvalRequests,
    refreshWorkspaces,
    refreshWorkbenches,
    refreshApps,
    refreshAppInstances,
    refreshNotifications,
    refreshApprovalRequests
  } = useAppState()

  useEffect(() => {
    refreshWorkspaces()
    refreshWorkbenches()
    refreshApps()
    refreshAppInstances()
    refreshNotifications()
    refreshApprovalRequests()
  }, [
    refreshWorkspaces,
    refreshWorkbenches,
    refreshApps,
    refreshAppInstances,
    refreshNotifications,
    refreshApprovalRequests
  ])

  const roleCount = Object.keys(ROLE_DEFINITIONS).length

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {can(PERMISSIONS.listUsers) && (
          <StatCard
            href="/admin/users"
            title="Users"
            icon={Users}
            value={users?.length || 0}
            description="Registered Users"
          >
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <Shield className="mr-1 h-3 w-3" />
              {roleCount} System Roles Defined
            </div>
          </StatCard>
        )}

        {can(PERMISSIONS.listWorkspaces) && (
          <StatCard
            href="/admin/workspaces"
            title="Workspaces"
            icon={Package}
            value={workspaces?.length || 0}
            description="Active Workspaces"
          />
        )}

        {can(PERMISSIONS.listWorkbenches) && (
          <StatCard
            href="/admin/sessions"
            title="Sessions"
            icon={Terminal}
            value={workbenches?.length || 0}
            description="Active Sessions"
          />
        )}

        {can(PERMISSIONS.createApp) && (
          <StatCard
            href="/admin/app-store"
            title="App Store"
            icon={LayoutGrid}
            value={apps?.length || 0}
            description="Applications Available"
          />
        )}

        {can(PERMISSIONS.listAppInstances) && (
          <StatCard
            href="/admin/instances"
            title="App Instances"
            icon={Cpu}
            value={appInstances?.length || 0}
            description="Running Instances"
          />
        )}

        {can(PERMISSIONS.listNotifications) && (
          <StatCard
            href="/admin/notifications"
            title="Notifications"
            icon={Bell}
            value={notifications?.length || 0}
            description="System Notifications"
          />
        )}

        {can(PERMISSIONS.listWorkspaces) && (
          <StatCard
            href="/admin/data-requests"
            title="Data Requests"
            icon={FileCheck}
            value={approvalRequests?.length || 0}
            description="Pending Approvals"
          />
        )}

        {can(PERMISSIONS.setPlatformSettings) && (
          <>
            <StatCard
              href="/admin/configuration"
              title="Configuration"
              icon={Settings}
              value=""
              description="Manage platform settings"
            />

            <StatCard
              href="/admin/theme"
              title="Theme"
              icon={Palette}
              value=""
              description="Customize UI appearance"
            />
          </>
        )}
      </div>
    </div>
  )
}

export default AdminPage
