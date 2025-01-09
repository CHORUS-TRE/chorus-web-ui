import { Box, Cloud, Lock, Zap } from 'lucide-react'

import { Button } from '@/components/button'

import { useAppState } from './store/app-state-context'

export default function AppStoreHero() {
  const { toggleRightSidebar } = useAppState()

  return (
    <section className="relative isolate overflow-hidden text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Your One-Stop Shop for Data, Applications, and AI
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Discover, deploy, and manage enterprise-grade applications
            seamlessly. Our App Store provides a curated collection of secure,
            scalable, and integrated solutions for your needs.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl sm:mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon={<Box className="h-6 w-6" />}
              title="Ready-to-Use Apps"
              description="Pre-configured enterprise applications that integrate seamlessly with your workspace"
            />
            <Feature
              icon={<Cloud className="h-6 w-6" />}
              title="Cloud-Native"
              description="Built for modern cloud infrastructure with instant deployment and scaling"
            />
            <Feature
              icon={<Lock className="h-6 w-6" />}
              title="Enterprise Security"
              description="Enterprise-grade security with role-based access control and data encryption"
            />
            <Feature
              icon={<Zap className="h-6 w-6" />}
              title="Instant Access"
              description="Quick deployment and immediate access to your applications"
            />
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button variant={'outline'} onClick={toggleRightSidebar}>
            Learn more
          </Button>
        </div>
      </div>
    </section>
  )
}

function Feature({
  icon,
  title,
  description
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="relative rounded-2xl border p-6 transition-colors hover:border-foreground/20">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  )
}
