'use client'

import { UIMessage } from 'ai'
import { create } from 'zustand'

export type ArtifactType = 'wizard'

export interface ChatArtifact {
  type: ArtifactType
  data: Record<string, unknown>
}

export interface ChatStore {
  isOpen: boolean
  isExpanded: boolean
  messages: UIMessage[]

  open: () => void
  close: () => void
  toggleOpen: () => void
  setExpanded: (v: boolean) => void
  toggleExpand: () => void
  setMessages: (messages: UIMessage[]) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  isExpanded: false,
  messages: [],

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
  setExpanded: (v) => set({ isExpanded: v }),
  toggleExpand: () => set((s) => ({ isExpanded: !s.isExpanded })),
  setMessages: (messages) => set({ messages })
}))
