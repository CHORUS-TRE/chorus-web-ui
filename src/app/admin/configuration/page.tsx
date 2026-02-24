'use client'

import { Settings2, ShieldAlert } from 'lucide-react'

import { InstanceConfigForm } from '~/components/forms/instance-config-form'

const ConfigurationPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="flex items-center gap-3 text-3xl font-semibold text-muted-foreground">
        <Settings2 className="h-9 w-9" />
        Instance Configuration
      </h1>
      <div>
        <p className="mb-8 text-muted-foreground">
          Configure the instance name, branding text.
        </p>
      </div>

      <div className="mt-8">
        <InstanceConfigForm />
      </div>
    </div>
  )
}

export default ConfigurationPage
