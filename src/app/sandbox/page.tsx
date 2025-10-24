'use client'

import {
  Activity,
  Code2,
  Cpu,
  FileText,
  FlaskConical,
  Layers,
  PackageOpen
} from 'lucide-react'
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
      title: 'CHORUS Templates',
      description: 'View the templates of the CHORUS platform',
      href: 'sandbox/templates',
      icon: FileText,
      status: 'Development',
      children: [
        {
          title: 'CHORUS Architecture',
          description: 'View the architecture of the CHORUS platform',
          href: 'sandbox/architecture',
          icon: Layers,
          status: 'Development'
        },
        {
          title: 'CHORUS Protocol Builder',
          description: 'Build and test protocols for the CHORUS platform',
          href: 'sandbox/chorus-protocol-builder',
          icon: FlaskConical,
          status: 'Development'
        },
        {
          title: 'CHORUS Clinical Lifecycle Dashboard',
          description: 'Manage your clinical project',
          href: 'sandbox/workspace',
          icon: PackageOpen,
          status: 'Development'
        },
        {
          title: 'Clinical Studies Dashboard',
          description: 'Manage clinical studies',
          href: 'sandbox/clinical-lifecycle-ashboard',
          icon: PackageOpen,
          status: 'Development'
        }
        // {
        //   title: 'Patient Health Summary',
        //   description: 'View patient health metrics and medical data',
        //   href: 'sandbox/patient',
        //   icon: Activity,
        //   status: 'Development'
        // }
      ]
    },

    {
      title: 'Role Schema Viz',
      description: 'Visualize the schema roles & permissions',
      href: 'sandbox/schema-viz',
      icon: Layers,
      status: 'Development'
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
      status: 'Development'
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
          <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <FlaskConical className="h-9 w-9" />
            Development Sandbox
          </h2>
        </div>
      </div>

      <div className="w-full">
        <div className="mb-6">
          <h3 className="mb-0 text-lg font-semibold">Testing Environment</h3>
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
              href: string
              children: React.ReactNode
            }) =>
              !item.children ? (
                <Link key={key} href={href} className="group text-muted">
                  {children}
                </Link>
              ) : (
                <div className="flex flex-col gap-2">{children}</div>
              )

            return (
              <ConditionalLink key={item.title} href={item.href}>
                <Card className="card-glass h-full transition-all hover:border-accent/50 hover:bg-background/80">
                  <CardHeader className="pb-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-accent/20 p-2">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-muted transition-colors group-hover:text-accent">
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
                    <CardDescription>
                      <p className="mb-2 text-muted-foreground">
                        {item.description}
                      </p>

                      {item.children && (
                        <div className="flex flex-col gap-1">
                          {item.children.map((child) => (
                            <Link key={child.title} href={child.href}>
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </CardDescription>
                  </CardContent>
                </Card>
              </ConditionalLink>
            )
          })}
        </div>

        <div className="card-glass mt-8 rounded-lg border p-4">
          <div className="mb-2 flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-accent" />
            <h4 className="text-sm font-semibold">About Sandbox</h4>
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
