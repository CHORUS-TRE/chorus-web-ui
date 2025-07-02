'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useActionState } from 'react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { createUser } from '~/components/actions/user-view-model'
import { useAppState } from '~/components/store/app-state-context'
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
import { MultiSelect } from '~/components/ui/multi-select'
import { MockRoleDataSource } from '~/data/data-source/chorus-api/role-data-source'
import { RoleRepositoryImpl } from '~/data/repository/role-repository-impl'
import { Result, Role } from '~/domain/model'
import {
  User,
  UserEditFormSchema as BaseUserEditFormSchema
} from '~/domain/model/user'
import { RoleListUseCase } from '~/domain/use-cases/role/role-list'

import { toast } from '../hooks/use-toast'

const UserEditFormSchema = BaseUserEditFormSchema.extend({
  roles: z.array(z.string()).optional()
})

type FormData = z.infer<typeof UserEditFormSchema>

export function UserCreateDialog({
  onUserCreated
}: {
  onUserCreated: () => void
}) {
  const [open, setOpen] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    const fetchRoles = async () => {
      const dataSource = new MockRoleDataSource()
      const repo = new RoleRepositoryImpl(dataSource)
      const useCase = new RoleListUseCase(repo)
      const result = await useCase.execute()

      if (result.data) {
        setRoles(result.data)
      }
    }

    if (open) {
      fetchRoles()
    }
  }, [open])

  const form = useForm<FormData>({
    resolver: zodResolver(UserEditFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      roles: []
    }
  })

  const [state, formAction] = useActionState(createUser, {} as Result<User>)

  useEffect(() => {
    if (state.error) {
      toast({
        title: 'Error creating user',
        description: state.error,
        variant: 'destructive'
      })
    } else if (state.data) {
      toast({
        title: 'Success',
        description: 'User created successfully.'
      })

      onUserCreated()
      setOpen(false)
      form.reset()
    }
  }, [state, onUserCreated, form])

  const onSubmit = (data: FormData) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v))
      } else {
        formData.append(key, value)
      }
    })
    formAction(formData)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-transparent text-accent ring-1 ring-accent hover:bg-accent-background hover:text-black focus:bg-accent-background">
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="text-white">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Input type="password" {...field} />
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
                    <MultiSelect
                      options={roles.map((r) => ({
                        value: r.name,
                        label: r.name
                      }))}
                      selected={field.value || []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-transparent text-accent ring-1 ring-accent hover:bg-accent-background hover:text-black focus:bg-accent-background"
            >
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
