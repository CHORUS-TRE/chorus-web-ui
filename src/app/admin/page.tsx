'use client'

import {
  LayoutGrid,
  Package,
  Palette,
  Settings,
  Shield,
  Terminal,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

import { PERMISSIONS, ROLE_DEFINITIONS } from '@/config/permissions'
import { useAuthorization } from '@/providers/authorization-provider'
import { useAppState } from '@/stores/app-state-store'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

const AdminPage = () => {
  const { can } = useAuthorization()

  const {
    users,
    workspaces,
    workbenches,
    apps,
    refreshUsers,
    refreshWorkspaces,
    refreshWorkbenches,
    refreshApps
  } = useAppState()

  useEffect(() => {
    refreshUsers()
    refreshWorkspaces()
    refreshWorkbenches()
    refreshApps()
  }, [])

  const roleCount = Object.keys(ROLE_DEFINITIONS).length

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {can(PERMISSIONS.listUsers) && (
          <Link href="/admin/users">
            <Card className="h-full cursor-pointer transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Registered Users
                </p>
                <div className="mt-4 flex items-center text-xs text-muted-foreground">
                  <Shield className="mr-1 h-3 w-3" />
                  {roleCount} System Roles Defined
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {can(PERMISSIONS.listWorkspaces) && (
          <Link href="/admin/workspaces">
            <Card className="h-full cursor-pointer transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Workspaces
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workspaces?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active Workspaces
                </p>
              </CardContent>
            </Card>
          </Link>
        )}

        {can(PERMISSIONS.listWorkbenches) && (
          <Link href="/admin/sessions">
            <Card className="h-full cursor-pointer transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sessions</CardTitle>
                <Terminal className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workbenches?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Active Sessions</p>
              </CardContent>
            </Card>
          </Link>
        )}

        {can(PERMISSIONS.listApps) && (
          <Link href="/admin/app-store">
            <Card className="h-full cursor-pointer transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">App Store</CardTitle>
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{apps?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Applications Available
                </p>
              </CardContent>
            </Card>
          </Link>
        )}

        {can(PERMISSIONS.setPlatformSettings) && (
          <>
            <Link href="/admin/configuration">
              <Card className="h-full cursor-pointer transition-colors hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Configuration
                  </CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Manage platform settings
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/theme">
              <Card className="h-full cursor-pointer transition-colors hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Theme</CardTitle>
                  <Palette className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Customize UI appearance
                  </p>
                </CardContent>
              </Card>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminPage
