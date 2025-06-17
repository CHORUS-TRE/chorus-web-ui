'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useActionState } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { updateUser } from '~/components/actions/user-view-model';
import { useAppState } from '~/components/store/app-state-context';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Result } from '~/domain/model';
import { User,UserUpdateSchema } from '~/domain/model/user';

type FormData = z.infer<typeof UserUpdateSchema>;

export function UserEditDialog({ user, onUserUpdated }: { user: User, onUserUpdated: () => void }) {
  const [open, setOpen] = useState(false);

  const { setNotification } = useAppState();

  const form = useForm<FormData>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      password: '',
    },
  });

  const [state, formAction] = useActionState(updateUser, {} as Result<User>);

  useEffect(() => {
    if (state.error) {
      setNotification({ title: 'Error updating user', description: state.error, variant: 'destructive' });
    } else if (state.data) {
      setNotification({ title: 'Success', description: 'User updated successfully.' });
      onUserUpdated();
      setOpen(false);
    }
  }, [state, onUserUpdated]);

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value || '');
    });
    formAction(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
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
                    <Input type="password" {...field} placeholder="Leave blank to keep current password" />
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
  );
}
