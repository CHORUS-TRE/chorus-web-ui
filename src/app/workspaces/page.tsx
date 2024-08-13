'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import {
  workspaceCreate,
  workspaceList
} from '@/app/workspace-view-model.server'
import { Workspace as WorkspaceType } from '@/domain/model'

import { Button } from '~/components/ui/button'

export default function Page() {
  const [workspaces, setWorkspaces] = useState<WorkspaceType[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      workspaceList()
        .then((response) => {
          if (response?.error) setError(response.error)
          if (response?.data) setWorkspaces(response.data)
        })
        .catch((error) => {
          setError(error.message)
        })
    } catch (error) {
      setError(error.message)
    }
  }, [])

  const handleCreateButtonClicked = () => {
    workspaceCreate().then((response) => {
      if (response.error) setError(response.error)
      if (response.data) {
        workspaceList()
          .then((response) => {
            if (response?.error) setError(response.error)
            if (response?.data) setWorkspaces(response.data)
          })
          .catch((error) => {
            setError(error.message)
          })
      }
    })
  }

  return (
    <div className="flex flex-col">
      <Button onClick={handleCreateButtonClicked} className="mb-4 ml-auto">
        Create Workspace
      </Button>
      <div className="mx-auto grid flex-1 auto-rows-max gap-4 ">
        <div className="grid gap-6">
          {error && <p className="mt-4 text-red-500">{error}</p>}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workspaces?.map((workspace) => (
              <Link
                href={`/workspaces/${workspace.id}`}
                key={workspace.id}
                className="rounded-lg bg-white p-4 shadow-md"
              >
                <h2 className="text-xl font-bold">{workspace.name}</h2>
                <p className="text-gray-500">{workspace.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
