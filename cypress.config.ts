import { defineConfig } from 'cypress'

export default defineConfig({
  video: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./e2e/plugins/index.ts')(on, config)
    },
    specPattern: 'e2e/src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'e2e/support/index.ts',
  },
})
