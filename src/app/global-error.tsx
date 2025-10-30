'use client'

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="absolute left-1/2 top-1/2 z-30 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl text-center">
          <h1 className="mb-4 text-6xl font-bold">Error</h1>
          <div className="inline-block">
            <h2 className="mb-4 text-lg">Something went wrong!</h2>
            <button
              onClick={() => reset()}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
