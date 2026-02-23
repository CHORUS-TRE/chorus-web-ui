'use client'

import {
  Code2,
  Cpu,
  FileText,
  FlaskConical,
  Layers,
  PackageOpen
} from 'lucide-react'

import { Link } from '@/components/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/card'

export default function SandboxPage() {
  const sandboxItems: Array<{
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    status: string
    href?: string
    children?: Array<{
      title: string
      description: string
      href: string
      icon: React.ComponentType<{ className?: string }>
      status?: string
    }>
  }> = [
    {
      title: 'AI generated web pages',
      description: 'AI Generated web pages for the CHORUS platform',
      icon: FileText,
      status: 'Demo',
      children: [
        {
          title: 'CHORUS Architecture',
          description: 'View the architecture of the CHORUS platform',
          href: '/lab/architecture',
          icon: Layers
        },
        {
          title: 'CHORUS Protocol Builder',
          description: 'Build and test protocols for the CHORUS platform',
          href: '/lab/chorus-protocol-builder',
          icon: FlaskConical
        },
        {
          title: 'Studies Dashboard',
          description: 'Manage clinical studies',
          href: '/lab/projects-dashboard',
          icon: PackageOpen
        },
        {
          title: 'Feasibility Assessment',
          description: 'Pre-protocol Data Exploration & Cohort Analysis',
          href: '/lab/feasability',
          icon: PackageOpen
        },
        {
          title: 'Footprint',
          description: 'Manage clinical studies',
          href: '/lab/footprint',
          icon: PackageOpen
        }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Testing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Development':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Completed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <FlaskConical className="h-9 w-9" />
            Development Lab
          </h2>
        </div>
      </div>

      <div className="w-full">
        <div className="mb-6">
          <h3 className="mb-0 text-lg font-semibold">Development Lab</h3>
          <p className="text-sm text-muted">
            Experimental features and development tools for the CHORUS platform
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {sandboxItems.map((item) => {
            const IconComponent = item.icon

            const ConditionalLink = ({
              key,
              href,
              children
            }: {
              key: string
              href?: string
              children: React.ReactNode
            }) =>
              !item.children ? (
                <Link
                  key={key}
                  href={href as string}
                  className="group text-muted"
                >
                  {children}
                </Link>
              ) : (
                <div className="flex flex-col gap-2">{children}</div>
              )

            return (
              <ConditionalLink key={item?.title} href={item?.href}>
                <Card className="card-glass h-full transition-all hover:border-accent/50 hover:bg-background/80">
                  <CardHeader className="pb-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-accent/20 p-2">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-muted transition-colors group-hover:text-accent">
                          {item?.title}
                        </CardTitle>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="justify-start">
                      <p className="mb-2 text-muted-foreground">
                        {item?.description}
                      </p>

                      {item.children &&
                        item.children.map((child) => (
                          <div key={child.title}>
                            <Link
                              key={child.title}
                              href={child.href}
                              className=""
                            >
                              {child.title}
                            </Link>
                          </div>
                        ))}
                    </CardDescription>
                  </CardContent>
                </Card>
              </ConditionalLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
