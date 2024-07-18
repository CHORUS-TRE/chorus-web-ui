import React from 'react'
import { Button } from '~/components/ui/button'
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from '~/components/ui/navigation-menu'
import { SVGProps } from 'react'

export function Home() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <section className="w-full bg-primary py-24 lg:py-48">
        <div className="container flex flex-col items-center gap-6 px-4 text-center md:px-6">
          <h1 className="max-w-4xl text-5xl font-extrabold leading-tight tracking-tighter text-primary-foreground sm:text-7xl md:text-8xl">
            <span className="bg-gradient-to-r from-primary-foreground to-secondary-foreground bg-clip-text text-transparent">
              CHORUS
            </span>
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground md:text-xl lg:text-2xl">
            A secure analytics platform revolutionizing research by addressing
            critical pain points such as data fragmentation, lack of
            collaboration, and compliance challenges.
          </p>
          <div className="flex w-full max-w-md justify-center gap-2">
            <Link href="/workspaces" passHref className="ml-auto">
              <Button variant="outline">Get Started</Button>
            </Link>
            <Link href="/workspaces" passHref className="ml-auto">
              <Button variant="outline">Learn More</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function MountainIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}
