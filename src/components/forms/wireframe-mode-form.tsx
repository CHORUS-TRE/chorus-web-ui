'use client'

import { Frame } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Form, FormControl, FormField } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { useInstanceWireframeMode } from '@/hooks/use-instance-config'
import { useDevStoreCache } from '@/stores/dev-store-cache'

import { toast } from '../hooks/use-toast'

type WireframeModeFormValues = { wireframeModeEnabled: boolean }

export function WireframeModeForm() {
  const wireframeModeEnabled = useInstanceWireframeMode()

  const form = useForm<WireframeModeFormValues>({
    defaultValues: { wireframeModeEnabled }
  })

  const isInitializedRef = useRef(false)

  // Update form when the setting changes (e.g., after save),
  // but not while the user is actively editing
  useEffect(() => {
    if (!isInitializedRef.current || !form.formState.isDirty) {
      form.reset({ wireframeModeEnabled })
      isInitializedRef.current = true
    }
  }, [wireframeModeEnabled, form])

  async function handleChange(checked: boolean) {
    form.setValue('wireframeModeEnabled', checked, { shouldDirty: true })

    try {
      const { setWireframeModeEnabled } = useDevStoreCache.getState()
      const success = await setWireframeModeEnabled(checked)

      if (success) {
        form.reset({ wireframeModeEnabled: checked })
        toast({
          title: 'Wireframe mode updated successfully!'
        })
      } else {
        form.reset({ wireframeModeEnabled })
        toast({
          title: 'An error occurred.',
          description: 'Please try again.',
          variant: 'destructive'
        })
      }
    } catch {
      form.reset({ wireframeModeEnabled })
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
          <Frame className="h-5 w-5" />
          Wireframe Mode
        </CardTitle>
        <CardDescription>
          Globally enable or disable wireframe styling for elements marked with
          data-fidelity=&quot;wireframe&quot; in code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="max-w-xs">
            <FormField
              control={form.control}
              name="wireframeModeEnabled"
              render={({ field }) => (
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="wireframe-mode-enabled"
                      checked={field.value}
                      onCheckedChange={handleChange}
                    />
                    <label
                      htmlFor="wireframe-mode-enabled"
                      className="text-sm text-muted-foreground"
                    >
                      {field.value ? 'Enabled' : 'Disabled'}
                    </label>
                  </div>
                </FormControl>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
