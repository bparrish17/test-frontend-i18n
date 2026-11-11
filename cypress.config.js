import { defineConfig } from 'cypress';
import 'dotenv/config';

export default defineConfig({
  e2e: {
    projectId: 'xkcrat',
    experimentalStudio: true,
    env: {
      BASE_API_URL: 'https://api.fora.app',
      BASE_APP_URL: 'http://localhost:5173',
      GOD_KEY: process.env.GOD_KEY,
      VITE_PUSHER_APP_KEY: process.env.VITE_PUSHER_APP_KEY,
      TEST_EMAIL: process.env.CYPRESS_TEST_EMAIL,
      TEST_PASSWORD: process.env.CYPRESS_TEST_PASSWORD
    },
    setupNodeEvents(on) {
      on('before:browser:launch', (browser, launchOptions) => {
        // `args` is an array of all the arguments that will
        // be passed to browsers when it launches

        // print all current args
        console.log(launchOptions.args);

        if (browser.family === 'chromium' && browser.name !== 'electron') {
          // auto open devtools
          launchOptions.args.push('--auto-open-devtools-for-tabs');
        }

        if (browser.family === 'firefox') {
          // auto open devtools
          launchOptions.args.push('-devtools');
        }

        if (browser.name === 'electron') {
          // auto open devtools
          launchOptions.preferences.devTools = true;
        }

        // TODO: can switch thru devtools tabs with this approach in the future
        // https://stackoverflow.com/questions/75558621/cypress-auto-open-devtools-focused-on-console-tab

        // whatever you return here becomes the launchOptions
        return launchOptions;
      });
    }
  }
});
