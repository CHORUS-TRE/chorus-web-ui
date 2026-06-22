'use client'

import { ArrowRight, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import type { TermsOfUseVersion } from '@/domain/model/terms-of-use'
import {
  getCurrentTermsOfUseVersion,
  getMyTermsOfUseStatus
} from '@/view-model/terms-of-use-view-model'

interface StepTermsProps {
  onNext: () => void
  onBack: () => void
}

export function StepTerms({ onNext, onBack }: StepTermsProps) {
  const [version, setVersion] = useState<TermsOfUseVersion | null>(null)
  const [alreadyAccepted, setAlreadyAccepted] = useState(false)
  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(false)

  useEffect(() => {
    Promise.all([getMyTermsOfUseStatus(), getCurrentTermsOfUseVersion()]).then(
      ([statusResult, versionResult]) => {
        if (versionResult.data) setVersion(versionResult.data)
        if (statusResult.data === true) {
          setAlreadyAccepted(true)
          setCheck1(true)
          setCheck2(true)
        }
      }
    )
  }, [])

  const canContinue = check1 && check2

  return (
    <>
      <div className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8a8a8a]">
        Step 2 of 6
      </div>
      <h2 className="mb-3 text-[34px] font-medium tracking-[-0.02em]">
        Terms & data policy
      </h2>
      <p className="mb-6 max-w-[580px] text-[14.5px] leading-[1.6] text-[#B8B8B8]">
        Before accessing any data, you&apos;ll need to read and accept the
        CHORUS data processing agreement. Take a moment to go through it.
      </p>

      {/* Scrollable terms document */}
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#161616]">
        <div className="absolute inset-0 overflow-y-auto p-6 pb-20 text-xs leading-[1.85] text-[#9a9a9a]">
          {version?.content ? (
            <div className="prose prose-sm prose-invert prose-headings:text-[#d8d8d8] max-w-none text-[#9a9a9a]">
              <ReactMarkdown>{version.content}</ReactMarkdown>
            </div>
          ) : (
            <>
              <div className="mb-4 text-[12.5px] font-semibold text-[#d8d8d8]">
                CHORUS Data Processing Agreement
              </div>
              <p className="mb-3">
                <span className="font-medium text-[#c8c8c8]">1. Scope.</span>{' '}
                This agreement governs your access to data hosted within the
                CHORUS Trusted Research Environment operated by CHUV. By
                accessing any workspace you accept these terms in full.
              </p>
              <p className="mb-3">
                <span className="font-medium text-[#c8c8c8]">
                  2. Permitted use.
                </span>{' '}
                Data may only be used for the research purpose described in your
                approved application. Identifying individual people from the
                data is strictly prohibited.
              </p>
              <p className="mb-3">
                <span className="font-medium text-[#c8c8c8]">
                  3. Data stays in CHORUS.
                </span>{' '}
                No data, results, or models may leave the environment without a
                formal export request, reviewed and approved by the data
                controller.
              </p>
              <p className="mb-3">
                <span className="font-medium text-[#c8c8c8]">
                  4. Activity is recorded.
                </span>{' '}
                All actions within a session are logged and may be reviewed for
                compliance with applicable law.
              </p>
              <p className="mb-3">
                <span className="font-medium text-[#c8c8c8]">
                  5. Confidentiality.
                </span>{' '}
                You must keep all data confidential and not share it with anyone
                outside the approved research team.
              </p>
              <p className="mb-3">
                <span className="font-medium text-[#c8c8c8]">6. Duration.</span>{' '}
                This agreement remains in force for the duration of your data
                access and for 5 years after your last access.
              </p>
              <p>
                <span className="font-medium text-[#c8c8c8]">7. Breach.</span>{' '}
                Violating this agreement may result in immediate access
                revocation and may be referred to your institution or relevant
                authorities.
              </p>
            </>
          )}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#161616] to-transparent" />
        <div className="absolute bottom-3.5 left-6 text-[11px] text-[#7a7a7a]">
          Scroll to read the full agreement
        </div>
      </div>

      {/* Checkboxes */}
      <div className="mt-5 flex flex-col gap-2.5">
        <label
          className="flex cursor-pointer items-center gap-[11px]"
          onClick={() => !alreadyAccepted && setCheck1(!check1)}
        >
          <ToggleCheckbox checked={check1} />
          <span className="text-[13px] text-[#d8d8d8]">
            I have read and accept the CHORUS Data Processing Agreement.
          </span>
        </label>
        <label
          className="flex cursor-pointer items-center gap-[11px]"
          onClick={() => !alreadyAccepted && setCheck2(!check2)}
        >
          <ToggleCheckbox checked={check2} />
          <span className="text-[13px] text-[#d8d8d8]">
            I understand that data cannot leave the environment without
            approval.
          </span>
        </label>
      </div>

      <div className="mt-[22px] flex items-center gap-3.5">
        <button
          onClick={onBack}
          className="rounded-[7px] border border-[#3a3a3a] bg-transparent px-[18px] py-2.5 text-[13.5px] text-[#9a9a9a] transition-colors hover:border-[#5a5a5a] hover:text-[#c8c8c8]"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="inline-flex items-center gap-1.5 rounded-[7px] bg-[#477AFF] px-5 py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-40"
        >
          Accept & continue
          <ArrowRight className="h-[15px] w-[15px]" />
        </button>
        <span className="ml-1 text-xs text-[#7a7a7a]">Step 2 of 6</span>
      </div>
    </>
  )
}

function ToggleCheckbox({ checked }: { checked: boolean }) {
  return checked ? (
    <span className="flex h-[18px] w-[18px] flex-none items-center justify-center rounded-[5px] bg-[#477AFF]">
      <Check className="h-[11px] w-[11px] text-white" strokeWidth={3.2} />
    </span>
  ) : (
    <span className="h-[18px] w-[18px] flex-none rounded-[5px] border-[1.5px] border-[#4a4a4a]" />
  )
}
