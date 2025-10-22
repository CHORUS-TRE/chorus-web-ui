'use client'

import { Settings } from 'lucide-react'
import React from 'react'

const AdminDashboardPage = () => {
  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mb-2 flex w-full flex-row items-center gap-3 text-start">
              <Settings className="h-9 w-9" />
              Settings
            </h2>
            <div className="">
              <p className="text-sm text-muted-foreground">
                Welcome to the Chorus settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboardPage
