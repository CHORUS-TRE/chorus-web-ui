import Link from 'next/link'

export default function AppStoreLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-black/85 backdrop-blur-sm"></header>

      <main className="flex flex-1">
        <aside className="w-64 border-r p-4">
          <nav className="space-y-2">
            <div className="flex flex-col gap-4">
              <Link
                href="/app-store"
                className="inline-flex w-max items-center justify-center border-b-2 border-transparent bg-transparent px-2 text-sm font-semibold text-muted transition-colors hover:border-b-2 hover:border-accent"
              >
                ← Back to Store
              </Link>
            </div>
          </nav>
        </aside>

        {children}
      </main>
    </div>
  )
}
