'use client'

import { LayoutGrid } from 'lucide-react'

export default function AdminAppStorePage() {
  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
              <LayoutGrid className="h-9 w-9" />
              App Store Management
            </h2>
            <div className="">
              <p className="text-sm text-muted-foreground">
                Manage global application settings and available apps.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
          App Store management interface coming soon.
        </div>
      </div>
    </>
  )
}
