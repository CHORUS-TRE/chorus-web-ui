const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './'
})

// Common module name mapper configuration
const moduleNameMapperConfig = {
  '^~/(.*)$': '<rootDir>/src/$1',
  '^@/(.*)$': '<rootDir>/src/$1',
  '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
}

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  moduleNameMapper: moduleNameMapperConfig,
  transformIgnorePatterns: [
    '/node_modules/(?!(next|next-runtime-env|@babel|@swc|next-font))'
  ],
  // Explicitly define what we want Node to handle vs what should be mocked
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json'
    }
  },
  // Configure test coverage collection
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/.next/**'
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    },
    'src/domain/**/*.{js,jsx,ts,tsx}': {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90
    }
  },
  // E2E tests may take longer
  testTimeout: 30000,
  // Group test runs by type
  projects: [
    {
      displayName: 'unit',
      testMatch: [
        '<rootDir>/src/**/__tests__/**/*.test.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}'
      ],
      testPathIgnorePatterns: [
        '/node_modules/',
        '/.next/',
        '/__tests__/integration/',
        '/__tests__/e2e/',
        '/__tests__/visual/',
        '/__tests__/accessibility/',
        '/performance/'
      ],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      moduleNameMapper: moduleNameMapperConfig
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/__tests__/integration/**/*.test.{js,jsx,ts,tsx}'],
      testPathIgnorePatterns: ['/node_modules/', '/.next/'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      moduleNameMapper: moduleNameMapperConfig
    },
    {
      displayName: 'e2e',
      testMatch: ['<rootDir>/__tests__/e2e/**/*.test.{js,jsx,ts,tsx}'],
      testPathIgnorePatterns: ['/node_modules/', '/.next/'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': [
          'babel-jest',
          {
            presets: [
              ['@babel/preset-env', { targets: { node: 'current' } }],
              '@babel/preset-typescript',
              ['@babel/preset-react', { runtime: 'automatic' }]
            ]
          }
        ]
      },
      moduleNameMapper: moduleNameMapperConfig
    },
    {
      displayName: 'visual',
      testMatch: ['<rootDir>/__tests__/visual/**/*.test.{js,jsx,ts,tsx}'],
      testPathIgnorePatterns: ['/node_modules/', '/.next/'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      moduleNameMapper: moduleNameMapperConfig
    },
    {
      displayName: 'accessibility',
      testMatch: [
        '<rootDir>/__tests__/accessibility/**/*.test.{js,jsx,ts,tsx}'
      ],
      testPathIgnorePatterns: ['/node_modules/', '/.next/'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      moduleNameMapper: moduleNameMapperConfig
    }
  ]
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
