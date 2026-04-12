'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState
} from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Result } from '@/domain/model'
import { User, UserUpdateSchema } from '@/domain/model/user'
import { updateUser } from '@/view-model/user-view-model'

import { toast } from '../hooks/use-toast'

type FormData = z.infer<typeof UserUpdateSchema>

export function UserEditDialog({
  user,
  onUserUpdated,
  isControlled = false
}: {
  user: User
  onUserUpdated: () => void
  isControlled?: boolean
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [internalUser, setInternalUser] = useState(user)
  const [hasBeenModified, setHasBeenModified] = useState(false)
  const prevDialogOpenRef = useRef(false)

  useEffect(() => {
    const wasOpen = prevDialogOpenRef.current
    prevDialogOpenRef.current = dialogOpen

    if (dialogOpen && !wasOpen) {
      setInternalUser(user)
      setHasBeenModified(false)
    }
  }, [dialogOpen, user])

  const form = useForm<FormData>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      id: internalUser.id,
      firstName: internalUser.firstName,
      lastName: internalUser.lastName,
      username: internalUser.username,
      password: '',
      rolesWithContext: internalUser.rolesWithContext || []
    }
  })

  useEffect(() => {
    form.reset({
      id: internalUser.id,
      firstName: internalUser.firstName,
      lastName: internalUser.lastName,
      username: internalUser.username,
      password: '',
      rolesWithContext: internalUser.rolesWithContext || []
    })
  }, [internalUser, form])

  const [state, formAction] = useActionState(updateUser, {} as Result<User>)

  useEffect(() => {
    if (state?.error || state?.issues) {
      // Display validation errors in toast
      if (state.issues && state.issues.length > 0) {
        const errorMessages = state.issues
          .map((issue) => {
            const path = issue.path.join('.')
            return path ? `${path}: ${issue.message}` : issue.message
          })
          .join('\n')

        toast({
          title: 'Validation Error',
          description: errorMessages,
          variant: 'destructive'
        })
      } else if (state.error) {
        toast({
          title: 'Error updating user',
          description: state.error,
          variant: 'destructive'
        })
      }
    } else if (state?.data) {
      setDialogOpen(false)
    }
  }, [state])

  const handleOpenChange = (isOpen: boolean) => {
    setDialogOpen(isOpen)
    if (!isOpen && hasBeenModified) {
      onUserUpdated()
    }
  }

  const onSubmit = (data: z.infer<typeof UserUpdateSchema>) => {
    const formData = new FormData()
    formData.append('id', data.id)
    formData.append('username', data.username)
    formData.append('firstName', data.firstName)
    formData.append('lastName', data.lastName)
    formData.append('password', data.password)

    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            aria-label={`Edit user ${user.firstName} ${user.lastName}`}
          >
            <Pencil
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="sr-only">Edit user</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 border-b pb-4">
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-sm text-muted-foreground">
              {internalUser.email || '—'}
            </p>
          </div>
          {internalUser.namespaces !== undefined && (
            <div>
              <p className="text-sm font-medium">Namespaces</p>
              {internalUser.namespaces.length > 0 ? (
                <div className="flex flex-wrap gap-1 pt-1">
                  {internalUser.namespaces.map((ns) => (
                    <Badge key={ns} variant="outline">
                      {ns}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...form.register('id')} />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="Leave blank to keep current password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
