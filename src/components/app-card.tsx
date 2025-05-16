'use client'

import { MoreVertical, Pencil, Plus, Trash } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { AppEditDialog } from '~/components/app-edit-dialog'
import { Button } from '~/components/button'
import { DeleteDialog } from '~/components/delete-dialog'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { App } from '~/domain/model'

import { appDelete } from './actions/app-view-model'
import { useAppState } from './store/app-state-context'
import { Avatar, AvatarFallback } from './ui/avatar'

interface AppCardProps {
  app: App
  onUpdate: () => void
}

export function AppCard({ app, onUpdate }: AppCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { setNotification } = useAppState()
  const handleDelete = async () => {
    if (isDeleting) return

    try {
      setIsDeleting(true)
      setNotification(undefined)

      const result = await appDelete(app.id)

      if (result.error) {
        setNotification({
          title: 'App deletion failed',
          variant: 'destructive',
          description: result.error
        })
        return
      }

      setShowDeleteDialog(false)
      setTimeout(() => {
        onUpdate()
        setIsDeleting(false)
      }, 100)
    } catch (error) {
      setNotification({
        title: 'App deletion failed',
        variant: 'destructive',
        description:
          error instanceof Error ? error.message : 'An error occurred'
      })
      setIsDeleting(false)
    }
  }

  const handleDeleteClick = () => {
    setNotification(undefined)
    setShowDeleteDialog(true)
  }

  const handleDialogClose = (open: boolean) => {
    if (!isDeleting) {
      setShowDeleteDialog(open)
    }
  }

  return (
    <>
      <Card className="flex flex-col overflow-hidden border border-muted/40 bg-background/40 transition-colors hover:bg-background/80">
        <CardHeader className="relative flex flex-row items-start justify-between space-y-0 border-b border-muted/40 pb-2">
          <div className="flex items-center space-x-4">
            {app.iconURL && (
              <Image
                src={app.iconURL || ''}
                alt={app.name || 'App logo'}
                width={48}
                height={48}
                className="h-12 w-12 shrink-0"
                priority
              />
            )}
            {!app.iconURL && (
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarFallback>{app.name?.slice(0, 2) || ''}</AvatarFallback>
              </Avatar>
            )}
            <CardTitle className="shrink border-b-0 text-xl font-semibold text-white">
              {app.name || 'Unnamed App'}
            </CardTitle>
          </div>
          <div className="absolute right-2 top-4">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="justifiy-center m-0 h-8 w-8 p-0 text-accent ring-0 hover:bg-accent hover:text-black"
                  disabled={isDeleting}
                >
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black text-white">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => setShowEditDialog(true)}
                  disabled={isDeleting}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteClick}
                  className="text-destructive focus:text-destructive"
                  disabled={isDeleting}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4 flex flex-col">
            <p className="text-white">
              {app.description || 'No description available'}
            </p>
            <div className="text-sm text-muted-foreground">
              {app.dockerImageName}:{app.dockerImageTag}
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-auto">
          <Button
            onClick={() => {
              /* TODO: Implement add to my apps */
            }}
            className=""
            disabled={true}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add to My Apps
          </Button>
        </CardFooter>
      </Card>

      <AppEditDialog
        app={app}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={onUpdate}
      />

      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={handleDialogClose}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete App"
        description={`Are you sure you want to delete ${app.name || 'this app'}? This action cannot be undone.`}
      />
    </>
  )
}
