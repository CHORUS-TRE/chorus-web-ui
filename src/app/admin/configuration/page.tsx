'use client'

import { Settings2, ShieldAlert } from 'lucide-react'

import { InstanceConfigForm } from '~/components/forms/instance-config-form'

const ConfigurationPage = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <Settings2 className="h-9 w-9" />
            Instance Configuration
          </h2>
          <div>
            <p className="text-sm text-muted-foreground">
              Configure the instance name, branding text.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <InstanceConfigForm />
      </div>
    </div>
  )
}

export default ConfigurationPage
