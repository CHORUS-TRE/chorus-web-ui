'use client'

import { Loader2, Play, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { toast } from '@/components/hooks/use-toast'
import { AppInstanceStatus, WorkbenchStatus } from '@/domain/model'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAppState } from '@/stores/app-state-store'
import { createAppInstance } from '@/view-model/app-instance-view-model'
import { workbenchCreate } from '@/view-model/workbench-view-model'

interface StepLaunchProps {
  workspace: { id: string; name: string } | null
  selectedAppIds: string[]
  onComplete: () => void
  onBack: () => void
  onSkip: () => void
}

export function StepLaunch({
  workspace,
  selectedAppIds,
  onComplete,
  onBack,
  onSkip
}: StepLaunchProps) {
  const { apps } = useAppState()
  const router = useRouter()
  const { user } = useAuthentication()
  const [sessionName, setSessionName] = useState(
    workspace ? `${workspace.name}-session` : 'session'
  )
  const [launching, setLaunching] = useState(false)

  const selectedApps = (apps || []).filter((a) => selectedAppIds.includes(a.id))

  const handleLaunch = async () => {
    if (!workspace) return
    setLaunching(true)

    // 1. Create the session (workbench)
    const width = Math.floor(
      (typeof window !== 'undefined' && window.visualViewport?.width) || 1080
    )
    const height = Math.floor(
      (typeof window !== 'undefined' && window.visualViewport?.height) || 608
    )
    const sessionForm = new FormData()
    sessionForm.append(
      'name',
      sessionName.trim() || `${workspace.name}-session`
    )
    sessionForm.append('workspaceId', workspace.id)
    sessionForm.append('userId', user?.id || '')
    sessionForm.append('tenantId', '1')
    sessionForm.append('status', WorkbenchStatus.ACTIVE)
    sessionForm.append('initialResolutionWidth', String(width))
    sessionForm.append('initialResolutionHeight', String(height))

    const sessionResult = await workbenchCreate({}, sessionForm)

    if (sessionResult.error || !sessionResult.data) {
      toast({
        title: 'Could not create session',
        description: sessionResult.error || 'Unknown error',
        variant: 'destructive'
      })
      setLaunching(false)
      return
    }

    const workbenchId = sessionResult.data.id as string

    // 2. Launch each selected app into the new session
    const failed: string[] = []
    for (const app of selectedApps) {
      const appForm = new FormData()
      appForm.append('appId', app.id)
      appForm.append('tenantId', '1')
      appForm.append('userId', user?.id || '')
      appForm.append('workspaceId', workspace.id)
      appForm.append('workbenchId', workbenchId)
      appForm.append('status', AppInstanceStatus.ACTIVE)

      const appResult = await createAppInstance({}, appForm)
      if (appResult.error) failed.push(app.name)
    }

    if (failed.length > 0) {
      toast({
        title: 'Some apps did not launch',
        description: `${failed.join(', ')} could not be started. You can add them from inside the session.`,
        variant: 'destructive'
      })
    }

    // 3. Mark onboarding complete and 4. enter the session
    onComplete()
    router.push(`/workspaces/${workspace.id}/sessions/${workbenchId}`)
  }

  return (
    <>
      <div
        className="pointer-events-none absolute -top-[60px] right-[-40px] h-[300px] w-[300px] rounded-full"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(182,255,18,0.1), transparent 70%)'
        }}
      />
      <div className="relative flex flex-col">
        <div className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8a8a8a]">
          Final step
        </div>
        <h2 className="mb-3.5 text-[34px] font-medium tracking-[-0.02em]">
          Launch your first session
        </h2>
        <p className="mb-7 max-w-[560px] text-[14.5px] leading-[1.6] text-[#B8B8B8]">
          A session is a secure workspace that opens inside your workspace. Your
          apps run right in the browser — nothing installs on your computer.
        </p>

        {/* Session name */}
        <div className="mb-5 max-w-[560px]">
          <label className="mb-[7px] block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]">
            Session name
          </label>
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="my-session"
            className="w-full rounded-[7px] border border-[#3a3a3a] bg-[#1a1a1a] px-[11px] py-[9px] text-[13.5px] text-[#FAFAFA] placeholder:text-[#6a6a6a] focus:border-[#5a5a5a] focus:outline-none"
          />
        </div>

        {/* Apps in this session */}
        <div className="max-w-[560px] rounded-[14px] border border-[rgba(255,255,255,0.09)] bg-[rgba(255,255,255,0.03)] p-[22px]">
          <div className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]">
            Apps in this session
          </div>
          {selectedApps.length > 0 ? (
            <div className="flex flex-wrap gap-2.5">
              {selectedApps.map((app) => (
                <span
                  key={app.id}
                  className="inline-flex items-center gap-2 rounded-full border border-[#333] bg-[#181818] px-3.5 py-[7px] text-[13px]"
                >
                  <span className="h-2 w-2 rounded-sm bg-[#B6FF12]" />
                  {app.name}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-[13px] text-[#8a8a8a]">
              No apps selected — your session will start empty. You can add apps
              from inside the session.
            </div>
          )}
        </div>

        {/* Launch button */}
        <div className="flex items-center gap-3.5 pt-8">
          <button
            onClick={onBack}
            className="px-2 py-[11px] text-[13.5px] text-[#9a9a9a] transition-colors hover:text-[#c8c8c8]"
          >
            Back
          </button>
          <button
            onClick={handleLaunch}
            disabled={launching || !workspace}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#B6FF12] px-[22px] py-[11px] text-sm font-medium text-[#B6FF12] transition-all hover:gap-2.5 disabled:opacity-40"
          >
            {launching ? (
              <Loader2 className="h-[15px] w-[15px] animate-spin" />
            ) : (
              <Play className="h-[15px] w-[15px]" fill="currentColor" />
            )}
            {launching ? 'Launching…' : 'Launch session & enter CHORUS'}
          </button>
          <button
            onClick={onSkip}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#B6FF12] px-[22px] py-[11px] text-sm font-medium text-[#B6FF12] transition-all hover:gap-2.5"
          >
            I&apos;ll do this later
          </button>
        </div>
        {!workspace && (
          <div className="mt-3 text-[12.5px] text-[#f0a0a0]">
            No workspace was created. Go back to the workspace step to create
            one before launching a session.
          </div>
        )}
      </div>
    </>
  )
}
