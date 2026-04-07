import { tool } from 'ai'
import { z } from 'zod'

export const generateUITool = tool({
  description:
    "Generate a rich visual UI widget from the component catalog. Use for summaries, dashboards, status overviews, comparison tables, checklists, or any custom layout that doesn't fit the other tools. Return a valid json-render Spec with root + elements.",
  inputSchema: z.object({
    spec: z.object({
      root: z.string().describe('Key of the root element'),
      elements: z
        .record(
          z.string(),
          z.object({
            type: z.string().describe('Component type from catalog'),
            props: z
              .record(z.string(), z.any())
              .describe('Component props matching the catalog schema'),
            children: z
              .array(z.string())
              .optional()
              .describe('Child element keys')
          })
        )
        .describe('Flat map of elements keyed by unique IDs')
    })
  }),
  execute: async ({ spec }) => ({
    type: 'dynamic-ui' as const,
    spec
  })
})
