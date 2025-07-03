'use client'

import { Settings } from 'lucide-react'
import React from 'react'

const AdminDashboardPage = () => {
  return (
    <>
      <div className="w-full text-white">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mb-2 flex w-full flex-row items-center gap-3 text-start text-white">
              <Settings className="h-9 w-9 text-white" />
              Admin Settings
            </h2>
            <div className="">
              <p className="text-sm text-muted-foreground">
                Welcome to the Chorus administration panel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboardPage
