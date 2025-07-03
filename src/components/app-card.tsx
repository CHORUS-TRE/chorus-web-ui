'use client'

import { MoreVertical, Pencil, Plus, Trash } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '~/components/button'
import { AppEditDialog } from '~/components/forms/app-edit-dialog'
import { DeleteDialog } from '~/components/forms/delete-dialog'
import {
  Card,
  CardContent,
  CardDescription,
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
import { App, AppInstanceStatus } from '~/domain/model'

import { createAppInstance } from './actions/app-instance-view-model'
import { appDelete } from './actions/app-view-model'
import { toast } from './hooks/use-toast'
import { useAppState } from './store/app-state-context'
import { useAuth } from './store/auth-context'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { WorkspaceWorkbenchList } from './workspace-workbench-list'

interface AppCardProps {
  app: App
  onUpdate: () => void
}

export function AppCard({ app, onUpdate }: AppCardProps) {
  const [showStartSessionDialog, setShowStartSessionDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { background, refreshWorkbenches, refreshWorkspaces, setBackground } =
    useAppState()
  const { user } = useAuth()
  const router = useRouter()

  const handleDelete = async () => {
    if (isDeleting) return

    try {
      setIsDeleting(true)

      const result = await appDelete(app.id)

      if (result.error) {
        toast({
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
      toast({
        title: 'App deletion failed',
        variant: 'destructive',
        description:
          error instanceof Error ? error.message : 'An error occurred'
      })
      setIsDeleting(false)
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleDialogClose = (open: boolean) => {
    if (!isDeleting) {
      setShowDeleteDialog(open)
    }
  }

  const handleStartApp = async () => {
    const sessionId = background?.sessionId
    const workspaceId = background?.workspaceId
    if (!sessionId || !workspaceId) {
      return
    }

    toast({
      title: 'Launching app...',
      description: `Starting ${app.name}`,
      variant: 'default'
    })

    const formData = new FormData()
    formData.append('appId', app.id)
    formData.append('tenantId', '1')
    formData.append('userId', user?.id || '')
    formData.append('workspaceId', workspaceId)
    formData.append('workbenchId', sessionId)
    formData.append('status', AppInstanceStatus.ACTIVE)

    try {
      const result = await createAppInstance({}, formData)

      if (result.error) {
        toast({
          title: 'Error launching app',
          description: result.error,
          variant: 'destructive'
        })
        return
      }

      if (result.issues) {
        console.error('result.issues', result.issues)
        return
      }

      toast({
        title: 'Success!',
        description: `${app.name} launched successfully`
      })

      router.push(`/workspaces/${workspaceId}/sessions/${sessionId}`)

      refreshWorkbenches()
      refreshWorkspaces()
    } catch (error) {
      toast({
        title: 'Error launching app',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive'
      })
    }
  }

  return (
    <>
      <Card className="flex h-full flex-col rounded-2xl border-muted/40 bg-background/60 text-white">
        <CardHeader className="relative pb-4">
          <div className="flex items-center space-x-4">
            {app.iconURL && (
              <Image
                src={app.iconURL || ''}
                alt={app.name || 'App logo'}
                width={32}
                height={32}
                className="h-8 w-8 shrink-0"
                priority
              />
            )}
            {!app.iconURL && (
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback>{app.name?.slice(0, 2) || ''}</AvatarFallback>
              </Avatar>
            )}
            <CardTitle className="flex items-center gap-3 pr-2 text-white">
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
          <CardDescription className="mb-3 text-xs text-muted">
            {app.dockerImageName}:{app.dockerImageTag}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted">
            {app.description || 'No description available'}
          </div>
        </CardContent>
        <CardFooter className="mt-auto">
          <Button
            onClick={() => {
              if (background?.sessionId) {
                handleStartApp()
              } else {
                setShowStartSessionDialog(true)
              }
            }}
            className="small"
            disabled={false}
          >
            <Plus className="mr-2 h-4 w-4" />
            {background?.sessionId ? 'Start App' : 'Start App...'}
          </Button>
        </CardFooter>
      </Card>

      <Dialog
        open={showStartSessionDialog}
        onOpenChange={setShowStartSessionDialog}
      >
        <DialogContent className="bg-background text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              Choose a session to start the app
            </DialogTitle>
          </DialogHeader>
          <WorkspaceWorkbenchList
            workspaceId={background?.workspaceId}
            action={({ id, workspaceId }) => {
              setBackground({
                sessionId: id,
                workspaceId: workspaceId
              })
              setShowStartSessionDialog(false)
              handleStartApp()
            }}
          />
        </DialogContent>
      </Dialog>

      {showEditDialog && (
        <AppEditDialog
          app={app}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSuccess={onUpdate}
        />
      )}

      <DeleteDialog
        open={showDeleteDialog}
        onCancel={() => handleDialogClose(true)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete App"
        description={`Are you sure you want to delete ${app.name || 'this app'}? This action cannot be undone.`}
      />
    </>
  )
}
