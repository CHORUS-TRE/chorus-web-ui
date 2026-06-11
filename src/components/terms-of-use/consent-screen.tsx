'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { TermsOfUseVersion } from '@/domain/model/terms-of-use'

interface ConsentScreenProps {
  version: TermsOfUseVersion
  onAccept: () => Promise<void>
}

export function ConsentScreen({ version, onAccept }: ConsentScreenProps) {
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAccept = async () => {
    setLoading(true)
    await onAccept()
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex h-[80vh] w-full max-w-2xl flex-col rounded-lg border bg-card p-8 shadow-lg">
        <h1 className="mb-4 text-2xl font-semibold">Terms of Use</h1>
        <ScrollArea className="mb-6 flex-1 rounded border p-4">
          <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap">
            {version.content}
          </pre>
        </ScrollArea>
        <div className="mb-6 flex items-start gap-3">
          <Checkbox
            id="tou-accept"
            checked={checked}
            onCheckedChange={(v) => setChecked(v === true)}
          />
          <label
            htmlFor="tou-accept"
            className="cursor-pointer text-sm leading-none"
          >
            I have read and accept the Terms of Use
          </label>
        </div>
        <Button
          onClick={handleAccept}
          disabled={!checked || loading}
          className="w-full"
        >
          {loading ? 'Accepting…' : 'Accept and Continue'}
        </Button>
      </div>
    </div>
  )
}
