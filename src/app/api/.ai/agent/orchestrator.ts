import { convertToModelMessages, stepCountIs, streamText, UIMessage } from 'ai'

import { generateUITool } from '../tools/generate-ui'
import { searchDocumentationTool } from '../tools/search'
import { showStudySetupWizardTool } from '../tools/study-setup'
import { showWorkflowTool } from '../tools/workflow'
import { getWorkspaceStatusTool } from '../tools/workspace-status'
import { getModel } from './model'
import { getSystemPrompt } from './system-prompt'

export async function orchestrate(rawMessages: Record<string, unknown>[]) {
  const messages: UIMessage[] = rawMessages.map((m) => {
    if (Array.isArray(m.parts)) return m as unknown as UIMessage
    return {
      id: (m.id as string) ?? crypto.randomUUID(),
      role: m.role as string,
      parts: [{ type: 'text', text: m.content as string }]
    } as unknown as UIMessage
  })

  const result = streamText({
    model: getModel(),
    system: getSystemPrompt(),
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      getWorkspaceStatus: getWorkspaceStatusTool,
      showWorkflow: showWorkflowTool,
      showStudySetupWizard: showStudySetupWizardTool,
      searchDocumentation: searchDocumentationTool,
      generateUI: generateUITool
    }
  })

  return result.toUIMessageStreamResponse()
}
