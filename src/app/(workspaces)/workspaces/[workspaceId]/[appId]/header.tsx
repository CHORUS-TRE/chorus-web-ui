'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Maximize, Settings } from 'lucide-react'

import { workbenchGet } from '@/components/actions/workbench-view-model'
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
    <nav className="flex h-11 min-w-full items-center justify-between	 gap-2 bg-slate-900 bg-opacity-70 py-1 text-slate-100 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-start gap-4 pl-4">
        <Link href="/" passHref className="hover:border hover:border-accent">
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
          className="text-accent hover:text-accent-foreground"
        >
          {workspace?.shortName}
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <h4>{workbench?.name}</h4>
      </div>
      <div>
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
          >
            <Maximize />
          </Button>
        </Link>
      </div>
    </nav>
  )
}
