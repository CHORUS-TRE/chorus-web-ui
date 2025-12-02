'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Trash2 } from 'lucide-react'
import { startTransition, useActionState, useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

import { updateUser } from '@/view-model/user-view-model'
import { Button } from '~/components/button'
import { CreateUserRoleDialog } from '~/components/forms/create-user-role-dialog'
import { Badge } from '~/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table'
import { Result } from '~/domain/model'
import { User, UserUpdateSchema } from '~/domain/model/user'

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

  useEffect(() => {
    if (dialogOpen) {
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
      password: ''
    }
  })

  useEffect(() => {
    form.reset({
      id: internalUser.id,
      firstName: internalUser.firstName,
      lastName: internalUser.lastName,
      username: internalUser.username,
      password: ''
    })
  }, [internalUser, form])

  const { fields, remove } = useFieldArray({
    control: form.control,
    name: 'rolesWithContext'
  })

  const [state, formAction] = useActionState(updateUser, {} as Result<User>)

  useEffect(() => {
    if (state?.error) {
      toast({
        title: 'Error updating user',
        description: state.error,
        variant: 'destructive'
      })
    } else if (state?.data) {
      setDialogOpen(false)
    }
  }, [state])

  const handleRoleAdded = (updatedUser: User) => {
    setInternalUser(updatedUser)
    setHasBeenModified(true)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setDialogOpen(isOpen)
    if (!isOpen && hasBeenModified) {
      onUserUpdated()
    }
  }

  const onSubmit = (data: z.infer<typeof UserUpdateSchema>) => {
    const formData = new FormData()
    formData.append('id', data.id)

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
            <Pencil className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Edit user</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
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
            <FormField
              control={form.control}
              name="rolesWithContext"
              render={() => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Roles{' '}
                    <CreateUserRoleDialog
                      userId={internalUser.id}
                      onRoleAdded={handleRoleAdded}
                    />
                  </FormLabel>
                  <FormControl>
                    <div className="max-h-60 overflow-auto">
                      <Table
                        className=""
                        aria-label={`User roles management table with ${fields.length} roles`}
                      >
                        <caption className="sr-only">
                          User roles management table showing roles and
                          available actions. Use arrow keys to navigate.
                        </caption>
                        <TableHeader>
                          <TableRow>
                            <TableHead scope="col">Role</TableHead>
                            <TableHead scope="col">Workspace</TableHead>
                            <TableHead scope="col">Workbench</TableHead>
                            <TableHead scope="col">User</TableHead>
                            <TableHead scope="col">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fields.map((r, i) => (
                            <TableRow key={r.id} className="border-muted/50">
                              <TableCell className="p-2">
                                <Badge key={`role-badge-${r.name}-${i}`}>
                                  {r.name}
                                </Badge>
                              </TableCell>
                              <TableCell className="p-2">
                                {r.context?.workspace ? (
                                  <Badge
                                    className="bg-red-400"
                                    key={`role-badge-${r.name}-${i}`}
                                  >
                                    {r.context?.workspace}
                                  </Badge>
                                ) : null}
                              </TableCell>
                              <TableCell className="p-2">
                                {r.context?.workbench ? (
                                  <Badge
                                    className="bg-orange-400"
                                    key={`role-badge-${r.name}-${i}`}
                                  >
                                    {r.context?.workbench}
                                  </Badge>
                                ) : null}
                              </TableCell>
                              <TableCell className="p-2">
                                {r.context?.user ? (
                                  <Badge
                                    className="bg-yellow-400"
                                    key={`role-badge-${r.name}-${i}`}
                                  >
                                    {r.context?.user}
                                  </Badge>
                                ) : null}
                              </TableCell>
                              <TableCell className="p-2">
                                <Button
                                  variant="ghost"
                                  aria-label="Delete role"
                                  onClick={() => remove(i)}
                                >
                                  <Trash2
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
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
