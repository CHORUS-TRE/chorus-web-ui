'use client'

import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import AuditTable from '@/components/audit-table'
import { AuditEntry } from '@/domain/model'
import { listWorkspace } from '@/view-model/audit-view-model'

export default function WorkspaceAuditPage() {
  const params = useParams<{ workspaceId: string }>()
  const [entries, setEntries] = useState<AuditEntry[] | undefined>(undefined)

  const loadAudit = useCallback(async () => {
    if (!params?.workspaceId) return
    const result = await listWorkspace(params.workspaceId)
    if (result.data) {
      setEntries(result.data)
    }
  }, [params?.workspaceId])

  useEffect(() => {
    loadAudit()
  }, [loadAudit])

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-muted-foreground">
            Audit
          </h1>
          <p className="text-muted-foreground">
            Detailed log of actions performed in this workspace.
          </p>
        </div>
      </div>

      <AuditTable
        entries={entries}
        title="Workspace Audit Log"
        description="Detailed list of all audit entries."
      />
    </div>
  )
}
