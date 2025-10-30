'use client'

import {
  AppWindow,
  CheckCircle,
  CirclePlus,
  Clock,
  Crown,
  Key,
  LaptopMinimal,
  Package,
  Settings,
  Shield,
  User,
  XCircle
} from 'lucide-react'
import { useParams } from 'next/navigation'

import { Button } from '@/components/button'
import { Link } from '@/components/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuthentication } from '@/providers/authentication-provider'
import { RoleHoverCard } from '~/components/role-hover-card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '~/components/ui/breadcrumb'
import { useAppState } from '~/providers/app-state-provider'

export default function UserProfile() {
  // const { user } = useAuthentication()

  const params = useParams<{ userId: string }>()
  const userId = params?.userId

  const { users: userList } = useAppState()
  const profileUser = userList?.find((u) => u.id === userId)

  if (!profileUser) {
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
    if (
      !profileUser.rolesWithContext ||
      profileUser.rolesWithContext.length === 0
    ) {
      return {}
    }

    const groups: Record<
      string,
      Record<string, typeof profileUser.rolesWithContext>
    > = {}

    profileUser.rolesWithContext.forEach((role) => {
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
    <>
      <div className="w-full">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" variant="nav">
                  CHORUS
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/users" variant="nav">
                  Users
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {profileUser.firstName} {profileUser.lastName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-5 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <Package className="h-9 w-9" />
            User Profile
          </h2>
          {/* {canCreateWorkspace && (
            <Button onClick={() => setCreateOpen(true)} variant="accent-filled">
              <CirclePlus className="h-4 w-4" />
              Create Workspace
            </Button>
          )} */}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          {/* Profile Header */}
          <Card className="card-glass flex flex-col rounded-2xl">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl">
                    {profileUser.firstName.charAt(0)}
                    {profileUser.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div>
                    <h1 className="text-3xl font-bold">
                      {profileUser.firstName} {profileUser.lastName}
                    </h1>
                    <p className="text-muted-foreground">
                      @{profileUser.username}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(profileUser.status)}
                    <Badge className={getStatusColor(profileUser.status)}>
                      {profileUser.status}
                    </Badge>
                    {profileUser.totpEnabled && (
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
            <Card className="card-glass flex h-full flex-col rounded-2xl">
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
                  <p className="font-mono text-sm">{profileUser.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Username
                  </label>
                  <p>{profileUser.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <p>
                    {profileUser.firstName} {profileUser.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Authentication Source
                  </label>
                  <p>{profileUser.source}</p>
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="card-glass flex h-full flex-col rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Account Status</span>
                  <Badge className={getStatusColor(profileUser.status)}>
                    {profileUser.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Two-Factor Auth</span>
                  <Badge
                    variant={profileUser.totpEnabled ? 'default' : 'secondary'}
                  >
                    {profileUser.totpEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Password Changed</span>
                  <Badge
                    variant={
                      profileUser.passwordChanged ? 'default' : 'secondary'
                    }
                  >
                    {profileUser.passwordChanged ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Created
                    </span>
                    <p className="text-sm">
                      {new Date(profileUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </span>
                    <p className="text-sm">
                      {new Date(profileUser.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workspace Information */}
          {profileUser.workspaceId && (
            <Card className="card-glass flex h-full flex-col rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AppWindow className="h-5 w-5" />
                  Personal Workspace
                  <Badge variant="outline" className="text-xs">
                    {profileUser.workspaceId ? 'Assigned' : 'Unassigned'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    <Link href={`/workspaces/${profileUser.workspaceId}`}>
                      Current Workspace ID
                    </Link>
                  </label>
                  <p className="font-mono text-sm">
                    {profileUser.workspaceId
                      ? profileUser.workspaceId
                      : 'Unassigned'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card className="card-glass flex flex-col rounded-2xl">
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

        <div>
          {/* Roles & Permissions */}
          <Card className="card-glass flex h-full flex-col rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Roles & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profileUser.rolesWithContext &&
              profileUser.rolesWithContext.length > 0 ? (
                <div className="space-y-6">
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
                              // Put WorkspaceAdmin before WorkbenchAdmin
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
                                className="space-y-3"
                              >
                                <RoleHoverCard roleName={roleName}>
                                  <div className="flex cursor-help items-center gap-2 border-l-2 border-accent/50 pl-3">
                                    {roleName.includes('Workspace') ? (
                                      <AppWindow className="h-4 w-4" />
                                    ) : roleName.includes('Workbench') ? (
                                      <LaptopMinimal className="h-4 w-4" />
                                    ) : (
                                      <Shield className="h-4 w-4" />
                                    )}
                                    <h6 className="text-sm font-semibold">
                                      {roleName}
                                    </h6>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {roleInstances.length}
                                    </Badge>
                                  </div>
                                </RoleHoverCard>

                                <div className="ml-6 space-y-2">
                                  {/* Group by workspace/workbench type */}
                                  {roleName.includes('Workspace') && (
                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4">
                                      {roleInstances.map((role, index) => (
                                        <Link
                                          key={index}
                                          href={`/workspaces/${role.context.workspace || workspaceId}`}
                                          className="group"
                                        >
                                          <div className="rounded-lg border border-muted/40 bg-gradient-to-br from-muted/10 to-muted/5 p-3 transition-all hover:border-accent/50 hover:bg-gradient-to-br hover:from-accent/10 hover:to-accent/5">
                                            <div className="flex items-center gap-2">
                                              <AppWindow className="h-4 w-4 text-muted group-hover:text-accent" />
                                              <span className="text-xs font-medium text-muted">
                                                Workspace{' '}
                                                {role.context.workspace ||
                                                  workspaceId}
                                              </span>
                                            </div>
                                          </div>
                                        </Link>
                                      ))}
                                    </div>
                                  )}

                                  {roleName.includes('Workbench') && (
                                    <div className="space-y-1">
                                      {/* Group workbench sessions under each workspace */}
                                      {Object.entries(
                                        roleInstances.reduce(
                                          (acc, role) => {
                                            const ws =
                                              role.context.workspace ||
                                              'undefined'
                                            if (!acc[ws]) acc[ws] = []
                                            acc[ws].push(role)
                                            return acc
                                          },
                                          {} as Record<
                                            string,
                                            typeof roleInstances
                                          >
                                        )
                                      ).map(([wsId, wsRoles]) => (
                                        <div key={wsId} className="space-y-2">
                                          <div className="ml-4 grid grid-cols-1 gap-2 md:grid-cols-4 lg:grid-cols-6">
                                            {wsRoles.map((role, index) => (
                                              <Link
                                                key={index}
                                                href={`/workspaces/${role.context.workspace}/sessions/${role.context.workbench}`}
                                                className="group"
                                              >
                                                <div className="rounded-lg border border-muted/40 bg-muted/10 p-2 transition-all hover:border-accent/50 hover:bg-muted/20">
                                                  <div className="flex items-center gap-2">
                                                    <LaptopMinimal className="h-3 w-3 text-muted" />
                                                    <span className="text-xs font-medium text-muted">
                                                      {role.context.workbench}
                                                    </span>
                                                  </div>
                                                </div>
                                              </Link>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Global roles */}
                                  {!roleName.includes('Workspace') &&
                                    !roleName.includes('Workbench') && (
                                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                                        {roleInstances.map((role, index) => (
                                          <div
                                            key={index}
                                            className="rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-3"
                                          >
                                            <div className="flex items-center gap-2">
                                              <Crown className="h-4 w-4 text-purple-400" />
                                              <span className="text-sm font-medium">
                                                Global Access
                                              </span>
                                            </div>
                                            <div className="mt-1 text-xs text-muted-foreground">
                                              {formatContextDisplay(
                                                role.context
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : profileUser.roles && profileUser.roles.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-medium">Basic Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileUser.roles.map((role, index) => (
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
        </div>
      </div>
    </>
  )
}
