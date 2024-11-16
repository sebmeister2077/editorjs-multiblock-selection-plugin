import { defineConfig } from 'cypress'

export default defineConfig({
    viewportHeight: 1080,
    viewportWidth: 1920,
    video: false,
    screenshotOnRunFailure: false,
    e2e: {
        setupNodeEvents(on, config) {
            // return require("./cypress/plugins/index").default(on, config);
        },
        baseUrl: "http://127.0.0.1:5500",
        specPattern: "cypress/e2e/**",
    }
})