'use client'

import { AppWindow, Shield, User } from 'lucide-react'

import { UserAccessDetail } from '@/app/admin/users/user-access-detail'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@/components/ui/link'
import { Separator } from '@/components/ui/separator'
import { useAuthentication } from '@/providers/authentication-provider'

export default function UserProfile() {
  const { user, refreshUser } = useAuthentication()

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <UserAccessDetail
            user={user}
            onChanged={refreshUser}
            onGrantClick={() => {}}
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-6">
            {/* Basic Information */}
            <Card className="flex h-full flex-col overflow-hidden rounded-[14px] border bg-card dark:border-white/[.08] dark:bg-white/[.018]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    User ID
                  </label>
                  <p className="font-mono text-sm">{user?.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Username
                  </label>
                  <p>{user?.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <p>
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Authentication Source
                  </label>
                  <p>{user?.source}</p>
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="flex h-full flex-col overflow-hidden rounded-[14px] border bg-card dark:border-white/[.08] dark:bg-white/[.018]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Account Status</span>
                  <Badge className={getStatusColor(user?.status ?? '')}>
                    {user?.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Two-Factor Auth</span>
                  <Badge variant={user?.totpEnabled ? 'default' : 'secondary'}>
                    {user?.totpEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Password Changed</span>
                  <Badge
                    variant={user?.passwordChanged ? 'default' : 'secondary'}
                  >
                    {user?.passwordChanged ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Created
                    </span>
                    <p className="text-sm">
                      {new Date(user?.createdAt ?? '').toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </span>
                    <p className="text-sm">
                      {new Date(user?.updatedAt ?? '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workspace Information */}
          {user?.workspaceId && (
            <Card className="flex h-full flex-col overflow-hidden rounded-[14px] border bg-card dark:border-white/[.08] dark:bg-white/[.018]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AppWindow className="h-5 w-5" />
                  Personal Workspace
                  <Badge variant="outline" className="text-xs">
                    {user?.workspaceId ? 'Assigned' : 'Unassigned'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    <Link href={`/workspaces/${user?.workspaceId}`}>
                      Current Workspace ID
                    </Link>
                  </label>
                  <p className="font-mono text-sm">
                    {user?.workspaceId ? user?.workspaceId : 'Unassigned'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
