import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './'
})

// Add any custom config to be passed to Jest
const customJestConfig: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/__tests__/mocks/']
}

const nextJestConfig = createJestConfig(customJestConfig)

// Wrap to append extra ignore patterns after next/jest merges its defaults
const config = async (): Promise<Config> => {
  const config = (await nextJestConfig()) as Config
  config.testPathIgnorePatterns = [
    ...(config.testPathIgnorePatterns ?? []),
    'json-render/specs/workflow\\.spec\\.ts',
    'json-render/specs/search-results\\.spec\\.ts',
    'json-render/specs/workspace-status\\.spec\\.ts'
  ]
  // next/jest ships ESM-only packages (e.g. geist) into an allowlist so they
  // still get transformed instead of hitting node_modules' default ignore.
  // jose (ESM-only) needs the same treatment, so it's added to that allowlist.
  config.transformIgnorePatterns = (config.transformIgnorePatterns ?? []).map(
    (pattern) => pattern.replace(/geist/g, 'geist|jose')
  )
  return config
}

export default config
