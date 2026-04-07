'use client'

import 'react-grid-layout/css/styles.css'

import { type Spec } from '@json-render/core'
import {
  Check,
  Edit3,
  GripVertical,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  X
} from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  type Layout,
  type LayoutItem,
  ResponsiveGridLayout,
  useContainerWidth
} from 'react-grid-layout'

import { DynamicUIRenderer } from '@/components/chat/artifacts/dynamic-ui-renderer'
import { buildSearchResultsSpec } from '@/lib/json-render/specs/search-results.spec'
import {
  buildWorkspaceStatusSpec,
  workspaceStatusHandlers
} from '@/lib/json-render/specs/workspace-status.spec'
import { buildWorkflowSpec } from '@/lib/json-render/specs/workflow.spec'
import { cn } from '@/lib/utils'
import {
  Board,
  DashboardWidget,
  useDashboardStore,
  WidgetContent
} from '@/stores/dashboard-store'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'

// ────────────────────────────────────────────
// Suggested prompts
// ────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  'Workspace status overview',
  'My pending data requests',
  'Data extraction workflow steps',
  'Regulatory checklist for clinical trials'
]

// ────────────────────────────────────────────
// Widget generation
// ────────────────────────────────────────────

/**
 * Generate a widget spec by calling the chat API.
 * Handles both:
 * 1. ```spec fences → transformed to data-spec parts by pipeJsonRender
 * 2. generateUI tool results → contain { spec: { root, elements } }
 */
async function generateWidget(prompt: string): Promise<WidgetContent> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        {
          role: 'user',
          content: `Generate a dashboard widget for: "${prompt}". For workspace or study data, call getWorkspaceStatus first to get live data, then use generateUI with the real values. For other content, use generateUI directly OR respond with ONLY a raw JSON spec object (no markdown, no explanation) using these components: Card, Stack, Grid, Text, Heading, Badge, Table, StatusField, InfoCard, Progress, Alert. Keep it compact.`
        }
      ]
    })
  })

  if (!res.ok) throw new Error(`API error: ${res.status}`)
  if (!res.body) throw new Error('No response body')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
  }

  // Parse the toUIMessageStreamResponse() SSE format
  let textAccum = ''
  let spec: Spec | null = null
  let workspaceContent: WidgetContent | null = null

  for (const line of buffer.split('\n')) {
    if (!line.startsWith('data: ')) continue
    try {
      const event = JSON.parse(line.slice(6)) as Record<string, unknown>
      const output = event.output as Record<string, unknown> | undefined

      if (event.type === 'text-delta' && typeof event.delta === 'string') {
        textAccum += event.delta
        continue
      }

      // getWorkspaceStatus was called — use live widget renderer
      if (
        event.type === 'tool-output-available' &&
        output?.type === 'workspace-status'
      ) {
        workspaceContent = {
          kind: 'workspace-status',
          workspaceId: (output.workspaceId as string | null) ?? null
        }
        continue
      }

      // generateUI was called — extract spec from result
      if (
        event.type === 'tool-output-available' &&
        output?.type === 'dynamic-ui'
      ) {
        const found = findSpec(output)
        if (found) spec = found
      }

      // showWorkflow was called — build a workflow widget
      if (
        event.type === 'tool-output-available' &&
        output?.type === 'workflow'
      ) {
        spec = buildWorkflowSpec(
          (output.title as string) ?? '',
          (output.steps as Parameters<typeof buildWorkflowSpec>[1]) ?? [],
          (output.currentStep as number) ?? 0
        )
      }

      // searchDocumentation was called — build a search-results widget
      if (
        event.type === 'tool-output-available' &&
        output?.type === 'search-results'
      ) {
        spec = buildSearchResultsSpec({
          query: (output.query as string) ?? '',
          collection: (output.collection as string) ?? 'all',
          results: ((output.results as unknown[]) ?? []) as Parameters<typeof buildSearchResultsSpec>[0]['results'],
          error: output.error as string | undefined
        })
      }
    } catch {
      // not JSON
    }
  }

  // If getWorkspaceStatus was called, prefer that over a generated spec
  if (workspaceContent) return workspaceContent

  // Fall back to parsing accumulated text as a spec
  if (!spec && textAccum.trim()) {
    spec = findSpec(tryParseJSON(textAccum.trim()))
  }

  if (!spec?.root) {
    throw new Error('No widget spec found in AI response')
  }

  return { kind: 'spec', spec }
}

function tryParseJSON(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/** Resolve drag-drop payload to a WidgetContent */
function resolveDropContent(spec: unknown): WidgetContent | null {
  if (!spec || typeof spec !== 'object') return null
  const s = spec as Record<string, unknown>
  if (s.type === 'workspace-status') {
    return {
      kind: 'workspace-status',
      workspaceId: (s.workspaceId as string) ?? null
    }
  }
  const found = findSpec(spec)
  return found ? { kind: 'spec', spec: found } : null
}

/** Recursively search an object tree for a json-render spec ({ root, elements }) */
function findSpec(obj: unknown): Spec | null {
  if (!obj || typeof obj !== 'object') return null
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findSpec(item)
      if (found) return found
    }
    return null
  }
  const o = obj as Record<string, unknown>
  if (
    typeof o.root === 'string' &&
    o.root &&
    o.elements &&
    typeof o.elements === 'object'
  ) {
    return o as unknown as Spec
  }
  for (const v of Object.values(o)) {
    const found = findSpec(v)
    if (found) return found
  }
  return null
}

// ────────────────────────────────────────────
// Board Tab
// ────────────────────────────────────────────

function BoardTab({
  board,
  isActive,
  isDragOver,
  onSelect,
  onRename,
  onRemove,
  onDragOver,
  onDragLeave,
  onDrop,
  isDefault
}: {
  board: Board
  isActive: boolean
  isDragOver: boolean
  onSelect: () => void
  onRename: (name: string) => void
  onRemove: () => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  isDefault: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(board.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const commitRename = () => {
    const trimmed = name.trim()
    if (trimmed && trimmed !== board.name) onRename(trimmed)
    else setName(board.name)
    setEditing(false)
  }

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        'group relative flex items-center gap-1.5 rounded-t-lg border border-b-0 px-3 py-1.5 text-sm transition-colors',
        isActive
          ? 'border-border bg-card text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground',
        isDragOver && 'bg-primary/5 ring-2 ring-primary/50'
      )}
    >
      {editing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            commitRename()
          }}
          className="flex items-center gap-1"
        >
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={commitRename}
            className="w-24 border-b border-primary/50 bg-transparent text-sm outline-none"
          />
          <button type="submit" className="text-primary">
            <Check className="h-3 w-3" />
          </button>
        </form>
      ) : (
        <>
          <button onClick={onSelect} className="font-medium">
            {board.name}
          </button>
          <button
            onClick={() => setEditing(true)}
            className="text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
          >
            <Edit3 className="h-3 w-3" />
          </button>
          {!isDefault && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
              className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </>
      )}
    </div>
  )
}

// ────────────────────────────────────────────
// Widget Card
// ────────────────────────────────────────────

function WidgetCard({
  widget,
  onRemove,
  isEditing,
  onEditToggle,
  onUpdate
}: {
  widget: DashboardWidget
  onRemove: () => void
  isEditing: boolean
  onEditToggle: () => void
  onUpdate: (prompt: string, content: WidgetContent) => void
}) {
  const [prompt, setPrompt] = useState(widget.prompt)
  const [previewContent, setPreviewContent] = useState<WidgetContent>(
    widget.content
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRegenerate = async () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    setError(null)
    try {
      const newContent = await generateWidget(prompt)
      setPreviewContent(newContent)
      onUpdate(prompt, newContent)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Regeneration failed')
    } finally {
      setLoading(false)
    }
  }

  // Sync preview when widget content changes externally
  useEffect(() => {
    setPreviewContent(widget.content)
    setPrompt(widget.prompt)
  }, [widget.content, widget.prompt])

  return (
    <div
      className={cn(
        'group relative flex h-full flex-col rounded-xl border border-muted/40 bg-card/50',
        isEditing ? 'z-30 overflow-visible' : 'overflow-hidden'
      )}
    >
      {/* Drag handle + title bar */}
      <div className="widget-drag-handle flex cursor-grab items-center justify-between border-b border-muted/30 px-3 py-2 active:cursor-grabbing">
        <div className="flex items-center gap-1.5">
          <GripVertical className="h-3 w-3 text-muted-foreground/40" />
          <Sparkles className="h-3 w-3 text-primary/60" />
          <span className="line-clamp-1 text-xs text-muted-foreground">
            {widget.prompt}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={onEditToggle}
            className={cn(
              'rounded p-0.5 transition-colors',
              isEditing
                ? 'text-primary'
                : 'text-muted-foreground/60 hover:text-foreground'
            )}
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onRemove}
            className="rounded p-0.5 text-muted-foreground/60 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Widget content */}
      <div className="flex-1 overflow-auto p-3">
        {previewContent.kind === 'workspace-status' ? (
          <DynamicUIRenderer
            spec={buildWorkspaceStatusSpec(previewContent.workspaceId)}
            handlers={workspaceStatusHandlers}
          />
        ) : (
          <DynamicUIRenderer spec={previewContent.spec} />
        )}
      </div>

      {/* Edit panel — floats below the widget, hovering over the board */}
      {isEditing && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border-2 border-primary/40 bg-card shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <span className="text-xs font-semibold">Edit Widget</span>
            <button
              onClick={onEditToggle}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-2 p-3">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey))
                  handleRegenerate()
              }}
              rows={2}
              className="resize-none text-xs"
              placeholder="Describe what this widget should show..."
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={handleRegenerate}
                disabled={loading || !prompt.trim()}
                className="h-7 text-xs"
              >
                {loading ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="mr-1 h-3 w-3" />
                )}
                Regenerate
              </Button>
              <span className="text-[10px] text-muted-foreground">
                {'\u2318'}+Enter
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────
// Add Widget Area
// ────────────────────────────────────────────

function AddWidgetArea({
  onGenerate
}: {
  onGenerate: (prompt: string) => Promise<void>
}) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return
      setLoading(true)
      setError(null)
      try {
        await onGenerate(text.trim())
        setPrompt('')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Generation failed')
      } finally {
        setLoading(false)
      }
    },
    [loading, onGenerate]
  )

  return (
    <div className="rounded-xl border-2 border-dashed border-muted/40 p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Plus className="h-5 w-5" />
          <span className="text-sm font-medium">Add Widget</span>
        </div>

        <div className="flex w-full max-w-md gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(prompt)}
            placeholder="Describe a widget..."
            className="h-9 text-sm"
            disabled={loading}
          />
          <Button
            size="sm"
            onClick={() => handleSubmit(prompt)}
            disabled={loading || !prompt.trim()}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Go'}
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-destructive">
            <X className="h-3.5 w-3.5" />
            {error}
            <button
              onClick={() => setError(null)}
              className="underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Try one of these:
          </span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {SUGGESTED_PROMPTS.map((s) => (
              <button
                key={s}
                onClick={() => handleSubmit(s)}
                disabled={loading}
                className="rounded-full border border-muted/40 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────
// Page
// ────────────────────────────────────────────

const DEFAULT_BOARD_IDS = new Set(['chorus', 'workspaces', 'personal'])

export default function AIBoardPage() {
  const {
    boards,
    widgets,
    layouts,
    activeBoardId,
    setActiveBoard,
    addBoard,
    removeBoard,
    renameBoard,
    addWidget,
    removeWidget,
    updateWidget,
    moveWidgetToBoard,
    updateLayoutItems
  } = useDashboardStore()

  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null)
  const [dragOverBoardId, setDragOverBoardId] = useState<string | null>(null)

  // Container width measurement for react-grid-layout v2
  const { width: containerWidth, containerRef } = useContainerWidth()

  const activeWidgets = widgets.filter((w) => w.boardId === activeBoardId)
  const activeLayout: Layout = (layouts[activeBoardId] ?? []) as LayoutItem[]

  const handleGenerate = useCallback(
    async (prompt: string) => {
      const content = await generateWidget(prompt)
      const widget: DashboardWidget = {
        id: crypto.randomUUID(),
        prompt,
        content,
        createdAt: new Date().toISOString(),
        boardId: activeBoardId
      }
      addWidget(widget)
    },
    [activeBoardId, addWidget]
  )

  const handleLayoutChange = useCallback(
    (layout: Layout) => {
      updateLayoutItems(activeBoardId, [...layout])
    },
    [activeBoardId, updateLayoutItems]
  )

  // Cross-board drag-and-drop via HTML5 drag
  const handleTabDragOver = (boardId: string) => (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverBoardId(boardId)
  }

  const handleTabDragLeave = () => setDragOverBoardId(null)

  const handleTabDrop = (boardId: string) => (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverBoardId(null)

    // Case 1: moving an existing widget between boards
    const widgetId = e.dataTransfer.getData('text/widget-id')
    if (widgetId) {
      moveWidgetToBoard(widgetId, boardId)
      return
    }

    // Case 2: dropping a widget from the chat window
    const specData = e.dataTransfer.getData('text/widget-spec')
    if (specData) {
      try {
        const { prompt, spec } = JSON.parse(specData)
        const content = resolveDropContent(spec)
        if (content) {
          addWidget({
            id: crypto.randomUUID(),
            prompt: prompt || 'Chat widget',
            content,
            createdAt: new Date().toISOString(),
            boardId
          })
        }
      } catch {
        // invalid JSON
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Board
        </h2>
        <p className="text-sm text-muted-foreground">
          Generate custom widgets with AI. Drag to rearrange, resize, or move
          between boards.
        </p>
      </div>

      {/* Board tabs */}
      <div className="mb-0 flex items-end gap-0.5 border-b">
        {boards
          .sort((a, b) => a.order - b.order)
          .map((board) => (
            <BoardTab
              key={board.id}
              board={board}
              isActive={board.id === activeBoardId}
              isDragOver={board.id === dragOverBoardId}
              onSelect={() => setActiveBoard(board.id)}
              onRename={(name) => renameBoard(board.id, name)}
              onRemove={() => removeBoard(board.id)}
              onDragOver={handleTabDragOver(board.id)}
              onDragLeave={handleTabDragLeave}
              onDrop={handleTabDrop(board.id)}
              isDefault={DEFAULT_BOARD_IDS.has(board.id)}
            />
          ))}
        <button
          onClick={() => addBoard('New Board')}
          className="mb-px ml-1 flex items-center gap-1 rounded-t-lg border border-b-0 border-transparent px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border hover:text-foreground"
        >
          <Plus className="h-3 w-3" />
          Board
        </button>
      </div>

      {/* Grid container — also accepts drops from chat */}
      <div
        ref={containerRef}
        className="pt-4"
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes('text/widget-spec')) {
            e.preventDefault()
          }
        }}
        onDrop={(e) => {
          const specData = e.dataTransfer.getData('text/widget-spec')
          if (!specData) return
          e.preventDefault()
          try {
            const { prompt, spec } = JSON.parse(specData)
            const content = resolveDropContent(spec)
            if (content) {
              addWidget({
                id: crypto.randomUUID(),
                prompt: prompt || 'Chat widget',
                content,
                createdAt: new Date().toISOString(),
                boardId: activeBoardId
              })
            }
          } catch {
            // invalid JSON
          }
        }}
      >
        {activeWidgets.length > 0 && containerWidth > 0 ? (
          <div className="mb-6">
            <ResponsiveGridLayout
              width={containerWidth}
              layouts={{ lg: activeLayout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 9, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={80}
              dragConfig={{ handle: '.widget-drag-handle' }}
              onLayoutChange={handleLayoutChange}
            >
              {activeWidgets.map((w) => (
                <div
                  key={w.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/widget-id', w.id)
                  }}
                  className={
                    editingWidgetId === w.id ? 'z-30 !overflow-visible' : ''
                  }
                >
                  <WidgetCard
                    widget={w}
                    onRemove={() => removeWidget(w.id)}
                    isEditing={editingWidgetId === w.id}
                    onEditToggle={() =>
                      setEditingWidgetId(editingWidgetId === w.id ? null : w.id)
                    }
                    onUpdate={(prompt, content) =>
                      updateWidget(w.id, { prompt, content })
                    }
                  />
                </div>
              ))}
            </ResponsiveGridLayout>
          </div>
        ) : activeWidgets.length === 0 ? (
          <div className="mb-6 flex h-32 items-center justify-center text-sm text-muted-foreground">
            No widgets on this board yet. Add one below.
          </div>
        ) : null}
      </div>

      {/* Add widget */}
      <AddWidgetArea onGenerate={handleGenerate} />
    </div>
  )
}
