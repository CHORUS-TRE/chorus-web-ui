'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useRoles } from '@/providers/roles-provider'

interface UsersStatsRowProps {
  totalUsers: number
}

function StatCard({
  value,
  label,
  hint
}: {
  value: number
  label: string
  hint: string
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="mt-1 text-sm text-muted-foreground">{label}</div>
        <div className="mt-2 inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
          {hint}
        </div>
      </CardContent>
    </Card>
  )
}

export function UsersStatsRow({ totalUsers }: UsersStatsRowProps) {
  const { roles, permissions } = useRoles()

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      <StatCard
        value={totalUsers}
        label="Platform users"
        hint="identity source aware"
      />
      <StatCard
        value={roles.length}
        label="Roles in catalog"
        hint="platform / workspace / session"
      />
      <StatCard
        value={permissions.length}
        label="Permissions"
        hint="granular access control"
      />
    </div>
  )
}
