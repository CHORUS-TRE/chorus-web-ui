import { env } from 'next-runtime-env'

// The in-platform assistant is a demonstration feature: it stays fully
// disabled (no UI entry point, chat endpoint returns 404) unless the
// deployment opts in explicitly.
export function isAgentEnabled(): boolean {
  return env('NEXT_PUBLIC_ENABLE_AGENT') === 'true'
}

export type XpraClientSource = 'local' | 'remote'

// Which Xpra HTML5 client a session embeds:
// - 'local': the copy vendored in public/vendor/xpra, served same-origin, with
//   the window.chorusXpra bridge (window list / focus / resize).
// - 'remote': the client served by the session pod, cross-origin, no bridge.
// Defaults to 'remote' — the behaviour that predates the vendored client — so a
// deployment has to opt in explicitly. Read at call time, never cached in a
// module constant: env() resolves window.__ENV when the browser evaluates it.
export function xpraClientSource(): XpraClientSource {
  return env('NEXT_PUBLIC_XPRA_CLIENT') === 'local' ? 'local' : 'remote'
}
