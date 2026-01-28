/**
 * Workspace Dashboard Component
 *
 * Main dashboard interface for CHORUS TRE workspace management with data movement controls
 *
 * @accessibility
 * - Semantic HTML5 landmarks (nav, main, aside)
 * - ARIA tabs pattern for navigation
 * - Keyboard navigation (Arrow keys, Tab, Enter)
 * - Skip links for quick navigation
 * - Screen reader announcements for state changes
 *
 * @eco-design
 * - Lazy loading for heavy panels
 * - React.memo for expensive child components
 * - Code splitting by tab route
 */

'use client'

import {
  AlertCircle,
  Database,
  FileText,
  GitBranch,
  Network,
  Settings,
  Shield,
  Users
} from 'lucide-react'
import * as React from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import type {
  DashboardViewState,
  DataMovementRequest,
  EnhancedChorusWorkspace,
  WorkspaceMember
} from './types/enhanced-models'

// Lazy load heavy panels for performance
const DataMovementPanel = React.lazy(() => import('./panels/DataMovementPanel'))
const WorkspaceResourcesPanel = React.lazy(
  () => import('./panels/WorkspaceResourcesPanel')
)
const MembersRolesPanel = React.lazy(() => import('./panels/MembersRolesPanel'))
const ServicesPanel = React.lazy(() => import('./panels/ServicesPanel'))
const FilesPanel = React.lazy(() => import('./panels/FilesPanel'))

// ============================================================================
// Mock Data (Lab Experience)
// ============================================================================

const workspaceAdmin: WorkspaceMember = {
  id: 'member-admin-001',
  userId: 'user-admin-001',
  email: 'ana.admin@chorus.lab',
  name: 'Ana Administrator',
  role: 'workspace-admin',
  permissions: {
    listFiles: true,
    upload: true,
    download: true,
    modify: true,
    transfer: true,
    approve: true,
    manageMembers: true,
    configureServices: true
  },
  joinedAt: new Date('2024-06-01T08:30:00Z'),
  lastActive: new Date('2025-02-10T07:45:00Z')
}

const dataManager: WorkspaceMember = {
  id: 'member-data-manager-001',
  userId: 'user-data-manager-001',
  email: 'david.manager@chorus.lab',
  name: 'David Data Manager',
  role: 'data-manager',
  permissions: {
    listFiles: true,
    upload: true,
    download: true,
    modify: true,
    transfer: true,
    approve: false,
    manageMembers: false,
    configureServices: false
  },
  joinedAt: new Date('2024-07-15T10:15:00Z'),
  lastActive: new Date('2025-02-09T16:30:00Z')
}

const researcher: WorkspaceMember = {
  id: 'member-researcher-001',
  userId: 'user-researcher-001',
  email: 'riley.researcher@chorus.lab',
  name: 'Riley Researcher',
  role: 'researcher',
  permissions: {
    listFiles: true,
    upload: true,
    download: false,
    modify: false,
    transfer: false,
    approve: false,
    manageMembers: false,
    configureServices: false
  },
  joinedAt: new Date('2024-08-20T09:00:00Z'),
  lastActive: new Date('2025-02-08T15:20:00Z')
}

const mockPendingRequests: DataMovementRequest[] = [
  {
    id: 'dmr-001',
    type: 'download',
    status: 'pending',
    requestedBy: researcher,
    requestedAt: new Date('2025-02-08T14:05:00Z'),
    files: [
      {
        snapshotId: 'snap-raw-dataset',
        originalFileId: 'file-raw-dataset',
        path: '/data/raw_dataset.csv',
        name: 'raw_dataset.csv',
        size: 15728640,
        mimeType: 'text/csv',
        checksum:
          'd4c7b0cfa1a7f0c8a91234abcd5678901234567890abcdef1234567890abcd',
        createdAt: new Date('2025-02-08T14:02:00Z'),
        expiresAt: new Date('2025-02-15T14:02:00Z')
      }
    ],
    totalSize: 15728640,
    justification: 'Required for regulatory submission audit package.'
  },
  {
    id: 'dmr-002',
    type: 'transfer',
    status: 'approved',
    requestedBy: dataManager,
    requestedAt: new Date('2025-02-07T09:30:00Z'),
    files: [
      {
        snapshotId: 'snap-analysis',
        originalFileId: 'file-analysis-results',
        path: '/data/analysis_results.png',
        name: 'analysis_results.png',
        size: 2097152,
        mimeType: 'image/png',
        checksum:
          '1fed2c3b4a5678090ab1cd2ef34567890abcde1234567890abcdef1234567890',
        createdAt: new Date('2025-02-07T09:25:00Z'),
        expiresAt: new Date('2025-02-12T09:25:00Z')
      }
    ],
    totalSize: 2097152,
    justification: 'Share visual output with collaboration workspace.',
    reviewedBy: workspaceAdmin,
    reviewedAt: new Date('2025-02-07T10:00:00Z'),
    reviewNotes: 'Approved for internal transfer.',
    targetWorkspaceId: 'workspace-collaboration-01'
  }
]

const mockRequestHistory: DataMovementRequest[] = [
  {
    id: 'dmr-0001',
    type: 'transfer',
    status: 'downloaded',
    requestedBy: dataManager,
    requestedAt: new Date('2025-01-18T11:15:00Z'),
    files: [
      {
        snapshotId: 'snap-curated',
        originalFileId: 'file-curated-dataset',
        path: '/data/curated_dataset.parquet',
        name: 'curated_dataset.parquet',
        size: 104857600,
        mimeType: 'application/octet-stream',
        checksum:
          'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
        createdAt: new Date('2025-01-18T11:10:00Z'),
        expiresAt: new Date('2025-01-20T12:00:00Z')
      }
    ],
    totalSize: 104857600,
    justification:
      'Move curated data set to analytics workspace for model training.',
    reviewedBy: workspaceAdmin,
    reviewedAt: new Date('2025-01-18T12:00:00Z'),
    reviewNotes: 'Transfer completed via secure bridge.',
    downloadLink: 'https://download.chorus.lab/request/dmr-0001',
    downloadExpiresAt: new Date('2025-01-20T12:00:00Z'),
    downloadCount: 1,
    maxDownloads: 3,
    targetWorkspaceId: 'workspace-analytics-01'
  },
  {
    id: 'dmr-0002',
    type: 'download',
    status: 'rejected',
    requestedBy: researcher,
    requestedAt: new Date('2025-01-22T16:10:00Z'),
    files: [
      {
        snapshotId: 'snap-notebook',
        originalFileId: 'file-preprocessing-notebook',
        path: '/notebooks/preprocessing.ipynb',
        name: 'preprocessing.ipynb',
        size: 524288,
        mimeType: 'application/x-ipynb+json',
        checksum:
          '6789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012345',
        createdAt: new Date('2025-01-22T16:05:00Z'),
        expiresAt: new Date('2025-01-29T16:05:00Z')
      }
    ],
    totalSize: 524288,
    justification: 'Take notebook offline for conference presentation prep.',
    reviewedBy: workspaceAdmin,
    reviewedAt: new Date('2025-01-22T16:45:00Z'),
    reviewNotes: 'Insufficient justification for external export.'
  }
]

const MOCK_WORKSPACE: EnhancedChorusWorkspace = {
  id: 'workspace-genomics-lab',
  tenantId: 'tenant-chorus',
  userId: workspaceAdmin.userId,
  name: 'Genomics Analysis Workspace',
  shortName: 'genomics-lab',
  description:
    'Secure analysis environment for CHORUS genomics research projects with controlled data movement.',
  status: 'active',
  isMain: true,
  appInstanceIds: [],
  appInstances: [],
  createdAt: new Date('2024-06-12T08:30:00Z'),
  updatedAt: new Date('2025-02-10T08:15:00Z'),
  network: {
    type: 'whitelisted',
    whitelistedDomains: ['regulator.swiss.gov', 'secure.collab.ch'],
    lastVerified: new Date('2025-02-01T12:00:00Z'),
    description: 'Restricted outbound connectivity with curated allow list.'
  },
  resources: {
    gpu: {
      allocated: 8,
      used: 5,
      model: 'NVIDIA A100',
      unit: 'devices'
    },
    cpu: {
      allocated: 64,
      used: 36,
      unit: 'cores'
    },
    ram: {
      allocated: 256,
      used: 180,
      unit: 'GB'
    },
    storage: {
      allocated: 50,
      used: 33,
      unit: 'TB'
    }
  },
  members: [workspaceAdmin, dataManager, researcher],
  services: [
    {
      id: 'svc-gitlab',
      type: 'gitlab',
      name: 'GitLab Runner',
      url: 'https://gitlab.chorus.lab/projects/genomics',
      status: 'running',
      version: '17.4.0',
      lastHealthCheck: new Date('2025-02-10T07:50:00Z')
    },
    {
      id: 'svc-jupyter',
      type: 'jupyter',
      name: 'JupyterLab',
      url: 'https://jupyter.genomics.lab',
      status: 'running',
      version: '4.2.0',
      lastHealthCheck: new Date('2025-02-10T07:55:00Z')
    },
    {
      id: 'svc-rstudio',
      type: 'rstudio',
      name: 'RStudio Server',
      url: 'https://rstudio.genomics.lab',
      status: 'stopped',
      version: '2024.09',
      lastHealthCheck: new Date('2025-02-09T18:20:00Z')
    },
    {
      id: 'svc-vscode',
      type: 'vscode',
      name: 'VS Code Web',
      url: 'https://vscode.genomics.lab',
      status: 'provisioning',
      version: '1.95.0',
      lastHealthCheck: new Date('2025-02-10T06:40:00Z')
    }
  ],
  pendingRequests: mockPendingRequests,
  requestHistory: mockRequestHistory
}

const MOCK_CURRENT_USER = workspaceAdmin

// ============================================================================
// Props Interface
// ============================================================================

export interface WorkspaceDashboardProps {
  workspace: EnhancedChorusWorkspace
  currentUser: WorkspaceMember
  onWorkspaceUpdate?: (workspace: EnhancedChorusWorkspace) => void
  onRequestAction?: (
    requestId: string,
    action: 'approve' | 'reject',
    notes?: string
  ) => void
}

// ============================================================================
// Main Component
// ============================================================================

function WorkspaceDashboard({
  workspace,
  currentUser,
  onWorkspaceUpdate,
  onRequestAction
}: WorkspaceDashboardProps) {
  const [viewState, setViewState] = React.useState<DashboardViewState>({
    activeTab: 'overview',
    fileSelectionBasket: {
      selectedFiles: [],
      totalSize: 0,
      selectionMode: null
    }
  })

  // Announcement for screen readers when critical state changes
  const [liveRegionMessage, setLiveRegionMessage] = React.useState('')

  const pendingRequestsCount = workspace.pendingRequests.length
  const hasAlerts = pendingRequestsCount > 0 && currentUser.permissions.approve

  React.useEffect(() => {
    if (hasAlerts) {
      setLiveRegionMessage(
        `You have ${pendingRequestsCount} pending data movement ${pendingRequestsCount === 1 ? 'request' : 'requests'} requiring approval.`
      )
    }
  }, [pendingRequestsCount, hasAlerts])

  // ============================================================================
  // Network Status Badge
  // ============================================================================

  const NetworkStatusBadge = () => {
    const { type, description } = workspace.network
    const variant =
      type === 'air-gapped'
        ? 'destructive'
        : type === 'whitelisted'
          ? 'default'
          : 'secondary'

    return (
      <Badge
        variant={variant}
        className="flex items-center gap-1"
        aria-label={description}
      >
        <Network className="h-3 w-3" aria-hidden="true" />
        <span className="capitalize">{type.replace('-', ' ')}</span>
      </Badge>
    )
  }

  // ============================================================================
  // Workspace Header
  // ============================================================================

  const WorkspaceHeader = () => (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {workspace.name}
              </h1>
              <NetworkStatusBadge />
              {workspace.isMain && (
                <Badge
                  variant="outline"
                  aria-label="This is your main workspace"
                >
                  Main Workspace
                </Badge>
              )}
            </div>
            {workspace.description && (
              <p className="text-sm text-muted-foreground">
                {workspace.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                <strong>Role:</strong> {currentUser.role.replace('-', ' ')}
              </span>
              <span aria-hidden="true">•</span>
              <span>
                <strong>Members:</strong> {workspace.members.length}
              </span>
              <span aria-hidden="true">•</span>
              <span>
                <strong>Status:</strong> {workspace.status}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {hasAlerts && (
              <Alert variant="default" className="w-fit">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-sm">Pending Approvals</AlertTitle>
                <AlertDescription className="text-xs">
                  {pendingRequestsCount}{' '}
                  {pendingRequestsCount === 1 ? 'request' : 'requests'} awaiting
                  review
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </header>
  )

  // ============================================================================
  // Main Navigation Tabs
  // ============================================================================

  return (
    <div className="min-h-screen bg-background">
      {/* Skip Link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Live region for screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {liveRegionMessage}
      </div>

      <WorkspaceHeader />

      <main id="main-content" className="container mx-auto px-4 py-6">
        <Tabs
          value={viewState.activeTab}
          onValueChange={(value) =>
            setViewState((prev) => ({
              ...prev,
              activeTab: value as DashboardViewState['activeTab']
            }))
          }
          className="w-full"
        >
          <TabsList
            className="grid w-full grid-cols-6 lg:w-fit lg:gap-1"
            aria-label="Workspace navigation"
          >
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Database className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>

            <TabsTrigger value="files" className="flex items-center gap-2">
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span>Files</span>
            </TabsTrigger>

            <TabsTrigger
              value="data-movement"
              className="relative flex items-center gap-2"
            >
              <GitBranch className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Data Movement</span>
              <span className="sm:hidden">Requests</span>
              {pendingRequestsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
                  aria-label={`${pendingRequestsCount} pending requests`}
                >
                  {pendingRequestsCount}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Settings className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Resources</span>
              <span className="sm:hidden">CPU/GPU</span>
            </TabsTrigger>

            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" aria-hidden="true" />
              <span>Members</span>
            </TabsTrigger>

            <TabsTrigger value="services" className="flex items-center gap-2">
              <Shield className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Services</span>
              <span className="sm:hidden">Apps</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Panels with Suspense boundaries */}
          <div className="mt-6">
            <TabsContent value="overview" className="space-y-4">
              <OverviewPanel workspace={workspace} currentUser={currentUser} />
            </TabsContent>

            <TabsContent value="files">
              <React.Suspense
                fallback={<LoadingPanel label="Loading files..." />}
              >
                <FilesPanel
                  workspace={workspace}
                  currentUser={currentUser}
                  selectionState={viewState.fileSelectionBasket}
                  onSelectionChange={(newState) =>
                    setViewState((prev) => ({
                      ...prev,
                      fileSelectionBasket: newState
                    }))
                  }
                />
              </React.Suspense>
            </TabsContent>

            <TabsContent value="data-movement">
              <React.Suspense
                fallback={
                  <LoadingPanel label="Loading data movement requests..." />
                }
              >
                <DataMovementPanel
                  workspace={workspace}
                  currentUser={currentUser}
                  onRequestAction={onRequestAction}
                />
              </React.Suspense>
            </TabsContent>

            <TabsContent value="resources">
              <React.Suspense
                fallback={<LoadingPanel label="Loading resource metrics..." />}
              >
                <WorkspaceResourcesPanel resources={workspace.resources} />
              </React.Suspense>
            </TabsContent>

            <TabsContent value="members">
              <React.Suspense
                fallback={<LoadingPanel label="Loading members..." />}
              >
                <MembersRolesPanel
                  members={workspace.members}
                  currentUser={currentUser}
                  canManageMembers={currentUser.permissions.manageMembers}
                />
              </React.Suspense>
            </TabsContent>

            <TabsContent value="services">
              <React.Suspense
                fallback={<LoadingPanel label="Loading services..." />}
              >
                <ServicesPanel
                  services={workspace.services}
                  canConfigureServices={
                    currentUser.permissions.configureServices
                  }
                />
              </React.Suspense>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}

// ============================================================================
// Overview Panel (not lazy loaded - critical content)
// ============================================================================

interface OverviewPanelProps {
  workspace: EnhancedChorusWorkspace
  currentUser: WorkspaceMember
}

function OverviewPanel({ workspace, currentUser }: OverviewPanelProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Network className="h-4 w-4" aria-hidden="true" />
            Network Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Type:</span>
            <Badge
              variant={
                workspace.network.type === 'air-gapped'
                  ? 'destructive'
                  : 'default'
              }
            >
              {workspace.network.type.replace('-', ' ')}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {workspace.network.description}
          </p>
          {workspace.network.whitelistedDomains &&
            workspace.network.whitelistedDomains.length > 0 && (
              <div className="mt-2">
                <span className="text-xs font-medium">
                  Whitelisted Domains:
                </span>
                <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                  {workspace.network.whitelistedDomains
                    .slice(0, 3)
                    .map((domain) => (
                      <li key={domain}>• {domain}</li>
                    ))}
                  {workspace.network.whitelistedDomains.length > 3 && (
                    <li>
                      + {workspace.network.whitelistedDomains.length - 3} more
                    </li>
                  )}
                </ul>
              </div>
            )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GitBranch className="h-4 w-4" aria-hidden="true" />
            Data Movement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Pending Requests:
            </span>
            <Badge
              variant={
                workspace.pendingRequests.length > 0 ? 'default' : 'secondary'
              }
            >
              {workspace.pendingRequests.length}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Can Download:</span>
            <span className="text-sm">
              {currentUser.permissions.download ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Can Transfer:</span>
            <span className="text-sm">
              {currentUser.permissions.transfer ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Can Approve:</span>
            <span className="text-sm">
              {currentUser.permissions.approve ? 'Yes' : 'No'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" aria-hidden="true" />
            Team
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Total Members:
            </span>
            <span className="text-sm font-medium">
              {workspace.members.length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Your Role:</span>
            <Badge variant="outline">
              {currentUser.role.replace('-', ' ')}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================================
// Loading Panel Component
// ============================================================================

function LoadingPanel({ label }: { label: string }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-2">
          <div
            className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================================
// Default Page Export (Lab Stub)
// ============================================================================

export default function WorkspaceDashboardPage() {
  return (
    <WorkspaceDashboard
      workspace={MOCK_WORKSPACE}
      currentUser={MOCK_CURRENT_USER}
    />
  )
}
