import { anthropic } from '@ai-sdk/anthropic'
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  UIMessage
} from 'ai'
import { z } from 'zod'

export const runtime = 'edge'

const SYSTEM_PROMPT = `You are the Chorus Assistant, an AI embedded in the CHORUS Trusted Research Environment (TRE) platform.

CHORUS is a platform for medical researchers at CHUV (Centre Hospitalier Universitaire Vaudois) that provides:
- Workspaces: isolated research environments for projects
- Sessions/Workbenches: compute environments within workspaces
- Apps: tools researchers can launch (RStudio, JupyterLab, etc.)
- Data management: secure access to clinical datasets

Your role:
- Help users navigate the platform
- Guide users through creating workspaces, launching sessions, managing data
- Answer questions about CHORUS features and best practices for TREs

When a user asks to see workspaces → use navigateTo with page "workspaces".
When a user asks to see sessions → use navigateTo with page "sessions".
When a user wants to create a workspace → use showWizard.
For other navigation requests → use navigateTo with the appropriate page.

Always respond in the same language the user is using (French or English).
Keep responses concise.`

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: UIMessage[] }

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      navigateTo: tool({
        description:
          'Navigate the user to a specific page in the CHORUS platform. Use this when the user asks to see or access any part of the app.',
        inputSchema: z.object({
          page: z
            .enum([
              'dashboard',
              'workspaces',
              'sessions',
              'app-store',
              'data',
              'messages'
            ])
            .describe('The page to navigate to')
        }),
        execute: async (input) => ({ page: input.page })
      }),

      showWizard: tool({
        description:
          'Launch an interactive workspace creation wizard in the chat. Use this when the user wants to create a new workspace, start a new research project, or when they upload a document describing a study.',
        inputSchema: z.object({
          projectType: z
            .enum(['clinical-study', 'data-analysis', 'ml-training', 'general'])
            .optional()
            .describe('Type of research project if known'),
          suggestedName: z
            .string()
            .optional()
            .describe('Pre-filled workspace name if mentioned by user'),
          context: z
            .string()
            .optional()
            .describe(
              'Any context from the conversation to pre-fill wizard fields'
            )
        }),
        execute: async (input) => ({
          artifact: 'wizard',
          projectType: input.projectType ?? 'general',
          suggestedName: input.suggestedName ?? null,
          context: input.context ?? null
        })
      })
    }
  })

  return result.toUIMessageStreamResponse()
}
