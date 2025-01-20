'use client'

import React from 'react'
import Image from 'next/image'
import { Github, Link } from 'lucide-react'

import { Header } from '~/components/header'

import packageInfo from '../../../package.json'

import logo from '/public/logo-chorus-primaire-white@2x.svg'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className="fixed left-0 top-0 z-40 h-11 min-w-full" id="header">
        <Header />
      </div>

      <div
        className="fixed left-1/2 top-1/2 z-30 w-full max-w-[960px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-black bg-opacity-85"
        id="content"
      >
        <div className="grid grid-cols-1 place-items-center gap-8 p-8 md:grid-cols-2 lg:grid-cols-2">
          {/* Left Column - Brand Info */}
          <div className="hidden h-full min-h-[600px] flex-col items-center justify-between md:flex lg:flex">
            <div className="flex flex-1 flex-col items-center justify-center">
              <Image
                src={logo}
                alt="Chorus Logo"
                width={320}
                height={180}
                className="mb-12 h-auto w-full max-w-xs"
                priority
              />
              <div className="max-w-xs text-white">
                <h1 className="mb-2 text-2xl font-bold">
                  A secure, open-source platform revolutionizing collaborative
                  medical research and AI development.
                </h1>
                <p className="text-md mb-4 text-muted-foreground">
                  Your One-Stop Shop for Data, Applications, and AI
                </p>
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Web-UI Version: {packageInfo.version}
                </div>
                <div className="flex justify-start gap-3">
                  <a
                    href="https://chorus-tre.ch"
                    className="flex items-center gap-2 text-xs font-medium text-muted hover:text-accent"
                    target="_blank"
                    aria-label="Chorus website"
                  >
                    <Link className="size-4" />
                  </a>
                  <a
                    href="https://github.com/CHORUS-TRE/"
                    className="flex items-center gap-2 text-xs font-medium text-muted hover:text-accent"
                    target="_blank"
                    aria-label="GITHUB"
                  >
                    <Github className="size-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="w-full self-center p-8">{children}</div>
        </div>
      </div>
    </>
  )
}
