declare module 'next-pwa' {
  import type { NextConfig } from 'next'

  interface PWAConfig {
    dest: string
    disable?: boolean
    register?: boolean
    skipWaiting?: boolean
    runtimeCaching?: Array<{
      urlPattern: RegExp | string
      handler: string
      options?: {
        cacheName?: string
        expiration?: {
          maxEntries?: number
          maxAgeSeconds?: number
        }
      }
    }>
    buildExcludes?: Array<RegExp | string>
    customWorkerDir?: string
  }

  function withPWA(config: NextConfig): NextConfig
  export default function (options: PWAConfig): typeof withPWA
}
