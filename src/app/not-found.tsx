export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="absolute left-1/2 top-1/2 z-30 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl text-center">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <div className="inline-block">
        <h2 className="text-lg">This page could not be found.</h2>
      </div>
    </div>
  )
}
