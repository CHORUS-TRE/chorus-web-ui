import {
  ApprovalRequest,
  ApprovalRequestFile
} from '@/domain/model/approval-request'
import { Role } from '@/domain/model/user'
import { downloadApprovalRequestFile } from '@/view-model/approval-request-view-model'

const APPROVER_ROLES = ['WorkspaceDataManager', 'SuperAdmin']

export function getSourceWorkspaceId(
  request: ApprovalRequest
): string | undefined {
  return (
    request.dataExtraction?.sourceWorkspaceId ||
    request.dataTransfer?.sourceWorkspaceId
  )
}

export function canApproveRequest(
  userRoles: Role[] | undefined,
  request: ApprovalRequest
): boolean {
  if (!userRoles || userRoles.length === 0) return false

  const sourceWorkspaceId = getSourceWorkspaceId(request)

  return userRoles.some((role) => {
    if (!APPROVER_ROLES.includes(role.name)) return false
    // SuperAdmin with wildcard context can approve anything
    if (role.context.workspace === '*') return true
    // WorkspaceAdmin must match the request's source workspace
    if (sourceWorkspaceId && role.context.workspace === sourceWorkspaceId)
      return true
    return false
  })
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
