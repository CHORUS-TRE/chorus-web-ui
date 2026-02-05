'use client'

import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

interface StatCardProps {
  href: string
  title: string
  icon?: LucideIcon
  value?: string | number
  description?: string
  children?: React.ReactNode
}

export function StatCard({
  href,
  title,
  icon: Icon,
  value,
  description,
  children
}: StatCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full cursor-pointer transition-colors hover:bg-muted/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </CardHeader>
        <CardContent>
          {value !== undefined && <div className="text-2xl font-bold">{value}</div>}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {children}
        </CardContent>
      </Card>
    </Link>
  )
}
