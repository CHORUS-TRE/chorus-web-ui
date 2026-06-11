'use client'

import { ScrollText } from 'lucide-react'

import { TermsOfUseAdmin } from './terms-of-use-admin'

export default function TermsOfUsePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-2 flex items-center gap-3 text-3xl font-semibold text-muted-foreground">
        <ScrollText className="h-9 w-9" />
        Terms of Use
      </h1>
      <p className="mb-8 text-muted-foreground">
        Manage platform Terms of Use versions and review user acceptance records.
      </p>
      <TermsOfUseAdmin />
    </div>
  )
}
