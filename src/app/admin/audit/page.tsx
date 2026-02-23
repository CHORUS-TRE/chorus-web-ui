'use client'

import { ScrollText } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import AuditTable from '@/components/audit-table'
import { AuditEntry } from '@/domain/model'
import { listPlatform } from '~/view-model/audit-view-model'

export default function AdminAuditPage() {
  const [entries, setEntries] = useState<AuditEntry[] | undefined>(undefined)

  const loadAudit = useCallback(async () => {
    const result = await listPlatform()
    if (result.data) {
      setEntries(result.data)
    }
  }, [])

  useEffect(() => {
    loadAudit()
  }, [loadAudit])

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
              <ScrollText className="h-9 w-9" />
              Platform Audit
            </h2>
            <p className="text-sm text-muted-foreground">
              View platform-wide audit log entries.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full">
        <AuditTable
          entries={entries}
          title="Platform Audit Log"
          description="All audit entries across the platform."
        />
      </div>
    </>
  )
}
