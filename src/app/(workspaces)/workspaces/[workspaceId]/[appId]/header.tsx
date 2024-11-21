'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Maximize, Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { userMe } from '~/components/actions/user-view-model'
import { workspaceGet } from '~/components/actions/workspace-view-model'
import { AppInstanceCreateForm } from '~/components/forms/app-instance-forms'
import { Header as BaseHeader } from '~/components/header'
import { UserResponse, Workbench, WorkspaceResponse } from '~/domain/model'

export function Header() {
  const [user, setUser] = useState<UserResponse['data']>()

  const params = useParams<{ workspaceId: string; appId: string }>()

  useEffect(() => {
    userMe().then((response) => {
      if (response?.data) setUser(response.data)
    })
  }, [])

  const additionalHeaderContent = (
    <div className="flex items-center gap-2">
      <AppInstanceCreateForm
        workbenchId={params.appId}
        userId={user?.id}
        workspaceId={params.workspaceId}
      />
      <Link
        href={`/workspaces/${params.workspaceId}/${params.appId}/preferences`}
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
    </div>
  )

  return <BaseHeader additionalHeaderButtons={additionalHeaderContent} />
}
