'use client'

import React from 'react'

import LogoUploadForm from '~/components/forms/logo-upload-form'
import { ThemeEditorForm } from '~/components/forms/theme-editor-form'

const ThemePage = () => {
  return (
    <>
      <div className="w-full">
        <div className="mt-8">
          <LogoUploadForm />
        </div>
        <div className="mt-8">
          <ThemeEditorForm />
        </div>
      </div>
    </>
  )
}

export default ThemePage
