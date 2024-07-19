'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import authenticationLoginViewModel from './authentication-login-view-model'
import Link from 'next/link'
import { useAuth } from '~/components/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const { login } = authenticationLoginViewModel()
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!isLoggedIn) return

    const redirect = searchParams?.get('redirect')
    router.push(redirect || '/')
  }, [isLoggedIn])

  const handleClickAuthenticate = async () => {
    await login(formData.username, formData.password)
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
  )
}
