'use client'

import { Pyramid } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { UrlObject } from 'url'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

interface Item {
  name: string
  description: string
  href?: string
  poster?: Item
  links?: Item[]
  class?: string
}

const items: Item[] = [
  {
    name: 'Demos',
    description: '',
    class: 'text-muted',
    links: [
      {
        name: 'LLM (LLama 3.1 @127.0.0.1)',
        description: 'When Llama angry, he always do so',
        href: '/home'
      }
    ]
  }
]

export function Navigation() {
  return (
    <NavigationMenu className="pr-32">
      <NavigationMenuList>
        {items.map((item) => {
          if (item.links) {
            if (item.poster)
              return <RichNavigationList item={item} key={item.name} />

            return <BasicNavigationList item={item} key={item.name} />
          }

          return <BasicNavigationItem item={item} key={item.name} />
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const BasicNavigationItem = ({ item }: { item: Item }) => (
  <NavigationMenuItem>
    <Link href={item.href as unknown as UrlObject} legacyBehavior passHref>
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
      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
              <Link
                href={item.href as unknown as UrlObject}
                passHref
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
              >
                <Pyramid className="h-6 w-6" />
                <div className="mb-2 mt-4 text-lg font-medium">
                  {item.poster.name}
                </div>
                <p className="text-sm leading-tight text-muted">
                  {item.poster.description}
                </p>
              </Link>
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
  React.ComponentPropsWithoutRef<'a'> & { wrapWithLi?: boolean }
>(({ className, title, children, wrapWithLi = true, ...props }, ref) => {
  const content = (
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
        <div className="line-clamp-2 text-sm leading-snug text-muted">
          {children}
        </div>
      </a>
    </NavigationMenuLink>
  )

  if (wrapWithLi) {
    return <li>{content}</li>
  }

  return content
})
ListItem.displayName = 'ListItem'
