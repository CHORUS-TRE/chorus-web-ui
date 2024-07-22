'use client'

import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { Pyramid } from 'lucide-react'

interface Item {
  name: string
  description: string
  href?: string
  poster?: Item
  links?: Item[]
}

const items: Item[] = [
  {
    name: 'CHORUS',
    description: '',
    href: '#',
    poster: {
      name: 'Overview',
      description: 'CHORUS - Secure Research Platform'
    },
    links: [
      {
        name: 'Funding Opportunities',
        description:
          'Join or initiate collaborative research projects across disciplines.'
      },
      {
        name: 'Research Methodologies',
        description:
          'Learn about ethical considerations and guidelines in conducting research.'
      }
    ]
  },
  {
    name: 'Research',
    description:
      'Explore the latest research and findings across various domains',
    href: '#',
    links: [
      {
        name: 'Research Papers',
        description: 'Browse the latest research publications.'
      },
      {
        name: 'Policies and Compliance',
        description: 'Stay up-to-date with the latest policies and regulations.'
      },
      {
        name: 'Policy Document',
        description: 'Access and review the latest policy updates.'
      },
      {
        name: 'Legal Resources',
        description: 'Access legal guidance and support materials.'
      }
    ]
  },
  {
    name: 'Workspaces',
    description: 'My workspace and projects',
    links: [
      {
        name: 'My Workspaces',
        description: 'My workspace and projects'
      },
      {
        name: 'Workspace Collaboration',
        description: 'Collaborate with your team'
      }
    ]
  },
  {
    name: 'Teams',
    description: 'Collaborate with your team'
  },
  {
    name: 'Data',
    description: 'Data management and governance',
    links: [
      {
        name: 'Data Security',
        description: 'Data security and privacy'
      },
      {
        name: 'Data Sources',
        description: 'Data sources and repositories'
      },
      {
        name: 'Data Pipelines',
        description: 'Data pipelines and workflows'
      },
      { name: 'Data Models', description: 'Data models and schemas' }
    ]
  },
  {
    name: 'App Store',
    description: 'Browse and install applications'
  },
  {
    name: 'Community',
    description: 'Our ecosystem and community',
    links: [
      { name: 'Ecology', description: 'Our ecosystem and community' },
      {
        name: 'Inclusivity',
        description: 'Our commitment to diversity and inclusion'
      }
    ]
  },
  {
    name: 'Getting Started',
    description: 'Get started with the application',
    links: [
      {
        name: 'Installation',
        description: 'How to install and setup the application'
      },
      { name: 'Configuration', description: 'How to configure the application' }
    ]
  }
]

export function Navigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item) => {
          if (item.links) {
            if (item.poster) return <RichNavigationList item={item} />

            return <BasicNavigationList item={item} />
          }

          return <BasicNavigationItem item={item} />
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const BasicNavigationItem = ({ item }: { item: Item }) => (
  <NavigationMenuItem>
    <Link href="/docs" legacyBehavior passHref>
      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
        {item.name}
      </NavigationMenuLink>
    </Link>
  </NavigationMenuItem>
)

const BasicNavigationList = ({ item }: { item: Item }) => (
  <NavigationMenuItem>
    <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
    <NavigationMenuContent>
      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
        {item.links?.map((component) => (
          <ListItem
            key={component.name}
            title={component.name}
            href={component.href}
          >
            {component.description}
          </ListItem>
        ))}
      </ul>
    </NavigationMenuContent>
  </NavigationMenuItem>
)

const RichNavigationList = ({ item }: { item: Item }) => (
  <NavigationMenuItem>
    <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
    <NavigationMenuContent>
      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
        {item.poster && (
          <li className="row-span-3">
            <NavigationMenuLink asChild>
              <a
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                href="/"
              >
                <Pyramid className="h-6 w-6" />
                <div className="mb-2 mt-4 text-lg font-medium">
                  {item.poster.name}
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                  {item.poster.description}
                </p>
              </a>
            </NavigationMenuLink>
          </li>
        )}
        {item.links?.map((component) => (
          <ListItem key={component.name} title={component.name}>
            {component.name}
          </ListItem>
        ))}
      </ul>
    </NavigationMenuContent>
  </NavigationMenuItem>
)

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
