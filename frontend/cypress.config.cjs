const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 20000,
    requestTimeout: 20000,
    responseTimeout: 20000,
    // Add retry configuration for flaky tests
    retries: {
      runMode: 2,
      openMode: 0
    },
    // Add better error handling for network requests
    experimentalModifyObstructiveThirdPartyCode: true,
    experimentalSessionAndOrigin: true
  },
}); 