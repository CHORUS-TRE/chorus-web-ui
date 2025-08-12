import Image from 'next/image'

export default function MaintenancePage() {
  return (
    <div className="flex h-screen w-full animate-pulse flex-col items-center justify-center">
      <Image
        src="/logo-chorus-primaire-white@2x.svg"
        alt="Chorus"
        width={128}
        height={128}
        className="mb-4"
      />
      <p className="text-sm text-muted">
        We are currently performing maintenance on the system. Please check back
        later.
      </p>
    </div>
  )
}
