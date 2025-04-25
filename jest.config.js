module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  verbose: true,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
