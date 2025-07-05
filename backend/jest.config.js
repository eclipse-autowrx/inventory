module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/docs/**', '!src/config/**', '!**/node_modules/**'],
  coverageReporters: ['text', 'json', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testTimeout: 10000,
};
