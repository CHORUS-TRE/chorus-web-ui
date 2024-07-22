'use client'

import { ChangeEvent, useState } from 'react'
import authenticationLoginViewModel from './authentication-login-view-model'
import Link from 'next/link'
import { useAuth } from '~/components/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Login() {
  const { login } = authenticationLoginViewModel()
  const { isLoggedIn } = useAuth()

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')

  // const router = useRouter()
  // const searchParams = useSearchParams()

  // useEffect(() => {
  //   if (!isLoggedIn) return

  //   const redirect = searchParams?.get('redirect')
  //   router.push(redirect || '/')
  // }, [isLoggedIn])

  const handleClickAuthenticate = async () => {
    setError('')
    try {
      await login(formData.username, formData.password)
    } catch (error: any) {
      // eslint-disable-next-line no-console
      // console.error(error)
      setError(error.message)
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  return (
    <>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="#" className="underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden bg-muted lg:block">
          <Image
            src="/placeholder.svg"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
      )
      <div className="bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <main className="flex min-h-screen flex-col items-center justify-center text-white">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-extrabold">Authentication</h2>
          </div>
          <form onSubmit={handleClickAuthenticate} className="mt-8 w-1/3 pb-6">
            {/* Form fields for email and password */}
            <div className="mb-4">
              <label htmlFor="username" className="mb-2 block">
                Username:
              </label>
              <input
                type="input"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded border p-2 text-black"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="mb-2 block">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded border p-2 text-black"
              />
            </div>
          </form>
          {/* Button to submit the form */}
          <button
            onClick={handleClickAuthenticate}
            className="cursor-pointer rounded-lg bg-white bg-opacity-20 px-6 py-2 text-lg font-medium hover:bg-opacity-30"
          >
            Log in
          </button>
          {/* Link to registration page */}
          <Link href="/user" passHref className="mt-4">
            <span className="underline">Or create an account here</span>
          </Link>
          {/* Display login status messages */}
          <p className="mt-4">{isLoggedIn && 'Welcome back!'}</p>
        </main>
      </div>
    </>
  )
}
