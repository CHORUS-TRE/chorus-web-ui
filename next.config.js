/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  // Turbopack configuration (Next.js 16 uses Turbopack by default)
  turbopack: {},
  serverExternalPackages: ['better-sqlite3'],
  output: 'standalone',
  outputFileTracingIncludes: {
    '/api/*': [
      './node_modules/better-sqlite3/**',
      './src/app/api/.ai/index.sqlite'
    ]
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  compiler: {
    // Remove console logs only in production, excluding error logs
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false
  }
  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },
}

export default config
