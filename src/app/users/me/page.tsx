'use client'

import {
  AppWindow,
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
import Link from 'next/link'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useAuthentication } from '@/providers/authentication-provider'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '~/components/ui/breadcrumb'
import {
  getEnhancedRole,
  getPermissionDescription,
  getRoleDescription,
  getRolePermissions
} from '~/utils/schema-roles'

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

  const RoleHoverCard = ({
    roleName,
    children
  }: {
    roleName: string
    children: React.ReactNode
  }) => {
    const role = getEnhancedRole(roleName)
    const permissions = getRolePermissions(roleName)
    const description = getRoleDescription(roleName)

    if (!role) {
      return <>{children}</>
    }

    return (
      <HoverCard>
        <HoverCardTrigger asChild>{children}</HoverCardTrigger>
        <HoverCardContent
          className="max-h-[500px] w-[600px] overflow-y-auto border border-muted/40 bg-background/95 p-4 text-white"
          side="bottom"
          align="start"
          sideOffset={5}
          avoidCollisions={false}
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-white">{roleName}</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                {description}
              </p>
            </div>

            {role.inheritsFrom && role.inheritsFrom.length > 0 && (
              <div>
                <h5 className="mb-1 text-xs font-medium text-muted-foreground">
                  Inherits from:
                </h5>
                <div className="flex flex-wrap gap-1">
                  {role.inheritsFrom.map((inheritedRole) => (
                    <Badge
                      key={inheritedRole}
                      variant="outline"
                      className="text-xs"
                    >
                      {inheritedRole}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h5 className="mb-2 text-xs font-medium text-muted-foreground">
                Permissions ({permissions.length})
              </h5>
              <div className="max-h-56 overflow-y-auto rounded-md border border-muted/40">
                <Table>
                  <TableHeader className="sticky top-0 bg-background/95">
                    <TableRow>
                      <TableHead className="h-8 w-2/5 text-xs text-muted-foreground">
                        Action
                      </TableHead>
                      <TableHead className="h-8 w-2/5 text-xs text-muted-foreground">
                        Description
                      </TableHead>
                      <TableHead className="h-8 w-1/5 text-xs text-muted-foreground">
                        Source
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((permission) => {
                      const isDirectPermission =
                        role.permissions.includes(permission)
                      const description = getPermissionDescription(permission)
                      return (
                        <TableRow key={permission} className="border-muted/40">
                          <TableCell className="py-2 font-mono text-xs text-accent">
                            {permission}
                          </TableCell>
                          <TableCell className="py-2 text-xs text-muted-foreground">
                            {description}
                          </TableCell>
                          <TableCell className="py-2 text-xs">
                            {isDirectPermission ? (
                              <Badge variant="default" className="text-xs">
                                Direct
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                Inherited
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {role.attributes && Object.keys(role.attributes).length > 0 && (
              <div>
                <h5 className="mb-1 text-xs font-medium text-muted-foreground">
                  Context Scope:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(role.attributes).map(([key, value]) => (
                    <Badge key={key} variant="outline" className="text-xs">
                      {key}: {value === '*' ? 'All' : value}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">CHORUS</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <Link href="/users">Users</Link>
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {user.firstName} {user.lastName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
                Personal Workspace
                <Badge variant="outline" className="text-xs">
                  {user.workspaceId ? 'Assigned' : 'Unassigned'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  <Link href={`/workspaces/${user.workspaceId}`}>
                    Current Workspace ID
                  </Link>
                </label>
                <p className="font-mono text-sm">
                  {user.workspaceId ? user.workspaceId : 'Unassigned'}
                </p>
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
                                  <h6 className="text-sm font-semibold text-white">
                                    {roleName}
                                  </h6>
                                  <Badge variant="outline" className="text-xs">
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
                                            {formatContextDisplay(role.context)}
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
