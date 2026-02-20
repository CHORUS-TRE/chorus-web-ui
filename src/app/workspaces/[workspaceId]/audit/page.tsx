'use client'

import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import AuditTable from '@/components/audit-table'
import { AuditEntry } from '@/domain/model'
import { workspaceAuditList } from '~/view-model/workspace-view-model'

export default function WorkspaceAuditPage() {
  const params = useParams<{ workspaceId: string }>()
  const [entries, setEntries] = useState<AuditEntry[] | undefined>(undefined)

  const loadAudit = useCallback(async () => {
    if (!params?.workspaceId) return
    const result = await workspaceAuditList(params.workspaceId)
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
