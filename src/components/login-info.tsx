'use client'

import { Github, Link } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

import logoBlack from '/public/logo-chorus-primaire-black@2x.svg'
import logoWhite from '/public/logo-chorus-primaire-white@2x.svg'

import packageInfo from '../../package.json'

export default function LoginInfo() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const logo = mounted && theme === 'light' ? logoBlack : logoWhite

  return (
    <div className="flex w-full flex-col items-center justify-center p-8 md:w-1/2">
      <div className="mt-8 flex flex-grow flex-col items-center justify-center">
        <Image
          src={logo}
          alt="Chorus Logo"
          width={320}
          height={180}
          className="mb-12 h-36 w-auto max-w-full"
          priority
        />
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">
            A secure, open-source platform revolutionizing collaborative medical
            research and AI development.
          </h1>
          <p className="text-md mb-4 text-muted">
            Your One-Stop Shop for Data, Applications, and AI
          </p>
        </div>
      </div>
      <div className="flex w-full items-end justify-between gap-2">
        <div>
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
  )
}
