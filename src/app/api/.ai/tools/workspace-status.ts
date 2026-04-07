import { tool } from 'ai'
import { z } from 'zod'

export const getWorkspaceStatusTool = tool({
  description:
    'Show the current status of a research workspace, including members, active sessions, and pending data requests. Use when the user asks about their study progress or workspace state.',
  inputSchema: z.object({
    workspaceId: z
      .string()
      .nullish()
      .describe('Workspace ID. If omitted or null, shows workspace picker.')
  }),
  execute: async ({ workspaceId }) => ({
    type: 'workspace-status' as const,
    workspaceId: workspaceId ?? null
  })
})
