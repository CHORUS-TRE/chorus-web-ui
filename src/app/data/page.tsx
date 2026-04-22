'use client'

import { Database } from 'lucide-react'

export default function DataPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-muted/40 p-8 text-center text-muted-foreground">
      <Database className="h-10 w-10 opacity-40" />
      <div>
        <p className="text-sm font-medium">No workspace selected</p>
        <p className="mt-1 text-xs">
          Select a workspace from the sidebar to view its data.
        </p>
      </div>
    </div>
  )
}
