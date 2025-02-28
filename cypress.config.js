const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome') {
          launchOptions.args.push(
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--headless=new'
          )
        }
        return launchOptions
      })
      
      return config
    }
  }
})
