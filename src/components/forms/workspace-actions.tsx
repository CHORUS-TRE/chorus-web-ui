'use client'

import { useRouter } from 'next/navigation'
import { EllipsisVerticalIcon } from 'lucide-react'

import {
  workspaceCreate,
  workspaceDelete
} from '@/components/actions/workspace-view-model'
import { Icons } from '@/components/ui/icons'

import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'

export function DropdownMenuActions({ id }: { id?: string }) {
  const router = useRouter()

  async function handleDelete() {
    await workspaceDelete(id)
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <EllipsisVerticalIcon className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function CreateWorkspaceAction() {
  const router = useRouter()

  async function handleCreate() {
    // const formData = new FormData()
    await workspaceCreate()
    router.refresh()
  }

  return (
    <Button size="sm" className="h-8 gap-1" onClick={handleCreate}>
      <Icons.CirclePlusIcon className="h-3.5 w-3.5" />
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
        Create workspace
      </span>
    </Button>
  )
}