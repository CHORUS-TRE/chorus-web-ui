'use client'

import { ArrowRight, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import type { TermsOfUseVersion } from '@/domain/model/terms-of-use'
import {
  acceptTermsOfUse,
  getCurrentTermsOfUseVersion,
  getMyTermsOfUseStatus,
  listTermsOfUseAcceptances
} from '@/view-model/terms-of-use-view-model'

interface StepTermsProps {
  onNext: () => void
  onBack: () => void
}

export function StepTerms({ onNext, onBack }: StepTermsProps) {
  const [version, setVersion] = useState<TermsOfUseVersion | null>(null)
  const [alreadyAccepted, setAlreadyAccepted] = useState(false)
  const [acceptedAt, setAcceptedAt] = useState<Date | null>(null)
  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([
      getMyTermsOfUseStatus(),
      getCurrentTermsOfUseVersion(),
      listTermsOfUseAcceptances()
    ]).then(([statusResult, versionResult, acceptancesResult]) => {
      if (versionResult.data) setVersion(versionResult.data)
      if (statusResult.data === true) {
        setAlreadyAccepted(true)
        setCheck1(true)
        setCheck2(true)

        // Prefer the acceptance for the current version, else the most recent
        const acceptances = acceptancesResult.data ?? []
        const forVersion = acceptances.find(
          (a) => a.termsOfUseVersionId === versionResult.data?.id
        )
        const latest = [...acceptances]
          .filter((a) => a.acceptedAt)
          .sort(
            (a, b) =>
              (b.acceptedAt?.getTime() ?? 0) - (a.acceptedAt?.getTime() ?? 0)
          )[0]
        const accepted = forVersion ?? latest
        if (accepted?.acceptedAt) setAcceptedAt(accepted.acceptedAt)
      }
    })
  }, [])

  const canContinue = check1 && check2

  const handleAccept = async () => {
    if (!alreadyAccepted) {
      setSubmitting(true)
      try {
        await acceptTermsOfUse()
      } catch {
        // Terms may already be accepted on the server; proceed regardless
      } finally {
        setSubmitting(false)
      }
    }
    onNext()
  }

  return (
    <>
      <div className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        Step 2 of 5
      </div>
      <h2 className="mb-3 text-[34px] font-medium tracking-[-0.02em]">
        Terms & data policy
      </h2>
      <p className="mb-6 max-w-[580px] text-[14.5px] leading-[1.6] text-muted-foreground">
        Before accessing any data, you&apos;ll need to read and accept the
        CHORUS data processing agreement. Take a moment to go through it.
      </p>

      {/* Scrollable terms document */}
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card">
        <div className="absolute inset-0 overflow-y-auto p-6 pb-20 text-xs leading-[1.85] text-muted-foreground">
          {version?.content ? (
            <div className="prose prose-sm prose-headings:text-foreground dark:prose-invert max-w-none text-muted-foreground">
              <ReactMarkdown>{version.content}</ReactMarkdown>
            </div>
          ) : (
            <>
              <div className="mb-4 text-[12.5px] font-semibold text-foreground">
                CHORUS Data Processing Agreement
              </div>
              <p className="mb-3">
                <span className="font-medium text-foreground">1. Scope.</span>{' '}
                This agreement governs your access to data hosted within the
                CHORUS Secure Processing Environment operated by CHUV. By
                accessing any workspace you accept these terms in full.
              </p>
              <p className="mb-3">
                <span className="font-medium text-foreground">
                  2. Permitted use.
                </span>{' '}
                Data may only be used for the research purpose described in your
                approved application. Identifying individual people from the
                data is strictly prohibited.
              </p>
              <p className="mb-3">
                <span className="font-medium text-foreground">
                  3. Data stays in CHORUS.
                </span>{' '}
                No data, results, or models may leave the environment without a
                formal export request, reviewed and approved by the data
                controller.
              </p>
              <p className="mb-3">
                <span className="font-medium text-foreground">
                  4. Activity is recorded.
                </span>{' '}
                All actions within a session are logged and may be reviewed for
                compliance with applicable law.
              </p>
              <p className="mb-3">
                <span className="font-medium text-foreground">
                  5. Confidentiality.
                </span>{' '}
                You must keep all data confidential and not share it with anyone
                outside the approved research team.
              </p>
              <p className="mb-3">
                <span className="font-medium text-foreground">
                  6. Duration.
                </span>{' '}
                This agreement remains in force for the duration of your data
                access and for 5 years after your last access.
              </p>
              <p>
                <span className="font-medium text-foreground">7. Breach.</span>{' '}
                Violating this agreement may result in immediate access
                revocation and may be referred to your institution or relevant
                authorities.
              </p>
            </>
          )}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute bottom-3.5 left-6 text-[11px] text-muted-foreground/70">
          Scroll to read the full agreement
        </div>
      </div>

      {/* Already-accepted notice */}
      {alreadyAccepted && (
        <div className="mt-5 flex items-center gap-2 text-[12.5px] text-green-600 dark:text-[#86EFAC]">
          <Check className="h-[14px] w-[14px]" strokeWidth={2.4} />
          {acceptedAt
            ? `You already accepted these terms on ${acceptedAt.toLocaleDateString(
                undefined,
                { year: 'numeric', month: 'long', day: 'numeric' }
              )}.`
            : 'You have already accepted these terms.'}
        </div>
      )}

      {/* Checkboxes */}
      <div className="mt-5 flex flex-col gap-2.5">
        <label
          className="flex cursor-pointer items-center gap-[11px]"
          onClick={() => !alreadyAccepted && setCheck1(!check1)}
        >
          <ToggleCheckbox checked={check1} />
          <span className="text-[13px] text-foreground">
            I have read and accept the CHORUS Data Processing Agreement.
          </span>
        </label>
        <label
          className="flex cursor-pointer items-center gap-[11px]"
          onClick={() => !alreadyAccepted && setCheck2(!check2)}
        >
          <ToggleCheckbox checked={check2} />
          <span className="text-[13px] text-foreground">
            I understand that data cannot leave the environment without
            approval.
          </span>
        </label>
      </div>

      <div className="mt-[22px] flex items-center gap-3.5">
        <button
          onClick={onBack}
          className="px-2 py-[11px] text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Back
        </button>
        <button
          onClick={handleAccept}
          disabled={!canContinue || submitting}
          className="inline-flex items-center gap-1.5 rounded-full border border-accent px-[22px] py-[11px] text-sm font-medium text-accent transition-all hover:gap-2.5 disabled:opacity-40"
        >
          {submitting ? 'Accepting…' : 'Accept & continue'}
          {!submitting && <ArrowRight className="h-[15px] w-[15px]" />}
        </button>
        <span className="ml-1 text-xs text-muted-foreground/70">
          Step 2 of 5
        </span>
      </div>
    </>
  )
}

function ToggleCheckbox({ checked }: { checked: boolean }) {
  return checked ? (
    <span className="flex h-[18px] w-[18px] flex-none items-center justify-center rounded-[5px] bg-accent-background">
      <Check className="h-[11px] w-[11px] text-black" strokeWidth={3.2} />
    </span>
  ) : (
    <span className="h-[18px] w-[18px] flex-none rounded-[5px] border-[1.5px] border-muted-foreground/40" />
  )
}
