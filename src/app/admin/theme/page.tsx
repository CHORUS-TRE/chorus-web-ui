'use client'

import { Palette, ShieldAlert } from 'lucide-react'

import LogoUploadForm from '~/components/forms/logo-upload-form'
import { ThemeEditorForm } from '~/components/forms/theme-editor-form'
import { useAuthorizationViewModel } from '~/view-model/authorization-view-model'

const ThemePage = () => {
  const { canManageSettings } = useAuthorizationViewModel()

  if (!canManageSettings) {
    return (
      <div className="flex h-full w-full items-center justify-center text-red-500">
        <ShieldAlert className="h-12 w-12" />
        <p className="ml-4 text-xl">
          You are not authorized to view this page.
        </p>
      </div>
    )
  }
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

export default ThemePage
