'use client'

import {
  AppWindow,
  Building2,
  LaptopMinimal,
  Package,
  Palette,
  ScrollText,
  Settings2,
  Shield,
  Store,
  Users
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { StatCard } from '@/components/dashboard/stat-card'
import { Organization } from '@/domain/model'
import { User } from '@/domain/model/user'
import { useAuthorization } from '@/providers/authorization-provider'
import { useRoles } from '@/providers/roles-provider'
import { useAppState } from '@/stores/app-state-store'
import { organizationList } from '@/view-model/organization-view-model'
import { listUsers } from '@/view-model/user-view-model'

const AdminPage = () => {
  const { can } = useAuthorization()
  const { roles } = useRoles()
  const [users, setUsers] = useState<User[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])

  useEffect(() => {
    async function loadUsers() {
      if (can('listUsers', { user: '*' })) {
        const result = await listUsers()
        if (result.data) {
          setUsers(result.data)
        }
      }
    }
    loadUsers()
  }, [can])

  useEffect(() => {
    async function loadOrganizations() {
      if (can('setPlatformSettings', {})) {
        const result = await organizationList()
        if (result.data) {
          setOrganizations(result.data)
        }
      }
    }
    loadOrganizations()
  }, [can])

  const {
    workspaces,
    workbenches,
    apps,
    appInstances,
    refreshWorkspaces,
    refreshWorkbenches,
    refreshApps,
    refreshAppInstances
  } = useAppState()

  useEffect(() => {
    refreshWorkspaces()
    refreshWorkbenches()
    refreshApps()
    refreshAppInstances()
  }, [refreshWorkspaces, refreshWorkbenches, refreshApps, refreshAppInstances])

  const roleCount = roles.length

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-semibold text-muted-foreground">
        Admin Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {can('listUsers') && (
          <StatCard
            href="/admin/users"
            title="Users"
            icon={Users}
            value={users?.length || 0}
            description="Registered Users"
          />
        )}

        {can('manageUserRoles') && (
          <StatCard
            href="/admin/users/roles"
            title="Authorization"
            icon={Shield}
            value={roleCount}
            description="System Roles Defined"
          ></StatCard>
        )}

        {can('listWorkspaces') && (
          <StatCard
            href="/admin/workspaces"
            title="Workspaces"
            icon={Package}
            value={workspaces?.length || 0}
            description="Active Workspaces"
          />
        )}

        {can('listWorkbenchs') && (
          <StatCard
            href="/admin/sessions"
            title="Sessions"
            icon={LaptopMinimal}
            value={workbenches?.length || 0}
            description="Active Sessions"
          />
        )}

        {can('createApp') && (
          <StatCard
            href="/admin/app-store"
            title="App Store"
            icon={Store}
            value={apps?.length || 0}
            description="Applications Available"
          />
        )}

        {can('listAppInstances') && (
          <StatCard
            href="/admin/instances"
            title="App Instances"
            icon={AppWindow}
            value={appInstances?.length || 0}
            description="Running Instances"
          />
        )}

        {/* {can('listWorkspaces') && (
          <StatCard
            href="/admin/data-requests"
            title="Data Requests"
            icon={FileCheck}
            value={approvalRequests?.length || 0}
            description="Pending Approvals"
          />
        )} */}

        {can('auditPlatform') && (
          <StatCard
            href="/admin/audit"
            title="Audit"
            icon={ScrollText}
            value=""
            description="Platform audit log"
          />
        )}

        {can('setPlatformSettings') && (
          <>
            <StatCard
              href="/admin/organizations"
              title="Organizations"
              icon={Building2}
              value={organizations?.length || 0}
              description="Registered Organizations"
            />

            <StatCard
              href="/admin/configuration"
              title="Configuration"
              icon={Settings2}
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
