'use client'

import {
  AppWindow,
  Box,
  CheckCircle,
  Clock,
  Crown,
  Key,
  LaptopMinimal,
  Settings,
  Shield,
  User,
  XCircle
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuthentication } from '@/providers/authentication-provider'

export default function Me() {
  const { user } = useAuthentication()

  if (!user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No user information available</p>
        </div>
      </div>
    )
  }

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />
      case 'inactive':
        return <XCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const groupRolesByWorkspace = () => {
    if (!user.rolesWithContext || user.rolesWithContext.length === 0) {
      return {}
    }

    const groups: Record<
      string,
      Record<string, typeof user.rolesWithContext>
    > = {}

    user.rolesWithContext.forEach((role) => {
      const workspaceId = role.context.workspace || 'undefined'
      const roleName = role.name

      if (!groups[workspaceId]) {
        groups[workspaceId] = {}
      }

      if (!groups[workspaceId][roleName]) {
        groups[workspaceId][roleName] = []
      }

      groups[workspaceId][roleName].push(role)
    })

    return groups
  }

  const formatContextDisplay = (context: Record<string, string>) => {
    return Object.entries(context)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-8">
        {/* Profile Header */}
        <Card className="flex h-full flex-col rounded-2xl border-muted/40 bg-background/60 text-white">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div>
                  <h1 className="text-3xl font-bold">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(user.status)}
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                  {user.totpEnabled && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Key className="h-3 w-3" />
                      2FA Enabled
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card className="flex h-full flex-col rounded-2xl border-muted/40 bg-background/60 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  User ID
                </label>
                <p className="font-mono text-sm">{user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Username
                </label>
                <p>{user.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Full Name
                </label>
                <p>
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Authentication Source
                </label>
                <p>{user.source}</p>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="flex h-full flex-col rounded-2xl border-muted/40 bg-background/60 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Account Status</span>
                <Badge className={getStatusColor(user.status)}>
                  {user.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Two-Factor Auth</span>
                <Badge variant={user.totpEnabled ? 'default' : 'secondary'}>
                  {user.totpEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Password Changed</span>
                <Badge variant={user.passwordChanged ? 'default' : 'secondary'}>
                  {user.passwordChanged ? 'Yes' : 'No'}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Created
                  </span>
                  <p className="text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </span>
                  <p className="text-sm">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workspace Information */}
        {user.workspaceId && (
          <Card className="flex h-full flex-col rounded-2xl border-muted/40 bg-background/60 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AppWindow className="h-5 w-5" />
                Workspace
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Current Workspace ID
                </label>
                <p className="font-mono text-sm">{user.workspaceId}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Roles & Permissions */}
        <Card className="flex h-full flex-col rounded-2xl border-muted/40 bg-background/60 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Roles & Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.rolesWithContext && user.rolesWithContext.length > 0 ? (
              <div className="space-y-6">
                <h4 className="font-medium">Roles & Permissions</h4>
                {Object.entries(groupRolesByWorkspace())
                  .sort(([a], [b]) =>
                    a.match(/^\*/s) ? -1 : b.match(/^undefined/) ? 1 : 0
                  )
                  .map(([workspaceId, roles]) => (
                    <div key={workspaceId} className="space-y-4">
                      <div className="flex items-center gap-2">
                        {workspaceId === 'global' ? (
                          <Crown className="h-5 w-5" />
                        ) : (
                          <AppWindow className="h-5 w-5 text-muted-foreground" />
                        )}
                        <h5 className="text-lg font-semibold">
                          {workspaceId === 'undefined'
                            ? 'CHORUS Global Roles'
                            : `Workspace ${workspaceId}`}
                        </h5>
                      </div>
                      <div className="space-y-3 pl-6">
                        {Object.entries(roles)
                          .sort(([a], [b]) => {
                            // Put WorkspaceAdmin  before WorkbenchAdmin
                            if (
                              a.includes('Workbench') &&
                              b.includes('Workspace')
                            )
                              return 1
                            if (
                              a.includes('Workspace') &&
                              b.includes('Workbench')
                            )
                              return -1
                            return a.localeCompare(b)
                          })
                          .map(([roleName, roleInstances]) => (
                            <div
                              key={`${workspaceId}-${roleName}`}
                              className="space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                  {roleName}
                                </Badge>
                              </div>
                              <div className="pl-4">
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-4 lg:grid-cols-5">
                                  {roleInstances.map((role, index) => (
                                    <div
                                      key={index}
                                      className="rounded-lg border border-muted/40 bg-muted/10 p-3 transition-colors hover:bg-muted/20"
                                    >
                                      {role.context.workbench ? (
                                        <div className="space-y-2">
                                          <div className="flex items-center gap-2">
                                            <LaptopMinimal className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">
                                              Session {role.context.workbench}
                                            </span>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="space-y-2">
                                          <div className="text-sm text-white">
                                            {formatContextDisplay(role.context)}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            ) : user.roles && user.roles.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-medium">Basic Roles</h4>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role, index) => (
                    <Badge key={index} variant="secondary">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No roles assigned</p>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="flex h-full flex-col rounded-2xl border-muted/40 bg-background/60 text-white">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" disabled>
                <Settings className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="outline" disabled>
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Button>
              <Button variant="outline" disabled>
                <Shield className="mr-2 h-4 w-4" />
                Security Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
