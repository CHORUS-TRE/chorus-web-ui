'use client'

import { useCallback, useState } from 'react'

import { UploadComplianceDialog } from '@/components/upload-compliance/upload-compliance-dialog'
import { serializeUploadComplianceStatement } from '@/domain/model/upload-compliance'

type ConfirmedUpload = (complianceMessage: string) => void | Promise<void>

interface PendingUpload {
  fileNames: string[]
  upload: ConfirmedUpload
}

export function useUploadComplianceGate() {
  const [pendingUpload, setPendingUpload] = useState<PendingUpload | null>(null)

  const requestUpload = useCallback(
    (fileNames: string[], upload: ConfirmedUpload) => {
      if (fileNames.length === 0) return
      setPendingUpload({ fileNames, upload })
    },
    []
  )

  const cancelUpload = useCallback(() => setPendingUpload(null), [])

  const confirmUpload = useCallback(() => {
    if (!pendingUpload) return
    const upload = pendingUpload.upload
    setPendingUpload(null)
    void upload(serializeUploadComplianceStatement())
  }, [pendingUpload])

  const complianceDialog = (
    <UploadComplianceDialog
      open={pendingUpload !== null}
      fileNames={pendingUpload?.fileNames ?? []}
      onCancel={cancelUpload}
      onConfirm={confirmUpload}
    />
  )

  return { requestUpload, complianceDialog }
}
