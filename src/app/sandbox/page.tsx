// import { Sandpack } from '@codesandbox/sandpack-react'
import Link from 'next/link'

export default function App() {
  return (
    <div className="m-6">
      <h1 className="text-2xl font-bold text-white">Sandbox</h1>
      <p className="mt-2 text-sm text-muted">In testing.</p>
      <div className="mb-2 flex flex-row gap-2">
        <Link
          className="text-sm text-white underline hover:text-accent"
          href="sandbox/schema-viz"
          rel="noopener noreferrer"
        >
          role explorer
        </Link>
        <Link
          className="text-sm text-white underline hover:text-accent"
          href="sandbox/component-explorer"
          rel="noopener noreferrer"
        >
          component-explorer
        </Link>
        <Link
          className="text-sm text-white underline hover:text-accent"
          href="sandbox/component-generator"
          rel="noopener noreferrer"
        >
          component-generator
        </Link>
      </div>
      {/* <Sandpack
        template="react"
        files={{
          '/App.js':
            'export default function App() { return <h1>Hello World</h1> }'
        }}
      /> */}
    </div>
  )
}
