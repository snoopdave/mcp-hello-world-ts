/** @type {import("jest").Config} **/
export default {
  extensionsToTreatAsEsm: [".ts"], // Only include .ts files
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          // Override the tsconfig settings for tests
          module: "ESNext",
          moduleResolution: "node"
        }
      }
    ],
  },
  testEnvironment: "node", // Node.js test environment

  // Add these configurations to control which files Jest processes
  testMatch: ['**/*.test.ts'], // Only run .test.ts files, not .test.js
  testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Explicitly ignore the dist directory
  modulePathIgnorePatterns: ['/dist/'], // Prevent duplicate module warnings from dist
};