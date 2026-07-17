import {
  ApprovalRequest,
  ApprovalRequestFile,
  ApprovalRequestType,
  ApprovalStepDecision
} from '@/domain/model/approval-request'
import { downloadApprovalRequestFile } from '@/view-model/approval-request-view-model'

// The backend defaults to a page of 20 when no limit is given. Views that
// list "all requests for this workspace/tenant" without their own pagination
// controls pass this explicit limit instead, so they don't silently show a
// truncated set. Not a substitute for real pagination if a workspace/tenant
// ever exceeds it.
export const APPROVAL_REQUESTS_FETCH_LIMIT = 100

export function getSourceWorkspaceId(
  request: ApprovalRequest
): string | undefined {
  return (
    request.dataExtraction?.sourceWorkspaceId ||
    request.dataTransfer?.sourceWorkspaceId
  )
}

export function getDestinationWorkspaceId(
  request: ApprovalRequest
): string | undefined {
  return request.dataTransfer?.destinationWorkspaceId
}

// "download" = data leaving the source workspace; "upload" = data entering
// the destination workspace. An extraction only ever needs the download step;
// a transfer needs both.
export type ApprovalStep = 'download' | 'upload'

export function getRequiredSteps(request: ApprovalRequest): ApprovalStep[] {
  return request.type === ApprovalRequestType.DATA_TRANSFER
    ? ['download', 'upload']
    : ['download']
}

export function getStepApproverIds(
  request: ApprovalRequest,
  step: ApprovalStep
): string[] {
  return request.approverIdsByStep?.[step]?.ids ?? []
}

export function getStepDecision(
  request: ApprovalRequest,
  step: ApprovalStep
): ApprovalStepDecision | undefined {
  return request.stepDecisions?.[step]
}

export function isStepDecided(
  request: ApprovalRequest,
  step: ApprovalStep
): boolean {
  return Boolean(getStepDecision(request, step)?.approvedAt)
}

/**
 * Whether `userId` may approve/reject a specific step: they're listed as an
 * approver for that step, and the step has no decision recorded yet.
 */
export function canActOnStep(
  userId: string | undefined,
  request: ApprovalRequest,
  step: ApprovalStep
): boolean {
  if (!userId) return false
  return (
    getStepApproverIds(request, step).includes(userId) &&
    !isStepDecided(request, step)
  )
}

/**
 * Whether `userId` may approve/reject the request at all: an approver on any
 * of its required steps that still needs a decision.
 */
export function canApproveRequest(
  userId: string | undefined,
  request: ApprovalRequest
): boolean {
  return getRequiredSteps(request).some((step) =>
    canActOnStep(userId, request, step)
  )
}

/**
 * Which workspace `userId` should land in when viewing this request: the
 * source workspace if they're the pending "download" (release) approver, the
 * destination workspace if they're the pending "upload" (receive) approver,
 * otherwise the source workspace as a default.
 */
export function getApprovalRequestWorkspaceId(
  userId: string | undefined,
  request: ApprovalRequest
): string | undefined {
  if (canActOnStep(userId, request, 'download')) {
    return getSourceWorkspaceId(request)
  }
  if (canActOnStep(userId, request, 'upload')) {
    return getDestinationWorkspaceId(request)
  }
  return getSourceWorkspaceId(request)
}

export function formatBytes(bytesStr?: string): string {
  const bytes = parseInt(bytesStr || '0')
  if (bytes === 0) return '—'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(1) + '\u202f' + sizes[i]
}

export function getFiles(req: ApprovalRequest): ApprovalRequestFile[] {
  return req.dataExtraction?.files || req.dataTransfer?.files || []
}

export function getTotalSize(req: ApprovalRequest): number {
  return getFiles(req).reduce((acc, f) => acc + parseInt(f.size || '0'), 0)
}

export async function downloadRequestFiles(
  requestId: string,
  files: ApprovalRequestFile[],
  onError?: (fileName: string, error: unknown) => void
): Promise<void> {
  for (const file of files) {
    const filePath = file.sourcePath
    if (!filePath) continue
    try {
      const result = await downloadApprovalRequestFile(requestId, filePath)
      if (result.data) {
        const byteChars = atob(result.data.content)
        const byteArray = new Uint8Array(byteChars.length)
        for (let i = 0; i < byteChars.length; i++) {
          byteArray[i] = byteChars.charCodeAt(i)
        }
        const blob = new Blob([byteArray], { type: 'application/octet-stream' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download =
          result.data.fileName || filePath.split('/').pop() || 'download'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else {
        onError?.(filePath.split('/').pop() ?? filePath, result.error)
      }
    } catch (err) {
      onError?.(filePath.split('/').pop() ?? filePath, err)
    }
  }
}
