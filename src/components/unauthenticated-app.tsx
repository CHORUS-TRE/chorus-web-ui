'use client'

import Image from 'next/image'
import React from 'react'

import { Header } from '@/components/header'
import cover from '@/public/cover.jpeg'
import LoginForm from '~/components/forms/login-form'
import LoginInfo from '~/components/login-info'

export function UnauthenticatedApp() {
  return (
    <>
      <header className="fixed left-0 top-0 z-40 h-11 min-w-full">
        <Header />
      </header>

      <div
        className="overlay-surface fixed left-1/2 top-1/2 z-30 m-4 flex w-3/4 max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-row items-stretch justify-between rounded-2xl"
        id="login-content"
      >
        <LoginInfo />
        <LoginForm />
      </div>
      <Image
        alt="Background"
        src={cover}
        placeholder="blur"
        quality={75}
        priority={false}
        sizes="100vw"
        id="background"
        className="fixed left-0 top-0 h-full w-full"
      />
    </>
  )
}
