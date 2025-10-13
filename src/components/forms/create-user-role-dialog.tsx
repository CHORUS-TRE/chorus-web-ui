'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useActionState } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { createUserRole } from '@/view-model/user-view-model'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { UserApiDataSourceImpl } from '~/data/data-source/chorus-api/user-data-source'
// import { RoleListUseCase } from '~/domain/usecase/role/list-role-usecase'
import { UserRepositoryImpl } from '~/data/repository/user-repository-impl'
import { Result } from '~/domain/model'
import { Role, User } from '~/domain/model/user'

import { toast } from '../hooks/use-toast'

const CreateUserRoleSchema = z.object({
  userId: z.string().min(1),
  roleName: z.string().min(1, 'Select a role'),
  workspace: z.string().optional(),
  workbench: z.string().optional(),
  user: z.string().optional()
})

type FormData = z.infer<typeof CreateUserRoleSchema>

export function CreateUserRoleDialog({
  userId,
  onCreated
}: {
  userId: string
  onCreated?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const form = useForm<FormData>({
    resolver: zodResolver(CreateUserRoleSchema),
    defaultValues: {
      userId,
      roleName: '',
      workspace: '',
      workbench: '',
      user: ''
    }
  })

  const [state, formAction] = useActionState(createUserRole, {} as Result<User>)

  useEffect(() => {
    // const fetchRoles = async () => {
    //   const repo = new UserRepositoryImpl(new UserApiDataSourceImpl())
    //   const useCase = new RoleListUseCase(repo)
    //   const result = await useCase.execute()
    //   if (result.data) setRoles(result.data)
    //   if (result.error) {
    //     toast({ title: 'Error', description: result.error, variant: 'destructive' })
    //   }
    // }
    // fetchRoles()
  }, [])

  useEffect(() => {
    if (state.error) {
      toast({
        title: 'Error creating role',
        description: state.error,
        variant: 'destructive'
      })
    } else if (state.data !== undefined) {
      toast({
        title: 'Role added',
        description: 'User role created successfully.'
      })
      onCreated?.()
      setOpen(false)
      form.reset({
        userId,
        roleName: '',
        workspace: '',
        workbench: '',
        user: ''
      })
    }
  }, [state, onCreated, form, userId])

  const roleOptions = useMemo(
    () => roles.map((r) => ({ id: r.id ?? r.name, label: r.name })),
    [roles]
  )

  const onSubmit = (data: FormData) => {
    const fd = new FormData()
    fd.append('userId', data.userId)
    fd.append('roleName', data.roleName)
    fd.append('workspace', data.workspace || '')
    fd.append('workbench', data.workbench || '')
    fd.append('user', data.user || '')
    formAction(fd)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Add role">
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Add role</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="text-white">
        <DialogHeader>
          <DialogTitle>Create User Role</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...form.register('userId')} />
            <FormField
              control={form.control}
              name="roleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger aria-label="Select role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roleOptions.map((r) => (
                        <SelectItem key={r.id} value={r.label}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="workspace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Context</FormLabel>
                    <FormControl>
                      <Input placeholder="workspace id or slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workbench"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workbench Context</FormLabel>
                    <FormControl>
                      <Input placeholder="workbench id or slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Context</FormLabel>
                    <FormControl>
                      <Input placeholder="user id or username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
