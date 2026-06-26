'use client'

import { create } from 'zustand'

import { ChorusError } from '@/domain/model'

interface ErrorDetailState {
  /** The error currently shown in the detail dialog, or null when closed. */
  error: ChorusError | null
  open: (error: ChorusError) => void
  close: () => void
}

export const useErrorDetailStore = create<ErrorDetailState>((set) => ({
  error: null,
  open: (error) => set({ error }),
  close: () => set({ error: null })
}))

/**
 * Whether an error carries enough extra context to justify a "details" affordance
 * (the (i) button on the toast). Plain message-only errors don't get one.
 */
export const hasErrorDetail = (error?: ChorusError | null): boolean =>
  !!error && (!!error.stackTrace || !!error.instance || !!error.title)
