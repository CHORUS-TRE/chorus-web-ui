'use client'

import { ArrowRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useActionState, useEffect, useState, useTransition } from 'react'

import logo from '/public/logo-chorus-primaire-white@2x.svg'
import { AuthenticationMode, Result, User } from '@/domain/model'
import { AuthenticationModeType } from '@/domain/model/authentication'
import { useAuthentication } from '@/providers/authentication-provider'
import {
  getAuthenticationModes,
  getOAuthUrl
} from '@/view-model/authentication-view-model'
import { Button } from '~/components/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

import { toast } from '../hooks/use-toast'
import { storeRedirectUrl } from '@/utils/redirect-storage'

const initialState: Result<User> = {
  data: undefined,
  error: undefined,
  issues: undefined
}

export default function LoginForm() {
  const { login } = useAuthentication()
  const searchParams = useSearchParams()!

  const [state, formAction, pending] = useActionState(login, initialState)
  const [authModes, setAuthModes] = useState<AuthenticationMode[]>()
  const [, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAuthModes = async () => {
      try {
        const response = await getAuthenticationModes()

        if (response.error) {
          toast({
            title: "Couldn't load authentication methods",
            description: 'Please try again later',
            variant: 'destructive'
          })
          return
        }

        setAuthModes(response.data || [])
        setIsLoading(false)
      } catch (error) {
        toast({
          title: "Couldn't load authentication methods",
          description: 'Please try again later',
          variant: 'destructive'
        })
        console.error(error)
      }
    }

    fetchAuthModes()
  }, [])

  useEffect(() => {
    if (state.error) {
      toast({
        title: 'Login failed',
        description: state.error,
        variant: 'destructive'
      })

      return
    }
  }, [state, searchParams])

  const handleOAuthLogin = async (mode: AuthenticationMode) => {
    if (mode.openid?.id) {
      const response = await getOAuthUrl(mode.openid.id)
      if (response.error) {
        toast({
          title: "Couldn't initiate login",
          description: response.error,
          variant: 'destructive'
        })
        return
      }

      if (response.data) {

        // Store current page URL for redirect after OAuth completion
        const currentPath = window.location.pathname + window.location.search
        if (currentPath && currentPath !== '/') {
          storeRedirectUrl(currentPath)
        }

        const url = new URL(response.data)
        const currentState = url.searchParams.get('state') || ''
        url.searchParams.set('state', `${currentState}:${mode.openid.id}`)

        const redirectPath = searchParams.get('redirect') || '/'
        // Ensure the redirect URL is relative and doesn't contain protocol/domain
        const isValidRedirect =
          redirectPath.startsWith('/') && !redirectPath.includes('//')
        // Redirect to the validated path or fallback to home
        window.location.href =
          url.toString() + (isValidRedirect ? redirectPath : '/')
      }
    }
  }

  const error = searchParams.get('error')
  if (error) {
    toast({
      title: 'Authentication Error',
      description: error,
      variant: 'destructive'
    })
  }

  const internalLogin = authModes?.some(
    (mode) =>
      mode.type === AuthenticationModeType.INTERNAL && mode.internal?.enabled
  )

  return (
    <div className="flex w-full flex-col items-center justify-center bg-black bg-opacity-20 p-8 md:w-1/2">
      <div className="grid h-full w-full gap-2 p-8 text-white">
        {isLoading ?? (
          <div className="gap-4 text-center">
            <h2>Login</h2>
          </div>
        )}

        {isLoading ? (
          <div className="flex h-full animate-pulse content-center justify-center gap-4 bg-transparent">
            <Image
              src={logo}
              alt="Chorus"
              height={64}
              className="aspect-auto"
              id="logo"
              priority
            />
          </div>
        ) : (
          <>
            {/* Internal Login Form */}
            {internalLogin && (
              <>
                <div className="grid gap-4 text-center">
                  <p className="text-muted">
                    Enter your username below to login to your account
                  </p>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    startTransition(() => {
                      formAction(formData)
                    })
                  }}
                  className="w-full"
                >
                  <div className="grid gap-4 py-8">
                    <div className="grid gap-2">
                      <Label htmlFor="username">username</Label>
                      <Input
                        id="username"
                        type="input"
                        name="username"
                        required
                        disabled={pending}
                        className="border border-muted/40 bg-background text-white"
                        defaultValue={searchParams.get('username') || ''}
                      />
                    </div>
                    <div className="mb-2 grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        name="password"
                        className="border border-muted/40 bg-background text-muted"
                        required
                        autoComplete="current-password"
                        disabled={pending}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={pending}
                      className="flex w-full items-center justify-center gap-1 rounded-full bg-accent text-sm text-black transition-[gap] duration-500 ease-in-out hover:gap-2 hover:bg-accent-background focus:bg-accent-background focus:ring-2 focus:ring-accent"
                    >
                      {pending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="mr-2 h-4 w-4" />
                      )}
                      Login
                    </Button>
                  </div>
                </form>
              </>
            )}

            {/* OAuth Providers */}
            <div className="grid gap-4">
              {authModes && authModes.length > 0 && (
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted">
                      {internalLogin
                        ? 'Or choose an account'
                        : 'Choose an account'}
                    </span>
                  </div>
                </div>
              )}
              {authModes &&
                authModes
                  .filter((mode) => mode.type === AuthenticationModeType.OPENID)
                  .map((mode) => (
                    <Button
                      key={mode.openid?.id}
                      className="w-full justify-center"
                      onClick={() => handleOAuthLogin(mode)}
                    >
                      {mode.buttonText || mode.openid?.id || 'Open ID'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ))}
            </div>
          </>
        )}

        {internalLogin && (
          <div className="mt-4 text-center text-sm text-white">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-muted underline hover:text-accent"
              prefetch={false}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
