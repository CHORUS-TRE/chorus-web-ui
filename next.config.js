/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js')

import NextPWA from 'next-pwa'

/** @type {import("next").NextConfig} */
const withPWA = NextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.your-domain\.com/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 // 24 hours
        }
      }
    }
  ],
  buildExcludes: [/middleware-manifest\.json$/],
  customWorkerDir: 'worker'
})

const config = {
  reactStrictMode: true,
  output: 'standalone',
  eslint: {
    dirs: ['app']
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false
  },
  transpilePackages: ['@t3-oss/env-nextjs', '@t3-oss/env-core']
}

export default withPWA(config)
