'use client'

import { Play, Plus, Shield } from 'lucide-react'

interface StepLaunchProps {
  onLaunch: () => void
  onSkip: () => void
}

const SESSION_APPS = [
  { name: 'RStudio Server', color: '#66EFFF' },
  { name: 'Jupyter Lab', color: '#F59E0B' },
  { name: 'FSLeyes', color: '#ABA5F5' }
]

export function StepLaunch({ onLaunch, onSkip }: StepLaunchProps) {
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

        {/* Apps in this session */}
        <div className="max-w-[560px] rounded-[14px] border border-[rgba(255,255,255,0.09)] bg-[rgba(255,255,255,0.03)] p-[22px]">
          <div className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]">
            Apps in this session
          </div>
          <div className="flex flex-wrap gap-2.5">
            {SESSION_APPS.map((app) => (
              <span
                key={app.name}
                className="inline-flex items-center gap-2 rounded-full border border-[#333] bg-[#181818] px-3.5 py-[7px] text-[13px]"
              >
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ backgroundColor: app.color }}
                />
                {app.name}
              </span>
            ))}
            <span className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-[#3a3a3a] px-3 py-[7px] text-[13px] text-[#8a8a8a] transition-colors hover:border-[#5a5a5a] hover:text-[#c8c8c8]">
              <Plus className="h-[13px] w-[13px]" />
              Add
            </span>
          </div>
        </div>

        {/* Security notice */}
        <div className="mt-[18px] flex items-center gap-2.5 text-[12.5px] text-[#86EFAC]">
          <Shield className="h-[15px] w-[15px]" />
          Data cannot leave this session.
        </div>

        {/* Launch button */}
        <div className="flex items-center gap-3.5 pt-8">
          <button
            onClick={onLaunch}
            className="inline-flex items-center gap-2 rounded-full bg-[#B6FF12] px-[26px] py-[13px] text-[15px] font-medium text-[#0c0c0c] transition-all hover:gap-3"
          >
            <Play className="h-[15px] w-[15px]" fill="currentColor" />
            Launch session & enter CHORUS
          </button>
          <button
            onClick={onSkip}
            className="px-2 py-[13px] text-[13.5px] text-[#9a9a9a] transition-colors hover:text-[#c8c8c8]"
          >
            I&apos;ll do this later
          </button>
        </div>
      </div>
    </>
  )
}
