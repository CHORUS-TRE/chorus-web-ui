'use client'

import React, { useEffect, useState } from 'react'
import { Workspace as WorkspaceType } from '@/domain/model'
import { workspacesListViewModel } from './workspaces-list-view-model'
import Link from 'next/link'

export default function Page() {
  const [workspaces, setWorkspaces] = useState<WorkspaceType[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      workspacesListViewModel()
        .then((response) => {
          if (response?.error) setError(response.error)
          if (response?.data) setWorkspaces(response.data)
        })
        .catch((error) => {
          setError(error.message)
        })
    } catch (error: any) {
      setError(error.message)
    }
  }, [])

  return (
    <div className="flex">
      <div className="flex min-h-screen w-full flex-col  bg-muted/40">
        <div>
          {/* Main space */}
          <div className="flex flex-col pt-8 ">
            <div className="flex">
              <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                  <div className="grid gap-6">
                    {error && <p className="mt-4 text-red-500">{error}</p>}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {workspaces?.map((workspace) => (
                        <Link
                          href={`/workspaces/${workspace.id}`}
                          key={workspace.id}
                          className="rounded-lg bg-white p-4 shadow-md"
                        >
                          <h2 className="text-xl font-bold">
                            {workspace.name}
                          </h2>
                          <p className="text-gray-500">
                            {workspace.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
