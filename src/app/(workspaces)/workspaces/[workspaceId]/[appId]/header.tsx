'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Maximize, Settings } from 'lucide-react'

import { workbenchGet } from '@/components/actions/workbench-view-model'
import { HeaderButtons } from '@/components/header-buttons'
import { Button } from '@/components/ui/button'

import { workspaceGet } from '~/components/actions/workspace-view-model'
import { UserResponse, Workbench, WorkspaceResponse } from '~/domain/model'

import logo from '/public/logo-chorus-primaire-white@2x.svg'

export function Header() {
  const [error, setError] = useState<UserResponse['error']>()
  const [workbench, setWorkbench] = useState<Workbench | null>(null)
  const [workspace, setWorkspace] = useState<WorkspaceResponse['data']>()
  const params = useParams<{ workspaceId: string; appId: string }>()

  const workspaceId = params?.workspaceId
  const workbenchId = params?.appId

  useEffect(() => {
    if (!workspaceId) return

    workspaceGet(workspaceId)
      .then((response) => {
        if (response?.error) setError(response.error)
        if (response?.data) setWorkspace(response?.data)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [workspaceId])

  useEffect(() => {
    if (!workbenchId) return

    workbenchGet(workbenchId)
      .then((response) => {
        if (response?.error) setError(response.error)
        if (response?.data) setWorkbench(response?.data)
      })
      .catch((error) => {
        setError(error.message)
      })
  }, [workbenchId])

  return (
    <nav className="grid h-11 min-w-full grid-cols-3 items-center bg-slate-900 bg-opacity-70 py-1 text-slate-100 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-start gap-4 pl-4">
        <Link href="/" passHref>
          <Image
            src={logo}
            alt="Chorus"
            height={36}
            className="aspect-auto cursor-pointer"
            id="logo"
          />
        </Link>{' '}
        &gt;{' '}
        <Link
          href={`/workspaces/${workspaceId}`}
          className="border-b-2 border-accent text-sm hover:border-b-2 hover:border-accent [&.active]:border-b-2 [&.active]:border-accent [&.active]:text-white"
        >
          {workspace?.shortName}
        </Link>
      </div>

      <div className="flex items-center justify-center gap-8">
        <h4>{workbench?.name}</h4>
      </div>

      <div className="flex items-center justify-end pr-2">
        <Link
          href={`/workspaces/${workspaceId}/${workbenchId}/preferences`}
          className="text-accent hover:text-accent-foreground"
        >
          <Button
            size="icon"
            className="overflow-hidden rounded-full"
            variant="ghost"
          >
            <Settings />
          </Button>
        </Link>
        <Link
          href={`#`}
          passHref
          className="text-accent hover:text-accent-foreground"
        >
          <Button
            size="icon"
            className="overflow-hidden rounded-full"
            variant="ghost"
            onClick={() => {
              const iframe = document.getElementById('iframe')
              if (iframe) {
                iframe.requestFullscreen()
              }
            }}
          >
            <Maximize />
          </Button>
        </Link>
        <div className="ml-4">
          <HeaderButtons />
        </div>
      </div>
    </nav>
  )
}
