'use client'

import { MonitorCog } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ThemeMode, ThemeModeSchema } from '@/domain/model/instance-config'
import { useInstanceDefaultThemeMode } from '@/hooks/use-instance-config'
import { useDevStoreCache } from '@/stores/dev-store-cache'

import { toast } from '../hooks/use-toast'

type DefaultThemeModeFormValues = { defaultThemeMode: ThemeMode }

const THEME_MODE_OPTIONS: {
  value: 'light' | 'dark' | 'system'
  label: string
}[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' }
]

export function DefaultThemeModeForm() {
  const defaultThemeMode = useInstanceDefaultThemeMode()

  const form = useForm<DefaultThemeModeFormValues>({
    defaultValues: { defaultThemeMode }
  })

  const isInitializedRef = useRef(false)

  // Update form when the setting changes (e.g., after save),
  // but not while the user is actively editing
  useEffect(() => {
    if (!isInitializedRef.current || !form.formState.isDirty) {
      form.reset({ defaultThemeMode })
      isInitializedRef.current = true
    }
  }, [defaultThemeMode, form])

  async function handleChange(value: string) {
    const validated = ThemeModeSchema.safeParse(value)
    if (!validated.success) return

    form.setValue('defaultThemeMode', validated.data, { shouldDirty: true })

    try {
      const { setInstanceDefaultThemeMode } = useDevStoreCache.getState()
      const success = await setInstanceDefaultThemeMode(validated.data)

      if (success) {
        form.reset({ defaultThemeMode: validated.data })
        toast({
          title: 'Default theme mode updated successfully!'
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MonitorCog className="h-5 w-5" />
          Default Theme Mode
        </CardTitle>
        <CardDescription>
          The theme mode shown to visitors who haven&apos;t chosen a theme of
          their own yet. Users who already picked light or dark keep their own
          choice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="max-w-xs space-y-2">
            <FormField
              control={form.control}
              name="defaultThemeMode"
              render={({ field }) => (
                <FormControl>
                  <Select value={field.value} onValueChange={handleChange}>
                    <SelectTrigger id="default-theme-mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {THEME_MODE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
