'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '~/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection
} from '~/components/ui/shadcn-io/color-picker'
import { useAppState } from '~/providers/app-state-provider'
import {
  deleteGlobalEntry,
  putGlobalEntry
} from '~/view-model/dev-store-view-model'

import { toast } from '../hooks/use-toast'

const themeFormSchema = z.object({
  light_primary: z.string(),
  light_secondary: z.string(),
  light_accent: z.string(),
  dark_primary: z.string(),
  dark_secondary: z.string(),
  dark_accent: z.string()
})

type ThemeFormValues = z.infer<typeof themeFormSchema>

export function ThemeEditorForm() {
  const { customTheme, refreshCustomTheme } = useAppState()

  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeFormSchema),
    defaultValues: {
      light_primary: customTheme.light.primary || '#1340FF',
      light_secondary: customTheme.light.secondary || '#ABA5F5',
      light_accent: customTheme.light.accent || '#B6FF12',
      dark_primary: customTheme.dark.primary || '#1340FF',
      dark_secondary: customTheme.dark.secondary || '#ABA5F5',
      dark_accent: customTheme.dark.accent || '#B6FF12'
    }
  })

  useEffect(() => {
    form.reset({
      light_primary: customTheme.light.primary || '#1340FF',
      light_secondary: customTheme.light.secondary || '#ABA5F5',
      light_accent: customTheme.light.accent || '#B6FF12',
      dark_primary: customTheme.dark.primary || '#1340FF',
      dark_secondary: customTheme.dark.secondary || '#ABA5F5',
      dark_accent: customTheme.dark.accent || '#B6FF12'
    })
  }, [customTheme, form])

  async function handleReset() {
    try {
      await deleteGlobalEntry('custom_theme')

      await refreshCustomTheme()

      toast({
        title: 'Theme reset successfully!'
      })
    } catch (error) {
      toast({
        title: 'An error occurred.',
        description: 'Please try again.',
        variant: 'destructive'
      })
    }
  }

  async function onSubmit(data: ThemeFormValues) {
    try {
      const newTheme = {
        light: {
          primary: data.light_primary,
          secondary: data.light_secondary,
          accent: data.light_accent
        },
        dark: {
          primary: data.dark_primary,
          secondary: data.dark_secondary,
          accent: data.dark_accent
        }
      }

      await putGlobalEntry({
        key: 'custom_theme',
        value: JSON.stringify(newTheme)
      })

      await refreshCustomTheme()

      toast({
        title: 'Theme updated successfully!'
      })
    } catch (error) {
      toast({
        title: 'An error occurred.',
        description: 'Please try again.',
        variant: 'destructive'
      })
    }
  }

  const renderColorPicker = (name: keyof ThemeFormValues, label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <ColorPicker
              className="max-w-sm rounded-md border bg-background p-4 shadow-sm"
              defaultValue={field.value}
              onChange={(color) => {
                const hexColor = `rgba(${color.join(', ')})`
                field.onChange(hexColor)
              }}
            >
              <ColorPickerSelection />
              <div className="flex items-center gap-4">
                <ColorPickerEyeDropper />
                <div className="grid w-full gap-1">
                  <ColorPickerHue />
                  <ColorPickerAlpha />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ColorPickerOutput />
                <ColorPickerFormat />
              </div>
            </ColorPicker>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Colors</CardTitle>
        <CardDescription>
          Customize the primary, secondary, and accent colors for both light and
          dark themes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Light Theme</h3>
                {renderColorPicker('light_primary', 'Primary Color')}
                {renderColorPicker('light_secondary', 'Secondary Color')}
                {renderColorPicker('light_accent', 'Accent Color')}
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dark Theme</h3>
                {renderColorPicker('dark_primary', 'Primary Color')}
                {renderColorPicker('dark_secondary', 'Secondary Color')}
                {renderColorPicker('dark_accent', 'Accent Color')}
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Save Theme</Button>
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
