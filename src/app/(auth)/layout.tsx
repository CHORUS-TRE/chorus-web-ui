'use client'

import { Github, Link } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect } from 'react'

import logo from '/public/logo-chorus-primaire-white@2x.svg'
import { useAppState } from '@/components/store/app-state-context'
import { Header } from '~/components/header'
import { Toaster } from '~/components/ui/toaster'
import { toast } from '~/hooks/use-toast'

import packageInfo from '../../../package.json'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const { notification } = useAppState()

  useEffect(() => {
    if (notification) {
      toast({
        title: notification.title,
        description: notification.description || '',
        variant: notification.variant,
        className: 'bg-background text-white'
      })
    }
  }, [notification])

  return (
    <>
      <header className="fixed left-0 top-0 z-40 h-11 min-w-full" id="header">
        <Header />
      </header>

      <div
        className="fixed left-1/2 top-1/2 z-30 m-4 flex w-3/4 max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-row items-stretch justify-between rounded-2xl bg-black bg-opacity-75"
        id="content"
      >
        {/* Left Column - Brand Info */}
        <div className="hidden h-full w-1/2 flex-col items-center justify-center p-8 md:flex">
          <div className="mt-8 flex flex-col items-center justify-center">
            <Image
              src={logo}
              alt="Chorus Logo"
              width={320}
              height={180}
              className="mb-12 h-36 w-auto max-w-full flex-grow"
              priority
            />
            <div className="max-w-xs text-center text-white">
              <h1 className="mb-2 text-2xl font-bold">
                A secure, open-source platform revolutionizing collaborative
                medical research and AI development.
              </h1>
              <p className="text-md mb-4 text-muted">
                Your One-Stop Shop for Data, Applications, and AI
              </p>
            </div>
          </div>
          <div className="mt-auto flex-grow"></div>
          <div className="flex w-full items-end justify-between gap-2">
            <div className="">
              <a
                href="https://chorus-tre.ch"
                className="mb-1 flex items-center gap-2 text-xs font-medium text-muted underline hover:text-accent"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chorus website"
              >
                <Link className="size-4" />
                CHORUS Website
              </a>
              <a
                href="https://github.com/CHORUS-TRE/"
                className="flex items-center gap-2 text-xs font-medium text-muted underline hover:text-accent"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GITHUB"
              >
                <Github className="size-4" />
                <span>Github</span>
              </a>
            </div>
            <p className="text-xs text-muted">
              Web-UI Version: {packageInfo.version}
            </p>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="flex w-full flex-col items-center justify-center bg-black bg-opacity-20 p-8 md:w-1/2">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <Toaster />
    </>
  )
}
