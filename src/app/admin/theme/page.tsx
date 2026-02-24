'use client'

import { Palette, ShieldAlert } from 'lucide-react'

import LogoUploadForm from '~/components/forms/logo-upload-form'
import { ThemeEditorForm } from '~/components/forms/theme-editor-form'

const ThemePage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="flex items-center gap-3 text-3xl font-semibold text-muted-foreground">
        <Palette className="h-9 w-9" />
        Branding & Theme
      </h1>
      <p className="mb-8 text-muted-foreground">
        Customize the look and feel of the application.
      </p>

      <h3 className="mb-4 text-lg font-semibold">Logo</h3>
      <LogoUploadForm />

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold">Theme</h3>
        <ThemeEditorForm />
      </div>
    </div>
  )
}

export default ThemePage
