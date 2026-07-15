'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { PanelLeft } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Form, FormControl, FormField } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { useDisplayOrganizations } from '@/hooks/use-instance-config'
import { useDevStoreCache } from '@/stores/dev-store-cache'

import { toast } from '../hooks/use-toast'

const sidebarOptionsFormSchema = z.object({
  displayOrganizations: z.boolean()
})

type SidebarOptionsFormValues = z.infer<typeof sidebarOptionsFormSchema>

export function SidebarOptionsForm() {
  const displayOrganizations = useDisplayOrganizations()

  const form = useForm<SidebarOptionsFormValues>({
    resolver: zodResolver(sidebarOptionsFormSchema),
    defaultValues: {
      displayOrganizations
    }
  })

  const isInitializedRef = useRef(false)

  // Update form when the setting changes (e.g., after save),
  // but not while the user is actively editing
  useEffect(() => {
    if (!isInitializedRef.current || !form.formState.isDirty) {
      form.reset({ displayOrganizations })
      isInitializedRef.current = true
    }
  }, [displayOrganizations, form])

  async function onSubmit(data: SidebarOptionsFormValues) {
    try {
      const { setDisplayOrganizations } = useDevStoreCache.getState()
      const success = await setDisplayOrganizations(data.displayOrganizations)

      if (success) {
        toast({
          title: 'Sidebar options updated successfully!'
        })
      } else {
        toast({
          title: 'An error occurred.',
          description: 'Please try again.',
          variant: 'destructive'
        })
      }
    } catch {
      toast({
        title: 'An error occurred.',
        description: 'Please try again.',
        variant: 'destructive'
      })
    }
  }

  async function handleReset() {
    try {
      const { deleteGlobal } = useDevStoreCache.getState()
      await deleteGlobal('instance.displayOrganizations')

      toast({
        title: 'Sidebar options reset successfully!'
      })
    } catch {
      toast({
        title: 'An error occurred.',
        description: 'Please try again.',
        variant: 'destructive'
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PanelLeft className="h-5 w-5" />
          Sidebar Options
        </CardTitle>
        <CardDescription>
          Control which optional sections appear in the navigation sidebar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="font-medium">Display Organizations</div>
                <p className="text-sm text-muted-foreground">
                  Show the Organizations link in the sidebar navigation.
                </p>
              </div>
              <FormField
                control={form.control}
                name="displayOrganizations"
                render={({ field }) => (
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Save Sidebar Options</Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset to Default
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
