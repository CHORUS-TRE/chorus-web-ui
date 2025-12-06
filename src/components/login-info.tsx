'use client'

import { ExternalLink, Github } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

import { useInstanceConfig } from '@/hooks/use-instance-config'
import logoBlack from '@/public/logo-chorus-primaire-black@2x.svg'
import logoWhite from '@/public/logo-chorus-primaire-white@2x.svg'

import packageInfo from '../../package.json'

export default function LoginInfo() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const instanceConfig = useInstanceConfig()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Default logos
  const defaultLogo =
    mounted && resolvedTheme === 'light' ? logoBlack : logoWhite

  // Custom logo based on theme (if available)
  const customLogo =
    mounted && resolvedTheme === 'light'
      ? instanceConfig.logo?.light
      : instanceConfig.logo?.dark

  return (
    <div className="hidden w-full flex-col items-center justify-center p-8 md:flex md:w-1/2">
      <div className="mt-8 flex flex-grow flex-col items-center justify-center">
        <Image
          src={defaultLogo}
          alt={`${instanceConfig.name} Logo`}
          width={320}
          height={180}
          className="mb-12 h-36 w-auto max-w-full"
          priority
        />

        {customLogo && (
          <Image
            src={customLogo}
            alt={`${instanceConfig.name} Logo`}
            width={320}
            height={180}
            className="mb-12 aspect-[80/33] h-24 w-auto max-w-full"
            priority
          />
        )}

        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold">{instanceConfig.headline}</h1>
          <p className="text-md mb-4 text-muted">{instanceConfig.tagline}</p>
        </div>
      </div>
      <div className="flex w-full items-end justify-between gap-2">
        <div>
          <a
            href="https://www.chorus-tre.ch/en/"
            className="mb-1 flex items-center gap-2 text-xs font-medium text-muted underline hover:text-accent"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CHORUS Website"
          >
            <ExternalLink className="size-4" />
            CHORUS Website
          </a>
          <a
            href={instanceConfig.website}
            className="mb-1 flex items-center gap-2 text-xs font-medium text-muted underline hover:text-accent"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${instanceConfig.name} website`}
          >
            <ExternalLink className="size-4" />
            {instanceConfig.name} Website
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
