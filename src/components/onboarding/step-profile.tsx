'use client'

import { ArrowRight, Check } from 'lucide-react'

import { useAuthentication } from '@/providers/authentication-provider'

interface StepProfileProps {
  onNext: () => void
  onBack: () => void
}

export function StepProfile({ onNext, onBack }: StepProfileProps) {
  const { user } = useAuthentication()

  const initials =
    (user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '') || '?'
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') || ''

  return (
    <>
      <div className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8a8a8a]">
        Step 3 of 6
      </div>
      <h2 className="mb-3 text-[34px] font-medium tracking-[-0.02em]">
        Complete your profile
      </h2>
      <p className="mb-7 max-w-[560px] text-[14.5px] leading-[1.6] text-[#B8B8B8]">
        Your name and affiliation appear to collaborators and on every audit
        record. Verified institutional details speed up data-access approvals.
      </p>

      {/* Avatar row */}
      <div className="mb-[26px] flex items-center gap-4">
        <div className="flex h-[60px] w-[60px] flex-none items-center justify-center rounded-full border border-[#6B93FF] bg-[#477AFF] text-[21px] font-semibold">
          {initials}
        </div>
        <div>
          <button className="rounded-[7px] border border-[#3a3a3a] bg-transparent px-3.5 py-[7px] text-[12.5px] text-[#c8c8c8] transition-colors hover:border-[#5a5a5a]">
            Upload photo
          </button>
          <div className="mt-[7px] text-[11px] text-[#7a7a7a]">
            PNG or JPG, up to 2 MB.
          </div>
        </div>
      </div>

      {/* Form grid */}
      <div className="grid max-w-[620px] grid-cols-2 gap-x-[18px] gap-y-4">
        <ProfileField label="Full name" value={fullName} editable />
        <ProfileField
          label={
            <>
              Email{' '}
              <span className="font-normal normal-case tracking-normal text-[#86EFAC]">
                · verified
              </span>
            </>
          }
          value={user?.email ?? ''}
          verified
          readonly
        />
        <ProfileField
          label="Institution"
          value=""
          editable
          placeholder="Your institution"
        />
        <ProfileField
          label="Department"
          value=""
          editable
          placeholder="Your department"
        />
        <ProfileField label="Role" value="Researcher" dropdown />
        <ProfileField
          label={
            <>
              ORCID iD{' '}
              <span className="font-normal normal-case tracking-normal text-[#7a7a7a]">
                · optional
              </span>
            </>
          }
          value=""
          editable
          mono
          placeholder="0000-0000-0000-0000"
        />
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
          Save & continue
          <ArrowRight className="h-[15px] w-[15px]" />
        </button>
        <span className="ml-1 text-xs text-[#7a7a7a]">Step 3 of 6</span>
      </div>
    </>
  )
}

function ProfileField({
  label,
  value,
  verified,
  readonly,
  editable,
  dropdown,
  mono,
  placeholder
}: {
  label: React.ReactNode
  value: string
  verified?: boolean
  readonly?: boolean
  editable?: boolean
  dropdown?: boolean
  mono?: boolean
  placeholder?: string
}) {
  const bgClass = readonly
    ? 'bg-[#141414] border-[#2a2a2a]'
    : 'bg-[#1a1a1a] border-[#3a3a3a]'
  const textClass = readonly
    ? 'text-[#9a9a9a]'
    : value
      ? 'text-[#FAFAFA]'
      : 'text-[#6a6a6a]'

  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]">
        {label}
      </label>
      <div
        className={`mt-[7px] flex items-center gap-[7px] rounded-[7px] border ${bgClass} px-[11px] py-[9px] text-[13.5px] ${textClass} ${mono ? 'font-mono text-[13px]' : ''}`}
      >
        {verified && (
          <Check
            className="h-[13px] w-[13px] text-[#86EFAC]"
            strokeWidth={2.2}
          />
        )}
        {editable && !value && placeholder ? placeholder : value || placeholder}
        {dropdown && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8a8a8a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-auto"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        )}
      </div>
    </div>
  )
}
