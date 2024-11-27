'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'

import {
  ListItem,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '~/components/ui/navigation-menu'
import { App } from '~/domain/model'

import { appList } from './actions/app-view-model'
import { navigationMenuTriggerStyle } from './ui/navigation-menu'
import Breadcrumb from './breadcrumb'
import { HeaderButtons } from './header-buttons'

import logo from '/public/logo-chorus-primaire-white@2x.svg'

interface HeaderProps {
  additionalHeaderButtons?: React.ReactNode
}

export function Header({ additionalHeaderButtons }: HeaderProps) {
  const [apps, setApps] = useState<App[]>([])
  const [error, setError] = useState<string>()

  useEffect(() => {
    appList().then((res) => {
      if (res.error) {
        setError(res.error)
        return
      }

      if (!res.data) {
        setError('There is no apps available')
        return
      }

      setApps(res.data.filter((app) => app.type === 'service'))
    })
  }, [])

  const services: { title: string; href: string; description: string }[] = apps
    .filter((app) => app.type === 'service')
    .map((app) => ({
      title: app.name || '',
      href: `/services/${app.id}`,
      description: app.description || ''
    }))

  return (
    <nav className="grid h-11 min-w-full grid-cols-3 items-center bg-black bg-opacity-85 py-1 text-slate-100 shadow-lg backdrop-blur-sm">
      <div className="flex flex-nowrap items-center justify-start pl-4">
        <Link href="/" passHref className="">
          <Image
            src={logo}
            alt="Chorus"
            height={36}
            className="aspect-auto cursor-pointer"
            id="logo"
          />
        </Link>
        <Breadcrumb />
      </div>

      <div className="">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Workspaces
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/app-store" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  App Store
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/services"
                      >
                        <Image
                          src="/chuv.png"
                          alt="CHUV"
                          width={126}
                          height={66}
                          className=""
                        />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          CHUV Services
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Data explorer and cohort builder
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  {services.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {/* <NavigationMenuItem>
              <Link href="#" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Data
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem> */}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center justify-end pr-4">
        <div className="relative flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted-foreground" />
          <Input
            disabled
            type="search"
            placeholder="Find workspaces, apps, content ..."
            className="h-7 border-none bg-background pl-8 md:w-[240px] lg:w-[360px]"
          />
        </div>
        <div className="ml-4 flex items-center gap-2">
          {additionalHeaderButtons}
          <HeaderButtons />
        </div>
      </div>
    </nav>
  )
}
