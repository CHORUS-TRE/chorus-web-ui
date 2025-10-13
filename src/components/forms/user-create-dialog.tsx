'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useActionState } from 'react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { createUser } from '@/view-model/user-view-model'
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
import { Result } from '~/domain/model'
import {
  User,
  UserEditFormSchema as BaseUserEditFormSchema
} from '~/domain/model/user'

import { toast } from '../hooks/use-toast'

const UserEditFormSchema = BaseUserEditFormSchema.extend({
  rolesWithContext: z
    .array(
      z.object({
        name: z.string(),
        context: z.record(z.string())
      })
    )
    .optional()
})

type FormData = z.infer<typeof UserEditFormSchema>

export function UserCreateDialog({
  onUserCreated
}: {
  onUserCreated: () => void
}) {
  const [open, setOpen] = useState(false)

  // Define available roles with context - this should eventually come from a service
  const availableRoles = [
    { name: 'admin', label: 'Administrator' },
    { name: 'user', label: 'User' },
    { name: 'researcher', label: 'Researcher' },
    { name: 'workspace-manager', label: 'Workspace Manager' }
  ]

  const form = useForm<FormData>({
    resolver: zodResolver(UserEditFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      rolesWithContext: []
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
      if (key === 'rolesWithContext' && Array.isArray(value)) {
        // Serialize rolesWithContext array
        formData.append(key, JSON.stringify(value))
      } else if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, String(v)))
      } else {
        formData.append(key, String(value))
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
              name="rolesWithContext"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={availableRoles.map((r) => ({
                        value: r.name,
                        label: r.label
                      }))}
                      selected={(field.value || []).map((role) => role.name)}
                      onChange={(selectedRoles) => {
                        const roleNames =
                          typeof selectedRoles === 'function'
                            ? selectedRoles(
                                (field.value || []).map((role) => role.name)
                              )
                            : selectedRoles
                        const rolesWithContext = roleNames.map(
                          (roleName: string) => ({
                            name: roleName,
                            context: {} as Record<string, string> // Default empty context, can be configured later
                          })
                        )
                        field.onChange(rolesWithContext)
                      }}
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
