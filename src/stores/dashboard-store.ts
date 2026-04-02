'use client'

import { type Spec } from '@json-render/core'
import { type LayoutItem } from 'react-grid-layout'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Types ──────────────────────────────────────

export type WidgetContent =
  | { kind: 'spec'; spec: Spec }
  | { kind: 'workspace-status'; workspaceId: string | null }

export interface DashboardWidget {
  id: string
  prompt: string
  content: WidgetContent
  /** @deprecated use content instead — kept for localStorage migration */
  spec?: Spec
  createdAt: string
  boardId: string
}

export interface Board {
  id: string
  name: string
  order: number
}

const DEFAULT_BOARDS: Board[] = [
  { id: 'chorus', name: 'Chorus', order: 0 },
  { id: 'workspaces', name: 'Workspaces', order: 1 },
  { id: 'personal', name: 'Personal', order: 2 }
]

// ── Store ──────────────────────────────────────

interface DashboardStore {
  boards: Board[]
  widgets: DashboardWidget[]
  /** react-grid-layout layouts keyed by boardId */
  layouts: Record<string, LayoutItem[]>
  activeBoardId: string

  // Board actions
  setActiveBoard: (id: string) => void
  addBoard: (name: string) => void
  removeBoard: (id: string) => void
  renameBoard: (id: string, name: string) => void

  // Widget actions
  addWidget: (widget: DashboardWidget, layout?: Partial<LayoutItem>) => void
  removeWidget: (id: string) => void
  updateWidget: (
    id: string,
    updates: Partial<Pick<DashboardWidget, 'prompt' | 'content'>>
  ) => void
  moveWidgetToBoard: (widgetId: string, targetBoardId: string) => void

  // LayoutItem actions
  updateLayoutItems: (boardId: string, layouts: LayoutItem[]) => void
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      boards: DEFAULT_BOARDS,
      widgets: [],
      layouts: {},
      activeBoardId: 'chorus',

      setActiveBoard: (id) => set({ activeBoardId: id }),

      addBoard: (name) =>
        set((s) => {
          const id = crypto.randomUUID()
          const order = Math.max(...s.boards.map((b) => b.order), -1) + 1
          return { boards: [...s.boards, { id, name, order }] }
        }),

      removeBoard: (id) =>
        set((s) => ({
          boards: s.boards.filter((b) => b.id !== id),
          widgets: s.widgets.filter((w) => w.boardId !== id),
          layouts: Object.fromEntries(
            Object.entries(s.layouts).filter(([k]) => k !== id)
          ),
          activeBoardId:
            s.activeBoardId === id
              ? (s.boards[0]?.id ?? 'chorus')
              : s.activeBoardId
        })),

      renameBoard: (id, name) =>
        set((s) => ({
          boards: s.boards.map((b) => (b.id === id ? { ...b, name } : b))
        })),

      addWidget: (widget, layout) =>
        set((s) => {
          const boardLayoutItems = s.layouts[widget.boardId] ?? []
          const newLayoutItem: LayoutItem = {
            i: widget.id,
            x: 0,
            y: Infinity, // puts it at the bottom
            w: layout?.w ?? 4,
            h: layout?.h ?? 3,
            minW: 2,
            minH: 2,
            ...layout
          }
          return {
            widgets: [...s.widgets, widget],
            layouts: {
              ...s.layouts,
              [widget.boardId]: [...boardLayoutItems, newLayoutItem]
            }
          }
        }),

      removeWidget: (id) =>
        set((s) => ({
          widgets: s.widgets.filter((w) => w.id !== id),
          layouts: Object.fromEntries(
            Object.entries(s.layouts).map(([boardId, items]) => [
              boardId,
              items.filter((l) => l.i !== id)
            ])
          )
        })),

      updateWidget: (id, updates) =>
        set((s) => ({
          widgets: s.widgets.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          )
        })),

      moveWidgetToBoard: (widgetId, targetBoardId) =>
        set((s) => {
          const widget = s.widgets.find((w) => w.id === widgetId)
          if (!widget || widget.boardId === targetBoardId) return s

          const sourceBoardId = widget.boardId
          const sourceLayoutItems = (s.layouts[sourceBoardId] ?? []).filter(
            (l) => l.i !== widgetId
          )
          const existingLayoutItem = (s.layouts[sourceBoardId] ?? []).find(
            (l) => l.i === widgetId
          )
          const targetLayoutItems = [
            ...(s.layouts[targetBoardId] ?? []),
            {
              i: widgetId,
              x: 0,
              y: Infinity,
              w: existingLayoutItem?.w ?? 4,
              h: existingLayoutItem?.h ?? 3,
              minW: 2,
              minH: 2
            }
          ]

          return {
            widgets: s.widgets.map((w) =>
              w.id === widgetId ? { ...w, boardId: targetBoardId } : w
            ),
            layouts: {
              ...s.layouts,
              [sourceBoardId]: sourceLayoutItems,
              [targetBoardId]: targetLayoutItems
            }
          }
        }),

      updateLayoutItems: (boardId, layouts) =>
        set((s) => ({
          layouts: { ...s.layouts, [boardId]: layouts }
        }))
    }),
    {
      name: 'chorus-ai-dashboard',
      version: 3,
      migrate: (state: unknown) => {
        const s = state as { widgets?: DashboardWidget[] }
        if (s?.widgets) {
          s.widgets = s.widgets.map((w) => ({
            ...w,
            content:
              w.content ??
              (w.spec
                ? { kind: 'spec' as const, spec: w.spec }
                : { kind: 'spec' as const, spec: { root: '', elements: {} } })
          }))
        }
        return s
      }
    }
  )
)
