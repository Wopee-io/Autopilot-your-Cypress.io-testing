const { defineConfig } = require("cypress");
const { addWopeePlugin } = require("@wopee-io/wopee.cy");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      addWopeePlugin(on, config);
    },
    baseUrl: "https://dronjo.wopee.io",

    env: {
      openAIAPIKey: process.env.OPENAI_API_KEY,
      wopee: {
        apiUrl: process.env.WOPEE_API_URL,
        apiKey: process.env.WOPEE_API_KEY,
        projectUuid: process.env.WOPEE_PROJECT_UUID,
      },
    },

    // Workaround for sace demo
    // see details here: https://github.com/cypress-io/cypress/issues/27501#issuecomment-1969265339
    chromeWebSecurity: false,
  },
});
