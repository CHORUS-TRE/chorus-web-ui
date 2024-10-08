'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CircleHelp } from 'lucide-react'

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

import { UserResponse } from '~/domain/model'

import { useNavigation } from './navigation-context'

import userPlaceholder from '/public/placeholder-user.jpg'

export function HeaderButtons() {
  const [user, setUser] = useState<UserResponse['data']>()
  const [error, setError] = useState<UserResponse['error']>()

  const router = useRouter()
  const { setBackground, toggleRightSidebar } = useNavigation()

  const { isAuthenticated, setAuthenticated } = useAuth()

  const handleLogoutClick = async () => {
    await logout()
    setBackground(undefined)
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
    <>
      <div className="flex items-center justify-end pr-4">
        <Button
          size="icon"
          className="overflow-hidden rounded-full text-accent hover:text-accent-foreground"
          variant="ghost"
          onClick={toggleRightSidebar}
        >
          <CircleHelp />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="overflow-hidden rounded-full text-accent hover:text-accent-foreground"
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
              <DropdownMenuItem asChild>
                {!error ? (
                  <Link href="/users/me">
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                      {user?.firstName} {user?.lastName}
                    </p>
                  </Link>
                ) : (
                  <p className="text-red-500">{error}</p>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
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
              <DropdownMenuItem asChild>
                <Link href="/login">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/register" passHref>
                  Register
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
    </>
  )
}
