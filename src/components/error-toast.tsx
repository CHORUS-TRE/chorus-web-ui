import { Info } from 'lucide-react'

import { ToastAction, type ToastActionElement } from '@/components/ui/toast'
import { ChorusError } from '@/domain/model'
import {
  hasErrorDetail,
  useErrorDetailStore
} from '@/stores/error-detail-store'

interface ErrorToastProps {
  description: string
  action?: ToastActionElement
}

/**
 * Build toast props from a ChorusError. Spread into a toast() call alongside the
 * usual title/variant:
 *
 *   toast({ ...errorToast(result.error), variant: 'destructive' })
 *   toast({ title: 'Failed to update user', ...errorToast(result.error) })
 *
 * When the error carries extra context (stackTrace/instance/title) an (i) action
 * is added that opens the ErrorDetailDialog.
 */
export function errorToast(
  error?: ChorusError | null,
  fallback = 'Something went wrong.'
): ErrorToastProps {
  const props: ErrorToastProps = {
    description: error?.message ?? fallback
  }

  if (error && hasErrorDetail(error)) {
    props.action = (
      <ToastAction
        altText="Show error details"
        onClick={() => useErrorDetailStore.getState().open(error)}
      >
        <Info className="h-4 w-4" />
      </ToastAction>
    )
  }

  return props
}
