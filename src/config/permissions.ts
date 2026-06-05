export const WORKSPACE_PERMISSIONS_DISPLAY = [
  { label: 'List Files', key: 'listFilesInWorkspace' },
  { label: 'Upload Files', key: 'uploadFilesToWorkspace' },
  { label: 'Download Files', key: 'downloadFilesFromWorkspace' },
  { label: 'Modify Files', key: 'modifyFilesInWorkspace' },
  { label: 'Manage Members', key: 'manageUsersInWorkspace' },
  { label: 'Configure', key: 'updateWorkspace' },
  { label: 'Create Workbench', key: 'createWorkbench' },
  { label: 'Delete Workspace', key: 'deleteWorkspace' }
]

export type Permission = string

export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  WorkbenchViewer: 'Session Viewer',
  WorkbenchMember: 'Session Member',
  WorkbenchAdmin: 'Session Admin'
}
