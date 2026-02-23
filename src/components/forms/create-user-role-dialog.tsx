'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '~/components/button'
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
import { getAllRoles } from '~/config/permissions'
import { Result } from '~/domain/model'
import { Role, User } from '~/domain/model/user'
import { createUserRole } from '~/view-model/user-view-model'

import { toast } from '../hooks/use-toast'

const CreateUserRoleSchema = z.object({
  roleName: z.string().min(1, 'Select a role'),
  workspace: z.string().optional(),
  workbench: z.string().optional(),
  user: z.string().optional()
})

type FormData = z.infer<typeof CreateUserRoleSchema>

export function CreateUserRoleDialog({
  userId,
  onRoleAdded
}: {
  userId: string
  onRoleAdded: (user: User) => void
}) {
  const [open, setOpen] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const form = useForm<FormData>({
    resolver: zodResolver(CreateUserRoleSchema),
    defaultValues: {
      roleName: '',
      workspace: '',
      workbench: '',
      user: ''
    }
  })

  const [state, formAction] = useActionState(createUserRole, {} as Result<User>)

  useEffect(() => {
    // Load roles from schema definition
    const schemaRoles = getAllRoles()
    setRoles(schemaRoles)
  }, [])

  useEffect(() => {
    if (state.data) {
      onRoleAdded(state.data)
      setOpen(false)
      form.reset()
    } else if (state.error || state.issues) {
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
          title: 'Failed to create role',
          description: state.error,
          variant: 'destructive'
        })
      }
    }
  }, [state, onRoleAdded, form, setOpen])

  const roleOptions = useMemo(
    () => roles.map((r) => ({ id: r.id ?? r.name, label: r.name })),
    [roles]
  )

  const onSubmit = (data: FormData) => {
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('roleName', data.roleName)
    if (data.workspace) {
      formData.append('workspace', data.workspace)
    }
    if (data.workbench) {
      formData.append('workbench', data.workbench)
    }
    if (data.user) {
      formData.append('user', data.user)
    }
    // NOTE: user context is not sent as it's not part of the create schema
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="w-32 justify-start">
        <Button type="button" variant="accent-filled" aria-label="Add role">
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="">Add role</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Create User Role</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation()
              form.handleSubmit(onSubmit)(e)
            }}
            className="space-y-4"
          >
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
                    <FormLabel>Session Context</FormLabel>
                    <FormControl>
                      <Input placeholder="session id or slug" {...field} />
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
              <Button type="submit">Add Role</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
