export type DashboardFeedIcon =
  | 'workspace'
  | 'session'
  | 'data'
  | 'security'
  | 'system'

export interface DashboardFeedItem {
  id: string
  title: string
  description: string
  time: string
  icon: DashboardFeedIcon
}

export const dashboardNotifications: DashboardFeedItem[] = [
  {
    id: 'notif-1',
    title: 'Workspace backup scheduled',
    description:
      'Genomics Vault will switch to read-only mode on 22 Nov at 20:00 CET while a snapshot is captured.',
    time: '20 minutes ago',
    icon: 'system'
  },
  {
    id: 'notif-2',
    title: 'Transfer approval requested',
    description:
      'Cancer Imaging workspace submitted an export request for 12 encrypted files to Secure Gateway.',
    time: '1 hour ago',
    icon: 'data'
  },
  {
    id: 'notif-3',
    title: 'Security policy update',
    description:
      'Clipboard sharing is temporarily disabled for workspaces tagged “Clinical” while the review completes.',
    time: '3 hours ago',
    icon: 'security'
  },
  {
    id: 'notif-4',
    title: 'Session capacity reached',
    description:
      'AI Lab workspace is running 5/5 GPU sessions. Stop one before launching a new environment.',
    time: 'Today · 08:15',
    icon: 'session'
  },
  {
    id: 'notif-5',
    title: 'Workspace invite sent',
    description:
      'An invitation email was sent to dr.sanabria@chuv.ch to join Translational Research workspace.',
    time: 'Yesterday · 17:40',
    icon: 'workspace'
  }
]

export const dashboardActivities: DashboardFeedItem[] = [
  {
    id: 'activity-1',
    title: 'Pathology workspace provisioned',
    description:
      'Workspace PX-204 was created with secure storage and 4 collaborators assigned.',
    time: '15 minutes ago',
    icon: 'workspace'
  },
  {
    id: 'activity-2',
    title: 'Dr. Keller uploaded 34 GB',
    description:
      'New microscopy images were ingested into Secure Bucket for the Oncology Pilot workspace.',
    time: '1 hour ago',
    icon: 'data'
  },
  {
    id: 'activity-3',
    title: 'Notebook session resumed',
    description:
      'RStudio in Translational AI workspace resumed automatically after an idle pause.',
    time: 'Today · 06:20',
    icon: 'session'
  },
  {
    id: 'activity-4',
    title: 'Audit export generated',
    description:
      'Monthly audit trail for Oncology cluster is ready to download from Compliance Center.',
    time: 'Yesterday · 18:05',
    icon: 'system'
  },
  {
    id: 'activity-5',
    title: 'Access granted to Secure Imaging',
    description:
      'Dr. Jensen received contributor rights to Secure Imaging workspace after approver validation.',
    time: 'Yesterday · 09:12',
    icon: 'security'
  }
]
