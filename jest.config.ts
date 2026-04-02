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
export default async (): Promise<Config> => {
  const config = (await nextJestConfig()) as Config
  config.testPathIgnorePatterns = [
    ...(config.testPathIgnorePatterns ?? []),
    'json-render/specs/workflow\\.spec\\.ts',
    'json-render/specs/search-results\\.spec\\.ts',
    'json-render/specs/workspace-status\\.spec\\.ts'
  ]
  return config
}
