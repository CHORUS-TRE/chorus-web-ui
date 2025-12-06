'use client'

import React, { useEffect, useState } from 'react'

import { Button } from '~/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/card'
import { toast } from '~/components/hooks/use-toast'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useAppState } from '~/providers/app-state-provider'
import { useDevStoreCache } from '~/stores/dev-store-cache'

const LogoUploadForm = () => {
  const { customLogos, refreshCustomLogos } = useAppState()
  const [lightLogo, setLightLogo] = useState<string | null>(null)
  const [darkLogo, setDarkLogo] = useState<string | null>(null)

  useEffect(() => {
    setLightLogo(customLogos.light)
    setDarkLogo(customLogos.dark)
  }, [customLogos])

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setter(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    try {
      const { getInstanceLogo, setInstanceLogo } = useDevStoreCache.getState()

      // Read current logos from cache
      const currentLogos = getInstanceLogo() || { light: null, dark: null }

      const newLogos = { ...currentLogos }
      if (lightLogo) {
        newLogos.light = lightLogo
      }
      if (darkLogo) {
        newLogos.dark = darkLogo
      }

      const success = await setInstanceLogo(newLogos)

      if (success) {
        toast({
          title: 'Success!',
          description: 'Logos have been updated.',
          variant: 'default'
        })
        refreshCustomLogos()
      } else {
        toast({
          title: 'Error!',
          description: 'Could not save logos.',
          variant: 'destructive'
        })
      }
    } catch {
      toast({
        title: 'Error!',
        description: 'Could not save logos.',
        variant: 'destructive'
      })
    }
  }

  const handleReset = async () => {
    try {
      const { setInstanceLogo } = useDevStoreCache.getState()
      const success = await setInstanceLogo(null)

      if (success) {
        refreshCustomLogos()
        toast({
          title: 'Success!',
          description: 'Logos have been reset to default.',
          variant: 'default'
        })
      } else {
        toast({
          title: 'Error!',
          description: 'Could not reset logos.',
          variant: 'destructive'
        })
      }
    } catch {
      toast({
        title: 'Error!',
        description: 'Could not reset logos.',
        variant: 'destructive'
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Logo</CardTitle>
        <CardDescription>
          Upload new logos for the light and dark themes. The new logo will
          replace the default Chorus logo in the application header.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="light-logo-input">Light Theme Logo</Label>
          <Input
            id="light-logo-input"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setLightLogo)}
          />
          {lightLogo && (
            <img
              src={lightLogo}
              alt="Light logo preview"
              className="mt-2 h-10 w-auto rounded bg-gray-200 p-2"
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dark-logo-input">Dark Theme Logo</Label>
          <Input
            id="dark-logo-input"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setDarkLogo)}
          />
          {darkLogo && (
            <img
              src={darkLogo}
              alt="Dark logo preview"
              className="mt-2 h-10 w-auto rounded bg-gray-800 p-2"
            />
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSubmit}>Save Logos</Button>
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default LogoUploadForm
