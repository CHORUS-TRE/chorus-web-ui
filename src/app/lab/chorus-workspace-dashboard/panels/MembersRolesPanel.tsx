/**
 * Members & Roles Panel Component
 *
 * Displays workspace members with their roles and permissions
 *
 * @accessibility
 * - Semantic table structure with proper headers
 * - ARIA labels for role badges and permission indicators
 * - Keyboard navigation for member list
 * - Screen reader friendly permission lists
 *
 * @eco-design
 * - Virtualized list for large member counts
 * - Memoized member cards
 */

'use client'

import {
  CheckCircle,
  ChevronDown,
  Mail,
  Shield,
  UserPlus,
  Users,
  XCircle
} from 'lucide-react'
import * as React from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import type { WorkspaceMember, WorkspaceRole } from '../types/enhanced-models'
import { getRoleLabel } from '../types/enhanced-models'

// ============================================================================
// Props Interface
// ============================================================================

export interface MembersRolesPanelProps {
  members: WorkspaceMember[]
  currentUser: WorkspaceMember
  canManageMembers: boolean
}

// ============================================================================
// Role Badge Component
// ============================================================================

const RoleBadge = React.memo(function RoleBadge({
  role
}: {
  role: WorkspaceRole
}) {
  const getRoleVariant = (
    role: WorkspaceRole
  ): 'default' | 'destructive' | 'outline' | 'secondary' => {
    switch (role) {
      case 'workspace-admin':
      case 'pi':
        return 'destructive'
      case 'data-manager':
        return 'default'
      default:
        return 'secondary'
    }
  }

  return (
    <Badge
      variant={getRoleVariant(role)}
      className="flex w-fit items-center gap-1"
    >
      <Shield className="h-3 w-3" aria-hidden="true" />
      {getRoleLabel(role)}
    </Badge>
  )
})

// ============================================================================
// Member Card Component
// ============================================================================

interface MemberCardProps {
  member: WorkspaceMember
  isCurrentUser: boolean
}

const MemberCard = React.memo(function MemberCard({
  member,
  isCurrentUser
}: MemberCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const permissionList = [
    {
      key: 'listFiles',
      label: 'List Files',
      value: member.permissions.listFiles
    },
    { key: 'upload', label: 'Upload Files', value: member.permissions.upload },
    {
      key: 'download',
      label: 'Download Files',
      value: member.permissions.download
    },
    { key: 'modify', label: 'Modify Files', value: member.permissions.modify },
    {
      key: 'transfer',
      label: 'Transfer Data',
      value: member.permissions.transfer
    },
    {
      key: 'approve',
      label: 'Approve Requests',
      value: member.permissions.approve
    },
    {
      key: 'manageMembers',
      label: 'Manage Members',
      value: member.permissions.manageMembers
    },
    {
      key: 'configureServices',
      label: 'Configure Services',
      value: member.permissions.configureServices
    }
  ]

  return (
    <Card className={isCurrentUser ? 'border-2 border-primary' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">
                  {member.name}
                  {isCurrentUser && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      You
                    </Badge>
                  )}
                </CardTitle>
              </div>
              <CardDescription className="flex items-center gap-1 text-xs">
                <Mail className="h-3 w-3" aria-hidden="true" />
                {member.email}
              </CardDescription>
              <RoleBadge role={member.role} />
            </div>
          </div>

          <div className="text-right text-xs text-muted-foreground">
            <div>Joined {member.joinedAt.toLocaleDateString()}</div>
            {member.lastActive && (
              <div>Last active {member.lastActive.toLocaleDateString()}</div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex w-full items-center justify-between"
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} permissions for ${member.name}`}
            >
              <span className="text-sm font-medium">Permissions</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2">
            <div className="grid grid-cols-2 gap-2 rounded-md border border-border p-3">
              {permissionList.map((perm) => (
                <div
                  key={perm.key}
                  className="flex items-center gap-2 text-sm"
                  role="listitem"
                  aria-label={`${perm.label}: ${perm.value ? 'Allowed' : 'Denied'}`}
                >
                  {perm.value ? (
                    <CheckCircle
                      className="h-4 w-4 text-green-600"
                      aria-hidden="true"
                    />
                  ) : (
                    <XCircle
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  )}
                  <span className={perm.value ? '' : 'text-muted-foreground'}>
                    {perm.label}
                  </span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
})

// ============================================================================
// Main Component
// ============================================================================

export function MembersRolesPanel({
  members,
  currentUser,
  canManageMembers
}: MembersRolesPanelProps) {
  const [viewMode, setViewMode] = React.useState<'cards' | 'table'>('cards')

  // Sort members: current user first, then by role priority
  const sortedMembers = React.useMemo(() => {
    const rolePriority: Record<WorkspaceRole, number> = {
      'workspace-admin': 1,
      pi: 2,
      'data-manager': 3,
      researcher: 4,
      analyst: 5,
      viewer: 6
    }

    return [...members].sort((a, b) => {
      if (a.id === currentUser.id) return -1
      if (b.id === currentUser.id) return 1
      return rolePriority[a.role] - rolePriority[b.role]
    })
  }, [members, currentUser.id])

  // Group members by role
  const membersByRole = React.useMemo(() => {
    const groups: Record<WorkspaceRole, WorkspaceMember[]> = {
      'workspace-admin': [],
      pi: [],
      'data-manager': [],
      researcher: [],
      analyst: [],
      viewer: []
    }

    members.forEach((member) => {
      groups[member.role].push(member)
    })

    return groups
  }, [members])

  // ============================================================================
  // Role Statistics
  // ============================================================================

  const RoleStatistics = () => {
    const stats = Object.entries(membersByRole)
      .filter(([_, members]) => members.length > 0)
      .map(([role, members]) => ({
        role: role as WorkspaceRole,
        count: members.length
      }))

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5" aria-hidden="true" />
            Role Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {stats.map(({ role, count }) => (
              <div
                key={role}
                className="flex items-center justify-between rounded-md border border-border p-2"
              >
                <RoleBadge role={role} />
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // ============================================================================
  // Table View
  // ============================================================================

  const TableView = () => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {member.name}
                    {member.id === currentUser.id && (
                      <Badge variant="outline" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <RoleBadge role={member.role} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {member.email}
                </TableCell>
                <TableCell className="text-sm">
                  {member.joinedAt.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {member.lastActive
                    ? member.lastActive.toLocaleDateString()
                    : 'Never'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  // ============================================================================
  // Card View
  // ============================================================================

  const CardView = () => (
    <div className="grid gap-4 md:grid-cols-2">
      {sortedMembers.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          isCurrentUser={member.id === currentUser.id}
        />
      ))}
    </div>
  )

  // ============================================================================
  // Main Render
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Workspace Members</h2>
          <p className="text-sm text-muted-foreground">
            {members.length} {members.length === 1 ? 'member' : 'members'} in
            this workspace
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            Cards
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table
          </Button>

          {canManageMembers && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <Button size="sm" className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Add Member
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Role Statistics */}
      <RoleStatistics />

      {/* Members List */}
      {viewMode === 'cards' ? <CardView /> : <TableView />}
    </div>
  )
}

export default MembersRolesPanel
