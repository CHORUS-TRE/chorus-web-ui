'use client'

import { Palette } from 'lucide-react'
import React from 'react'

import LogoUploadForm from '~/components/forms/logo-upload-form'
import { ThemeEditorForm } from '~/components/forms/theme-editor-form'

const AdminPage = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <Palette className="h-9 w-9" />
            Branding & Theme
          </h2>
          <div className="">
            <p className="text-sm text-muted-foreground">
              Customize the look and feel of the application.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold">Logo</h3>
        <LogoUploadForm />
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold">Theme</h3>
        <ThemeEditorForm />
      </div>
    </div>
  )
}

export default AdminPage
