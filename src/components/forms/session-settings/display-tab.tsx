'use client'

import { useSessionSettings } from '@/components/hooks/use-session-settings'
import { Label } from '@/components/ui/label'
import {
  BANDWIDTH_OPTIONS,
  ENCODING_OPTIONS,
  SessionXpraSettings
} from '@/domain/model'

const selectClass =
  'h-9 rounded-md border border-border bg-background px-2 text-sm text-muted-foreground'

export function DisplayTab({ sessionId }: { sessionId: string }) {
  const { settings, update } = useSessionSettings(sessionId)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="encoding">Encoding</Label>
        <select
          id="encoding"
          className={selectClass}
          value={settings.encoding}
          onChange={(e) =>
            update({
              encoding: e.target.value as SessionXpraSettings['encoding']
            })
          }
        >
          {ENCODING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="bandwidth-limit">Bandwidth limit</Label>
        <select
          id="bandwidth-limit"
          className={selectClass}
          value={String(settings.bandwidthLimit)}
          onChange={(e) => update({ bandwidthLimit: Number(e.target.value) })}
        >
          {BANDWIDTH_OPTIONS.map((option) => (
            <option key={option.value} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="offscreen">Offscreen decoding</Label>
        <input
          id="offscreen"
          type="checkbox"
          checked={settings.offscreen}
          onChange={(e) => update({ offscreen: e.target.checked })}
        />
      </div>
    </div>
  )
}
