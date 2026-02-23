'use client'

import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import AuditTable from '@/components/audit-table'
import { AuditEntry } from '@/domain/model'
import { listWorkspace } from '~/view-model/audit-view-model'

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
    <div className="mt-6 w-full">
      <AuditTable
        entries={entries}
        title="Workspace Audit Log"
        description="Audit entries for this workspace."
      />
    </div>
  )
}
