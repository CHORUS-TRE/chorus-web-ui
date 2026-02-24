'use client'

import {
  ArrowLeft,
  Cookie,
  Globe,
  Info,
  Lock,
  Mail,
  Scale,
  Shield
} from 'lucide-react'
import Link from 'next/link'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function PrivacyPolicyPage() {
  const lastUpdated = 'January 20, 2026'

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      <div className="hover-animate mx-auto max-w-4xl px-6 py-16 sm:py-24">
        {/* Navigation */}
        <div className="mb-12">
          <Link
            href="/"
            className="group inline-flex items-center text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-primary"
          >
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full border border-border transition-all group-hover:border-primary group-hover:bg-primary/5">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Back to Application
          </Link>
        </div>

        {/* Header Section */}
        <header className="mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary ring-1 ring-inset ring-primary/20">
            <Scale className="h-3.5 w-3.5" />
            Legal Notice
          </div>
          <h1 className="text-balance text-5xl font-extrabold tracking-tight sm:text-6xl">
            Legal Information &{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <div className="flex flex-col gap-4 text-muted-foreground sm:flex-row sm:items-center">
            <p className="max-w-2xl text-balance text-lg">
              This policy explains how CHORUS handles your data in accordance
              with Swiss federal laws and international standards.
            </p>
            <div className="mx-2 hidden h-8 w-px bg-border sm:block" />
            <p className="text-sm font-medium">Last updated: {lastUpdated}</p>
          </div>
        </header>

        <div className="grid gap-12 sm:grid-cols-1">
          {/* 1. Limitation of Liability */}
          <section className="group">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-sm transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
                <Info className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Limitation of Liability
                </h2>
                <p className="text-sm text-muted-foreground">
                  Terms of information use and accuracy
                </p>
              </div>
            </div>

            <Card className="card-glass border-none shadow-xl shadow-primary/5 transition-all duration-500 hover:shadow-primary/10">
              <CardContent className="space-y-6 pt-8 leading-relaxed text-muted-foreground">
                <p>
                  The information provided across all CHORUS platforms and
                  CHUV-related digital services is intended to improve, rather
                  than replace, the relationship existing between patients,
                  researchers, or visitors and their health professionals or
                  governing bodies.
                </p>
                <p>
                  Despite the great care taken in ensuring the accuracy of the
                  information published, we cannot be held responsible for the
                  reliability, accuracy, timeliness, or completeness of the data
                  provided through this interface.
                </p>
                <p>
                  We expressly reserve the right to modify content in part or in
                  full, to delete it, or to temporarily suspend its distribution
                  at any time and without prior notice.
                </p>
                <p className="rounded-xl border-l-2 border-primary/50 bg-muted/30 p-4 text-sm">
                  CHORUS shall not be held liable for material or immaterial
                  damage that may be caused by access to the information
                  distributed or by its use or non-use, misuse of the
                  connection, or technical problems.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* 2. Third-Party Links */}
          <section className="group">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 shadow-sm transition-all duration-500 group-hover:bg-secondary group-hover:text-secondary-foreground">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  External Links
                </h2>
                <p className="text-sm text-muted-foreground">
                  Responsibility regarding third-party websites
                </p>
              </div>
            </div>

            <Card className="card-glass border-none shadow-xl shadow-secondary/5 transition-all duration-500 hover:shadow-secondary/10">
              <CardContent className="pt-8 leading-relaxed text-muted-foreground">
                <p>
                  Referrals and links to other websites are provided for
                  informational purposes only. The content, form, and services
                  offered by these sites are the sole responsibility of their
                  respective authors. Access to and use of these sites are at
                  the risk of the person consulting them.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* 3. Data Protection */}
          <section className="group">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-sm transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Data Protection Standards
                </h2>
                <p className="text-sm text-muted-foreground">
                  Our commitment to your privacy
                </p>
              </div>
            </div>

            <Card className="card-glass border-none shadow-xl shadow-primary/5 transition-all duration-500 hover:shadow-primary/10">
              <CardContent className="space-y-6 pt-8 leading-relaxed text-muted-foreground">
                <p>
                  Article 13 of the Federal Constitution of the Swiss
                  Confederation and data protection laws provide that every
                  person has the right to the protection of their private
                  sphere. CHORUS strictly observes these provisions.
                </p>
                <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-primary/5 p-6">
                  <div className="absolute right-0 top-0 p-3 opacity-10">
                    <Shield className="h-12 w-12" />
                  </div>
                  <p className="relative z-10 text-lg font-semibold text-foreground">
                    Personal data is treated with the highest level of
                    confidentiality and is{' '}
                    <span className="italic text-primary">
                      never sold or transmitted to third parties
                    </span>
                    .
                  </p>
                </div>
                <p>
                  We strive to protect our databases by all technical and
                  organizational means from external intrusion, loss, misuse,
                  and falsification.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* 4. Cookies */}
          <section className="shadow-glow group">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 shadow-sm transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
                <Cookie className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Cookie Policy
                </h2>
                <p className="text-sm text-muted-foreground">
                  How we use cookies to improve your experience
                </p>
              </div>
            </div>

            <Card className="card-glass border-none shadow-xl transition-all duration-500">
              <CardHeader className="pb-0 pt-8">
                <div className="flex w-fit items-center gap-2 rounded-lg bg-primary/5 px-4 py-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  <span className="text-xs font-bold text-primary">
                    Matomo Anonymized Tracking
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 text-sm leading-relaxed text-muted-foreground">
                <p>
                  CHORUS uses functional cookies to track platform usage,
                  enabling a smoother experience and improved communication.
                  These small files stored on your computer facilitate
                  navigation and help us understand user journey patterns.
                </p>
                <p>
                  No personal data is recorded upon initial access. Usage data
                  is processed statistically using{' '}
                  <strong>Matomo Open Analytics</strong>,{' '}
                  <strong>Facil-iti</strong>, and <strong>CloudFlare</strong>.
                  This data remains anonymized and is not associated with
                  individual personal profiles.
                </p>
                <p>
                  Third-party services like <strong>Vimeo</strong> may be used
                  for video content. Their cookies are only activated if you
                  explicitely consent via our built-in consent manager.
                </p>
                <Separator className="opacity-50" />
                <p>
                  <strong>Voluntary Contact:</strong> When you provide your
                  email address voluntarily for support or inquiries, it is only
                  shared with the relevant department to fulfill your request.
                  Identifiable details are never transmitted to external
                  entities.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Contact Section */}
          <Separator className="my-8" />

          <section className="space-y-6 py-8 text-center">
            <h2 className="text-3xl font-semibold text-muted-foreground">
              Still have questions?
            </h2>
            <p className="mx-auto max-w-lg text-muted-foreground">
              Our privacy team is here to help if you have any concerns about
              how your data is handled.
            </p>
            <Link
              href="mailto:privacy@chuv.ch"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-95"
            >
              <Mail className="h-4 w-4" />
              Contact Privacy Officer
            </Link>
          </section>
        </div>

        {/* Footer info */}
        <footer className="mt-24 space-y-4 border-t border-border/50 pt-8 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            CHORUS &bull; TRUSTED RESEARCH PLATFORM
          </p>
          <p className="text-xs leading-tight text-muted-foreground/60">
            Compliance with the Swiss Federal Data Protection Act (FADP) and
            GDPR standards.
            <br />
            &copy; {new Date().getFullYear()} CHUV - Centre Hospitalier
            Universitaire Vaudois.
          </p>
        </footer>
      </div>
    </div>
  )
}
