'use client'

import { Settings2 } from 'lucide-react'

import { DefaultThemeModeForm } from '@/components/forms/default-theme-mode-form'
import { InstanceConfigForm } from '@/components/forms/instance-config-form'
import LogoUploadForm from '@/components/forms/logo-upload-form'
import { SidebarOptionsForm } from '@/components/forms/sidebar-options-form'
import { ThemeEditorForm } from '@/components/forms/theme-editor-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const ConfigurationPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="flex items-center gap-3 text-3xl font-semibold text-muted-foreground">
        <Settings2 className="h-9 w-9" />
        Instance Configuration
      </h1>
      <p className="mb-8 text-muted-foreground">
        Configure the instance name, branding, and appearance.
      </p>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <InstanceConfigForm />
        </TabsContent>

        <TabsContent value="appearance" className="mt-4 space-y-8">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Logo</h3>
            <LogoUploadForm />
          </div>

          <SidebarOptionsForm />

          <DefaultThemeModeForm />

          <div>
            <h3 className="mb-4 text-lg font-semibold">Theme</h3>
            <ThemeEditorForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ConfigurationPage
