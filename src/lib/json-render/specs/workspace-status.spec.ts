'use client'

import { type Spec } from '@json-render/core'

import { type StateAwareHandler } from '@/components/chat/artifacts/dynamic-ui-renderer'
import {
  fetchWorkspaceStatusParams,
  selectWorkspaceParams
} from '@/lib/json-render/catalog'
import { listAppInstances } from '~/view-model/app-instance-view-model'
import { listApprovalRequests } from '~/view-model/approval-request-view-model'
import {
  workspaceGetWithDev,
  workspaceListWithDev
} from '~/view-model/workspace-view-model'

// ---------------------------------------------------------------------------
// Spec builder
// ---------------------------------------------------------------------------

export function buildWorkspaceStatusSpec(workspaceId: string | null): Spec {
  const elements: Spec['elements'] = {}

  // DataLoader — fires fetchWorkspaceStatus on mount and on selectedId change
  elements['loader'] = {
    type: 'DataLoader',
    props: {},
    on: {
      load: {
        action: 'fetchWorkspaceStatus',
        params: { workspaceId: { $state: '/selectedId' } }
      }
    },
    watch: {
      '/selectedId': {
        action: 'fetchWorkspaceStatus',
        params: { workspaceId: { $state: '/selectedId' } }
      }
    }
  }

  // Loading state
  elements['loading-view'] = {
    type: 'Text',
    props: { text: 'Loading workspace status…', variant: 'muted' },
    visible: { $state: '/loading' }
  }

  // Error state
  elements['error-view'] = {
    type: 'Alert',
    props: {
      title: { $state: '/error' } as Record<string, string>,
      message: null,
      type: 'error'
    },
    visible: { $state: '/error' }
  }

  // Workspace card elements
  elements['workspace-name'] = {
    type: 'Heading',
    props: {
      text: { $state: '/workspace/name' } as Record<string, string>,
      level: null
    }
  }

  elements['workspace-status-badge'] = {
    type: 'StatusBadge',
    props: {
      status: { $state: '/workspace/status' } as Record<string, string>,
      label: null
    }
  }

  elements['workspace-meta'] = {
    type: 'Stack',
    props: {
      direction: 'horizontal',
      gap: 'sm',
      align: 'center',
      justify: null
    },
    children: ['workspace-name', 'workspace-status-badge']
  }

  elements['workspace-description'] = {
    type: 'Text',
    props: {
      text: { $state: '/workspace/description' } as Record<string, string>,
      variant: 'muted'
    },
    visible: { $state: '/workspace/description' }
  }

  elements['member-badge'] = {
    type: 'Badge',
    props: {
      text: { $item: 'displayName' } as Record<string, string>,
      variant: 'secondary'
    }
  }

  elements['members-list'] = {
    type: 'Stack',
    props: { direction: 'horizontal', gap: 'sm', align: null, justify: null },
    repeat: { statePath: '/workspace/members', key: 'id' },
    children: ['member-badge']
  }

  elements['members-section'] = {
    type: 'InfoCard',
    props: { title: 'Team', icon: 'users' },
    children: ['members-list']
  }

  elements['approval-item'] = {
    type: 'StatusField',
    props: {
      label: { $item: 'title' } as Record<string, string>,
      value: { $item: 'status' } as Record<string, string>,
      variant: null
    }
  }

  elements['approvals-list'] = {
    type: 'Stack',
    props: { direction: 'vertical', gap: 'sm', align: null, justify: null },
    repeat: { statePath: '/approvals', key: 'id' },
    children: ['approval-item']
  }

  elements['approvals-section'] = {
    type: 'InfoCard',
    props: { title: 'Data Requests', icon: 'file-text' },
    children: ['approvals-list'],
    visible: { $state: '/approvalsExist' }
  }

  elements['app-badge'] = {
    type: 'Badge',
    props: {
      text: { $item: 'displayName' } as Record<string, string>,
      variant: 'outline'
    }
  }

  elements['apps-list'] = {
    type: 'Stack',
    props: { direction: 'horizontal', gap: 'sm', align: null, justify: null },
    repeat: { statePath: '/appInstances', key: 'id' },
    children: ['app-badge']
  }

  elements['apps-section'] = {
    type: 'InfoCard',
    props: { title: 'Applications', icon: 'settings' },
    children: ['apps-list'],
    visible: { $state: '/appInstancesExist' }
  }

  elements['workspace-created'] = {
    type: 'Text',
    props: {
      text: { $state: '/workspace/createdLabel' } as Record<string, string>,
      variant: 'caption'
    }
  }

  elements['workspace-content'] = {
    type: 'Stack',
    props: { direction: 'vertical', gap: 'md', align: null, justify: null },
    children: [
      'workspace-meta',
      'workspace-description',
      'members-section',
      'approvals-section',
      'apps-section',
      'workspace-created'
    ]
  }

  elements['workspace-card'] = {
    type: 'Card',
    props: { title: null, description: null, maxWidth: null, centered: null },
    children: ['workspace-content'],
    visible: { $state: '/workspace' }
  }

  // Workspace picker
  elements['picker-heading'] = {
    type: 'Heading',
    props: { text: 'Your Workspaces', level: null }
  }

  elements['picker-item'] = {
    type: 'WorkspacePickerItem',
    props: {
      id: { $item: 'id' } as Record<string, string>,
      name: { $item: 'name' } as Record<string, string>,
      status: { $item: 'status' } as Record<string, string>,
      memberCount: { $item: 'memberCount' } as Record<string, string>,
      workbenchCount: { $item: 'workbenchCount' } as Record<string, string>
    },
    on: {
      click: {
        action: 'selectWorkspace',
        params: { workspaceId: { $item: 'id' } as Record<string, string> }
      }
    }
  }

  elements['picker-list'] = {
    type: 'Stack',
    props: { direction: 'vertical', gap: 'sm', align: null, justify: null },
    repeat: { statePath: '/workspaces', key: 'id' },
    children: ['picker-item']
  }

  elements['workspace-picker'] = {
    type: 'Card',
    props: { title: null, description: null, maxWidth: null, centered: null },
    children: ['picker-heading', 'picker-list'],
    visible: { $state: '/workspaces' }
  }

  elements['root'] = {
    type: 'Stack',
    props: { direction: 'vertical', gap: 'md', align: null, justify: null },
    children: [
      'loader',
      'loading-view',
      'error-view',
      'workspace-card',
      'workspace-picker'
    ]
  }

  return {
    root: 'root',
    elements,
    state: {
      selectedId: workspaceId,
      loading: true,
      workspace: null,
      workspaces: null,
      approvals: [],
      appInstances: [],
      approvalsExist: false,
      appInstancesExist: false,
      error: null
    }
  }
}

// ---------------------------------------------------------------------------
// Action handlers
// ---------------------------------------------------------------------------

export const workspaceStatusHandlers: Record<string, StateAwareHandler> = {
  fetchWorkspaceStatus: async (
    rawParams: Record<string, unknown>,
    setState: (path: string, value: unknown) => void
  ) => {
    setState('/loading', true)
    setState('/error', null)
    const { workspaceId } = fetchWorkspaceStatusParams.parse(rawParams)

    try {
      if (workspaceId) {
        const [wsResult, approvalsResult, appsResult] = await Promise.all([
          workspaceGetWithDev(workspaceId),
          listApprovalRequests({ filterSourceWorkspaceId: workspaceId }),
          listAppInstances()
        ])

        if (wsResult.error) {
          setState('/error', wsResult.error)
        } else if (wsResult.data) {
          const ws = wsResult.data
          setState('/workspace', {
            name: ws.name,
            shortName: ws.shortName,
            status: ws.status,
            description: ws.description ?? null,
            createdLabel: `Created ${new Date(ws.createdAt).toLocaleDateString()}`,
            members: (ws.dev?.members ?? []).map((m) => ({
              id: m.id,
              displayName: `${m.firstName} ${m.lastName}`
            }))
          })
          const approvals = approvalsResult.data ?? []
          setState(
            '/approvals',
            approvals.map((a) => ({
              id: a.id,
              title: a.title,
              status: a.status ?? ''
            }))
          )
          setState('/approvalsExist', approvals.length > 0)
          const apps = (appsResult.data ?? []).filter(
            (a) => a.workspaceId === workspaceId
          )
          setState(
            '/appInstances',
            apps.map((a) => ({
              id: a.id,
              displayName: `${a.name ?? a.appId} — ${a.status}`
            }))
          )
          setState('/appInstancesExist', apps.length > 0)
        }
      } else {
        const result = await workspaceListWithDev()
        if (result.error) {
          setState('/error', result.error)
        } else {
          const workspaces = result.data ?? []
          if (workspaces.length === 1) {
            // Single workspace — select it directly; watch on /selectedId re-fires fetch
            setState('/selectedId', workspaces[0].id)
          } else {
            setState(
              '/workspaces',
              workspaces.map((ws) => ({
                id: ws.id,
                name: ws.name,
                status: ws.status,
                memberCount: ws.dev?.memberCount ?? 0,
                workbenchCount: ws.dev?.workbenchCount ?? 0
              }))
            )
          }
        }
      }
    } catch (e) {
      setState('/error', String(e))
    } finally {
      setState('/loading', false)
    }
  },

  selectWorkspace: (
    rawParams: Record<string, unknown>,
    setState: (path: string, value: unknown) => void
  ) => {
    const { workspaceId } = selectWorkspaceParams.parse(rawParams)
    setState('/workspace', null)
    setState('/workspaces', null)
    setState('/selectedId', workspaceId)
    // watch on /selectedId fires fetchWorkspaceStatus automatically
  }
}
