'use client'

import { Code2, Cpu, FlaskConical, Layers, Settings } from 'lucide-react'
import Link from 'next/link'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '~/components/ui/breadcrumb'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'

export default function SandboxPage() {
  const sandboxItems = [
    {
      title: 'CHORUS Protocol Builder',
      description: 'Build and test protocols for the CHORUS platform',
      href: 'sandbox/chorus-protocol-builder',
      icon: FlaskConical,
      status: 'Active'
    },

    {
      title: 'Component Explorer',
      description: 'Browse and test dynamic component library',
      href: 'sandbox/component-explorer',
      icon: Code2,
      status: 'Development'
    },
    {
      title: 'Component Generator',
      description: 'AI-powered component generation and testing environment',
      href: 'sandbox/component-generator',
      icon: Cpu,
      status: 'Beta'
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
      case 'Beta':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="m-16">
      <div className="w-full">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">CHORUS</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Sandbox</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start text-white">
            <FlaskConical className="h-9 w-9 text-white" />
            Development Sandbox
          </h2>
        </div>
      </div>

      <div className="w-full">
        <div className="mb-6">
          <h3 className="mb-2 text-lg font-semibold text-white">
            Testing Environment
          </h3>
          <p className="text-sm text-muted">
            Experimental features and development tools for the CHORUS platform
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {sandboxItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Link key={item.href} href={item.href} className="group">
                <Card className="h-full border-muted/40 bg-background/60 text-white transition-all hover:border-accent/50 hover:bg-background/80">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-accent/20 p-2">
                          <IconComponent className="h-5 w-5 text-accent" />
                        </div>
                        <CardTitle className="text-white transition-colors group-hover:text-accent">
                          {item.title}
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
                    <CardDescription className="text-muted-foreground">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 rounded-lg border border-muted/40 bg-background/20 p-4">
          <div className="mb-2 flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-accent" />
            <h4 className="text-sm font-semibold text-white">About Sandbox</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            The sandbox environment provides access to experimental features,
            development tools, and testing interfaces for the CHORUS platform.
            These tools are intended for development and testing purposes.
          </p>
        </div>
      </div>
    </div>
  )
}
