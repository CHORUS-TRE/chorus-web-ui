'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import { useActionState } from 'react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ControllerRenderProps } from 'react-hook-form'
import { object, z } from 'zod'

import { updateUser } from '@/view-model/user-view-model'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
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
// import { MultiSelect } from '~/components/ui/multi-select'
import { MockRoleDataSource } from '~/data/data-source/chorus-api/role-data-source'
import { RoleRepositoryImpl } from '~/data/repository/role-repository-impl'
import { Result, Role } from '~/domain/model'
import {
  User,
  UserUpdateSchema as BaseUserUpdateSchema
} from '~/domain/model/user'
import { RoleListUseCase } from '~/domain/use-cases/role/role-list'

import { toast } from '../hooks/use-toast'

const UserUpdateSchema = BaseUserUpdateSchema.extend({
  // roles: z.array(z.string()).optional()
  roles: z
    .array(
      z.object({
        name: z.string(),
        attributes: z.record(z.string()).optional()
      })
    )
    .optional()
})

type FormData = z.infer<typeof UserUpdateSchema>

export function UserEditDialog({
  user,
  onUserUpdated
}: {
  user: User
  onUserUpdated: () => void
}) {
  const [open, setOpen] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    const fetchRoles = async () => {
      const dataSource = new MockRoleDataSource()
      const repo = new RoleRepositoryImpl(dataSource)
      const useCase = new RoleListUseCase(repo)
      const result = await useCase.execute()

      console.log('roleListUseCase roles', result.data)

      if (result.data) {
        setRoles(result.data)
      }
    }

    fetchRoles()
  }, [])

  type UserEditValues = {
    id: string
    firstName: string
    lastName: string
    username: string
    password: string
    roles?: { name: string; attributes?: Record<string, string> }[]
  }

  const form = useForm<FormData>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      password: '',
      roles:
        user.roles2?.map((r) => ({
          name: r.name,
          attributes: r.attributes
        })) || []
    }
  })

  const [state, formAction] = useActionState(updateUser, {} as Result<User>)

  useEffect(() => {
    if (state.error) {
      toast({
        title: 'Error updating user',
        description: state.error,
        variant: 'destructive'
      })
    } else if (state.data) {
      toast({
        title: 'Success',
        description: 'User updated successfully.'
      })
      onUserUpdated()
      setOpen(false)
    }
  }, [state, onUserUpdated])

  const onSubmit = (data: FormData) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, JSON.stringify(v)))
      } else {
        formData.append(key, value || '')
      }
    })
    formAction(formData)
  }

  const removeRoleWithIndex = (
    field: ControllerRenderProps<UserEditValues, 'roles'>,
    index: number
  ) => {
    return () => {
      const newRoles = field.value ? [...field.value] : []
      newRoles.splice(index, 1)
      field.onChange(newRoles)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Edit user ${user.firstName} ${user.lastName}`}
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Edit user</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="text-white">
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
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <FormControl>
                    <Table
                      className="text-white"
                      aria-label={`User roles management table with ${field?.value?.length} roles`}
                    >
                      <caption className="sr-only">
                        User roles management table showing roles and available
                        actions. Use arrow keys to navigate.
                      </caption>
                      <div className="max-h-60 overflow-auto">
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
                          {field.value?.map((r, i) => (
                            <TableRow
                              key={`role-row-${r.name}-${i}`}
                              className="border-muted/50"
                            >
                              <TableCell className="p-2">
                                <Badge key={`role-badge-${r.name}-${i}`}>
                                  {r.name}
                                </Badge>
                              </TableCell>
                              <TableCell className="p-2">
                                {r.attributes?.workspace ? (
                                  <Badge
                                    className="bg-red-400"
                                    key={`role-badge-${r.name}-${i}`}
                                  >
                                    {r.attributes?.workspace}
                                  </Badge>
                                ) : null}
                              </TableCell>
                              <TableCell className="p-2">
                                {r.attributes?.workbench ? (
                                  <Badge
                                    className="bg-orange-400"
                                    key={`role-badge-${r.name}-${i}`}
                                  >
                                    {r.attributes?.workbench}
                                  </Badge>
                                ) : null}
                              </TableCell>
                              <TableCell className="p-2">
                                {r.attributes?.user ? (
                                  <Badge
                                    className="bg-yellow-400"
                                    key={`role-badge-${r.name}-${i}`}
                                  >
                                    {r.attributes?.user}
                                  </Badge>
                                ) : null}
                              </TableCell>
                              <TableCell className="p-2">
                                {/* <span onClick={removeRoleWithIndex(field, i)}>x</span> */}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label="Delete user"
                                  onClick={removeRoleWithIndex(field, i)}
                                >
                                  <Trash2
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                  <span className="sr-only">Delete user</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </div>
                    </Table>
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
