'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CircleHelp, User } from 'lucide-react'

import { logout } from '@/components/actions/authentication-view-model'
import { useAppState } from '@/components/store/app-state-context'
import { useAuth } from '@/components/store/auth-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { UserResponse } from '~/domain/model'

import userPlaceholder from '/public/placeholder-user.jpg'

export function HeaderButtons() {
  const [error, setError] = useState<UserResponse['error']>()

  const router = useRouter()
  const { showRightSidebar, toggleRightSidebar } = useAppState()

  const { isAuthenticated, setAuthenticated, user } = useAuth()

  const handleLogoutClick = async () => {
    await logout()
    setBackground(undefined)
    setAuthenticated(false)
    router.push('/')
  }

  return (
    <>
      <div className="flex items-center justify-end">
        <Button
          size="icon"
          className="overflow-hidden text-muted hover:bg-inherit hover:text-accent"
          variant="ghost"
          onClick={toggleRightSidebar}
        >
          <CircleHelp />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="overflow-hidden text-muted hover:bg-inherit hover:text-accent"
              variant="ghost"
            >
              {user?.avatar && (
                <Image
                  src={user?.avatar || userPlaceholder}
                  width={24}
                  height={24}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                  style={{ aspectRatio: '24/24', objectFit: 'cover' }}
                />
              )}
              {!user?.avatar && <User />}
            </Button>
          </DropdownMenuTrigger>
          {isAuthenticated ? (
            <DropdownMenuContent align="end" className="bg-black text-white">
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
            <DropdownMenuContent align="end" className="bg-black text-white">
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
