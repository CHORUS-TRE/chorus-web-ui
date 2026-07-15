'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useErrorDetailStore } from '@/stores/error-detail-store'

/**
 * Single, app-root-mounted dialog that shows the full details of a ChorusError.
 * Opened from anywhere via useErrorDetailStore().open(error) — typically the
 * (i) action on an error toast.
 */
export function ErrorDetailDialog() {
  const error = useErrorDetailStore((s) => s.error)
  const close = useErrorDetailStore((s) => s.close)

  return (
    <Dialog open={!!error} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{error?.title || 'Error details'}</DialogTitle>
          <DialogDescription>{error?.message}</DialogDescription>
        </DialogHeader>

        <dl className="grid grid-cols-[7rem_1fr] gap-x-4 gap-y-1 text-sm">
          {error?.code && (
            <>
              <dt className="text-muted-foreground">Code</dt>
              <dd className="break-all font-mono">{error.code}</dd>
            </>
          )}
          {error?.httpStatus !== undefined && (
            <>
              <dt className="text-muted-foreground">HTTP status</dt>
              <dd className="font-mono">{error.httpStatus}</dd>
            </>
          )}
          {error?.instance && (
            <>
              <dt className="text-muted-foreground">Instance</dt>
              <dd className="break-all font-mono">{error.instance}</dd>
            </>
          )}
          {error?.validationErrors?.length ? (
            <>
              <dt className="text-muted-foreground">Validation errors</dt>
              <dd>
                <ul>
                  {error.validationErrors.map((ve, i) => (
                    <li key={i}>
                      <span className="font-mono">{ve.field}</span>: {ve.reason}
                    </li>
                  ))}
                </ul>
              </dd>
            </>
          ) : null}
        </dl>

        {error?.stackTrace && (
          <div>
            <p className="text-sm text-muted-foreground">Technical details</p>
            <ScrollArea className="mt-2 h-64 rounded-md border bg-muted/50">
              <pre className="whitespace-pre-wrap break-all p-3 text-xs">
                {error.stackTrace}
              </pre>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
