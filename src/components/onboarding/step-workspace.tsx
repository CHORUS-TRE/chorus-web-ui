'use client'

import { ArrowRight, Plus, Users } from 'lucide-react'
import { useState } from 'react'

interface StepWorkspaceProps {
  onNext: () => void
  onBack: () => void
}

type WorkspaceMode = 'create' | 'join'

export function StepWorkspace({ onNext, onBack }: StepWorkspaceProps) {
  const [mode, setMode] = useState<WorkspaceMode>('create')
  const [workspaceName, setWorkspaceName] = useState('')
  const [visibility, setVisibility] = useState<'private' | 'members'>('private')

  return (
    <>
      <div className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8a8a8a]">
        Step 4 of 6
      </div>
      <h2 className="mb-3.5 text-[34px] font-medium tracking-[-0.02em]">
        Set up your workspace
      </h2>
      <p className="mb-[30px] max-w-[560px] text-[14.5px] leading-[1.6] text-[#B8B8B8]">
        A workspace is a shared project space — it holds your data, sessions and
        collaborators behind one access agreement. Start your own or join one
        you&apos;ve been invited to.
      </p>

      <div className="flex max-w-[640px] gap-4">
        {/* Create card */}
        <div
          onClick={() => setMode('create')}
          className={`relative flex-1 cursor-pointer rounded-[14px] p-[22px] transition-all ${
            mode === 'create'
              ? 'border-[1.5px] border-[#477AFF] bg-[rgba(71,122,255,0.07)]'
              : 'border border-[rgba(255,255,255,0.09)] bg-[rgba(255,255,255,0.03)]'
          }`}
        >
          {mode === 'create' && (
            <div className="absolute right-4 top-4 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#477AFF]">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
          )}
          <div className="mb-4 inline-flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[rgba(71,122,255,0.16)] text-[#6E97FF]">
            <Plus className="h-5 w-5" />
          </div>
          <div className="mb-[5px] text-[15px] font-medium">
            Create a workspace
          </div>
          <div className="mb-[18px] text-[12.5px] leading-[1.5] text-[#9a9a9a]">
            You&apos;ll be the owner and can invite others.
          </div>

          {mode === 'create' && (
            <>
              <label className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]">
                Name
              </label>
              <div className="mb-3.5 mt-[7px] flex items-center rounded-[7px] border border-[#3a3a3a] bg-[#1a1a1a] px-[11px] py-[9px] font-mono text-[13px] text-[#FAFAFA]">
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="my-workspace"
                  className="flex-1 bg-transparent font-mono text-[13px] text-[#FAFAFA] placeholder:text-[#6a6a6a] focus:outline-none"
                />
                <span className="ml-0.5 h-[15px] w-[1.5px] animate-pulse bg-[#477AFF]" />
              </div>

              <label className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]">
                Visibility
              </label>
              <div className="mt-[7px] flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setVisibility('private')
                  }}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    visibility === 'private'
                      ? 'border-[rgba(71,122,255,0.4)] bg-[rgba(71,122,255,0.2)] text-[#8FB0FF]'
                      : 'border-[#3a3a3a] text-[#8a8a8a]'
                  }`}
                >
                  Private
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setVisibility('members')
                  }}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    visibility === 'members'
                      ? 'border-[rgba(71,122,255,0.4)] bg-[rgba(71,122,255,0.2)] text-[#8FB0FF]'
                      : 'border-[#3a3a3a] text-[#8a8a8a]'
                  }`}
                >
                  Workspace members
                </button>
              </div>
            </>
          )}
        </div>

        {/* Join card */}
        <div
          onClick={() => setMode('join')}
          className={`flex-1 cursor-pointer rounded-[14px] p-[22px] transition-all ${
            mode === 'join'
              ? 'border-[1.5px] border-[#477AFF] bg-[rgba(71,122,255,0.07)]'
              : 'border border-[rgba(255,255,255,0.09)] bg-[rgba(255,255,255,0.03)]'
          }`}
        >
          <div className="mb-4 inline-flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[rgba(255,255,255,0.05)] text-[#9a9a9a]">
            <Users className="h-5 w-5" />
          </div>
          <div className="mb-[5px] text-[15px] font-medium">
            Join an existing one
          </div>
          <div className="mb-[18px] text-[12.5px] leading-[1.5] text-[#9a9a9a]">
            Enter an invite code from a colleague.
          </div>
          <div className="rounded-[7px] border border-[#3a3a3a] bg-[#1a1a1a] px-[11px] py-[9px] font-mono text-[13px] tracking-[0.2em] text-[#6a6a6a]">
            XXXX–XXXX
          </div>
          <div className="mt-5 border-t border-dotted border-[#3a3a3a] pt-4 text-[11.5px] text-[#7a7a7a]">
            2 workspaces have invited you
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3.5 pt-8">
        <button
          onClick={onBack}
          className="rounded-[7px] border border-[#3a3a3a] bg-transparent px-[18px] py-2.5 text-[13.5px] text-[#9a9a9a] transition-colors hover:border-[#5a5a5a] hover:text-[#c8c8c8]"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-1.5 rounded-[7px] bg-[#477AFF] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:bg-[#5A8AFF]"
        >
          {mode === 'create' ? 'Create workspace' : 'Join workspace'}
          <ArrowRight className="h-[15px] w-[15px]" />
        </button>
        <span className="ml-1 text-xs text-[#7a7a7a]">Step 4 of 6</span>
      </div>
    </>
  )
}
