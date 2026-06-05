import { Shield } from 'lucide-react'
import React from 'react'

export default function AuthorizationLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="container mx-auto p-6">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-semibold text-muted-foreground">
          <Shield className="h-9 w-9" />
          Authorization
        </h1>
        <p className="mb-4 text-muted-foreground">
          Manage roles, and access control policies.
        </p>
      </div>

      {children}
    </div>
  )
}
