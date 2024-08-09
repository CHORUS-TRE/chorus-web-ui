'use client'

import { Pyramid, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/components/auth-context'
import Image from 'next/image'
import userPlaceholder from '/public/placeholder-user.jpg'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { logout } from '~/app/(auth)/login/authentication-login-view-model'
import { Navigation } from '@/components/top-navigation'
import { useEffect, useState } from 'react'
import { UserResponse } from '~/domain/model'
import { userMe } from '@/app/user-view-model.server'
import { useRouter } from 'next/navigation'

const plateform = {
  navigation: [
    'My Workspace',
    'Workspaces',
    'Data ',
    'Community',
    'Getting Started'
  ]
}
const showLargeLeftSidebar = true

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
    <header className="sticky top-0 z-30 flex h-14 items-center gap-8 bg-zinc-800  bg-opacity-60 px-4 pb-16 text-slate-100 backdrop-blur-sm sm:static sm:h-auto sm:gap-1 sm:px-6 sm:py-1">
      <nav className="flex flex-grow items-center justify-between gap-x-8 pr-8">
        {/* <Link
          href="/"
          className={`flex h-5 flex-grow items-center gap-4 rounded-lg  text-muted-foreground transition-colors hover:text-foreground md:h-8`}
          prefetch={false}
        >
          <Pyramid className="h-5 w-5" />
          CHORUS
        </Link> */}
        {/* {plateform.navigation.map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase()}`}
            className="flex items-center justify-center"
            prefetch={false}
          >
            {item}
          </Link>
        ))} */}
        <Navigation />
      </nav>

      <div className="relative ml-auto flex-1 pr-4 md:grow-0">
        <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className=" h-7 pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="overflow-hidden rounded-full">
            <Image
              src={user?.avatar || userPlaceholder}
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
              style={{ aspectRatio: '36/36', objectFit: 'cover' }}
            />
          </Button>
        </DropdownMenuTrigger>
        {isAuthenticated ? (
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href="/users/me" passHref>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>
              <Link href="/" passHref>
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="#" passHref>
                Create Workspace
              </Link>
            </DropdownMenuItem> */}
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
    </header>
  )
}
