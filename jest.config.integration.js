const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.js'],
  testEnvironment: 'node',
  testMatch: ['**/tests/integration/**/*.test.js'],
  moduleNameMapper: {
    // Handle module aliases (if you use them in your tsconfig/jsconfig)
    '^@/components/(.*)$': '<rootDir>/components/$1',
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
