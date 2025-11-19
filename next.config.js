/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  // This is needed to ensure the Go WASM module can be loaded correctly
  webpack: (config) => {
    config.experiments = { asyncWebAssembly: true, layers: true }
    // Add rule to handle .wasm files as assets
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource'
    })
    return config
  },
  // Turbopack configuration (Next.js 16 uses Turbopack by default)
  // WebAssembly support is built-in with Turbopack
  turbopack: {},
  output: 'standalone',
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
