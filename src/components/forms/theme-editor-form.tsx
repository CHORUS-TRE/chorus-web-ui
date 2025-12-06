'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Color from 'color'
import { Paintbrush } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useInstanceTheme } from '@/hooks/use-instance-theme'
import { Button } from '~/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/card'
import { Form, FormField, FormLabel } from '~/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '~/components/ui/popover'
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput
} from '~/components/ui/shadcn-io/color-picker'
import { useDevStoreCache } from '~/stores/dev-store-cache'

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
  const instanceTheme = useInstanceTheme()

  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeFormSchema),
    defaultValues: {
      light_primary: instanceTheme.light.primary,
      light_secondary: instanceTheme.light.secondary,
      light_accent: instanceTheme.light.accent,
      dark_primary: instanceTheme.dark.primary,
      dark_secondary: instanceTheme.dark.secondary,
      dark_accent: instanceTheme.dark.accent
    }
  })

  useEffect(() => {
    form.reset({
      light_primary: instanceTheme.light.primary,
      light_secondary: instanceTheme.light.secondary,
      light_accent: instanceTheme.light.accent,
      dark_primary: instanceTheme.dark.primary,
      dark_secondary: instanceTheme.dark.secondary,
      dark_accent: instanceTheme.dark.accent
    })
  }, [instanceTheme, form])

  async function handleReset() {
    try {
      const { setInstanceTheme } = useDevStoreCache.getState()
      const success = await setInstanceTheme(null)

      if (success) {
        toast({
          title: 'Theme reset successfully!'
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

      const { setInstanceTheme } = useDevStoreCache.getState()
      const success = await setInstanceTheme(newTheme)

      if (success) {
        toast({
          title: 'Theme updated successfully!'
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

  const renderColorRow = (name: keyof ThemeFormValues, label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const colorValue = field.value
        let hslValue = ''
        try {
          hslValue = Color(colorValue).hsl().round().string()
        } catch {
          hslValue = 'Invalid Color'
        }

        return (
          <div className="grid grid-cols-[1fr_auto_auto_1fr_1fr] items-center gap-4">
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="icon">
                  <Paintbrush className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <ColorPicker
                  className="max-w-sm rounded-md border bg-background p-4 shadow-sm"
                  defaultValue={colorValue}
                  onChange={(color) => {
                    const c = Color.rgb(color[0], color[1], color[2]).alpha(
                      color[3]
                    )
                    field.onChange(c.alpha() < 1 ? c.hexa() : c.hex())
                  }}
                >
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
              </PopoverContent>
            </Popover>
            <div
              className="h-6 w-6 rounded-full border"
              style={{ backgroundColor: colorValue }}
            />
            <code className="text-sm">{hslValue}</code>
            <code className="text-sm">{colorValue}</code>
          </div>
        )
      }}
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
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Light Theme</h3>
                {renderColorRow('light_primary', 'Primary Color')}
                {renderColorRow('light_secondary', 'Secondary Color')}
                {renderColorRow('light_accent', 'Accent Color')}
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dark Theme</h3>
                {renderColorRow('dark_primary', 'Primary Color')}
                {renderColorRow('dark_secondary', 'Secondary Color')}
                {renderColorRow('dark_accent', 'Accent Color')}
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
