'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'

import Breadcrumb from './breadcrumb'
import { HeaderButtons } from './header-buttons'

import logo from '/public/logo-chorus-primaire-white@2x.svg'

export function Header() {
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

      <div className="flex items-center justify-center gap-8">
        <Link
          href="#"
          passHref
          className="nav-link hover:text-accent hover:underline"
        >
          App Store
        </Link>
        <Link
          href="#"
          passHref
          className="nav-link hover:text-accent hover:underline"
        >
          Services
        </Link>
        <Link
          href="#"
          passHref
          className="nav-link hover:text-accent hover:underline"
        >
          Data
        </Link>
      </div>

      <div className="flex items-center justify-end pr-4">
        <div className="relative flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Find workspaces, apps, content ..."
            className="h-7 border-none bg-background pl-8 md:w-[240px] lg:w-[360px]"
          />
        </div>
        <div className="ml-4">
          <HeaderButtons />
        </div>
      </div>
    </nav>
  )
}
