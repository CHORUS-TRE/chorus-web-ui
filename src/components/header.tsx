'use client'

import { CircleHelp, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { logout } from '@/components/actions/authentication-login-view-model'
import { userMe } from '@/components/actions/user-view-model'
import { useAuth } from '@/components/auth-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

import { UserResponse } from '~/domain/model'

import Breadcrumb from './breadcrumb'

import logo from '/public/logo-chorus-primaire-white@2x.svg'
import userPlaceholder from '/public/placeholder-user.jpg'

export function Header() {
  const [user, setUser] = useState<UserResponse['data']>()
  const [error, setError] = useState<UserResponse['error']>()

  const router = useRouter()
  const { isAuthenticated, setAuthenticated } = useAuth()

  const handleLogoutClick = async () => {
    await logout()
    setAuthenticated(false)
    router.push('/')
  }

  useEffect(() => {
    userMe()
      .then((response) => {
        if (response?.error) setError(response.error)
        if (response?.data) setUser(response?.data)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [])

  return (
    <nav className="flex h-11 min-w-full items-center justify-between	 gap-2 bg-slate-900 bg-opacity-70 py-1 text-slate-100 shadow-lg backdrop-blur-sm">
      <div className="flex items-center pl-4">
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

      <div className="flex items-center gap-4">
        <Link
          href="#"
          passHref
          className="text-accent hover:text-accent-foreground"
        >
          App Store
        </Link>
        <Link
          href="#"
          passHref
          className="text-accent hover:text-accent-foreground"
        >
          Services
        </Link>
        <Link
          href="#"
          passHref
          className="text-accent hover:text-accent-foreground"
        >
          Data
        </Link>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 pr-4 md:grow-0">
          <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Find workspaces, apps, content ..."
            className=" h-7 bg-slate-900 pl-8 md:w-[240px] lg:w-[360px]"
          />
        </div>
        <div className="mr-4 flex items-center">
          <Button
            size="icon"
            className="overflow-hidden rounded-full text-accent hover:text-accent-foreground"
            variant="ghost"
          >
            <CircleHelp />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                className="overflow-hidden rounded-full text-accent hover:text-accent-foreground "
                variant="ghost"
              >
                <Image
                  src={user?.avatar || userPlaceholder}
                  width={24}
                  height={24}
                  alt="Avatar"
                  className="overflow-hidden rounded-full border-2 border-accent"
                  style={{ aspectRatio: '24/24', objectFit: 'cover' }}
                />
              </Button>
            </DropdownMenuTrigger>
            {isAuthenticated ? (
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  {!error && (
                    <Link href="/users/me" passHref>
                      <p className="leading-7 [&:not(:first-child)]:mt-6">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </Link>
                  )}
                  {error && <p className="text-red-500">{error}</p>}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="#" passHref>
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogoutClick}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            ) : (
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/login" passHref>
                    Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/register" passHref>
                    Register
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
