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

      require('cypress-audit/plugins')(on)
      
      return config
    },
    
    defaultCommandTimeout: 10000,
    baseUrl: 'http://localhost:5001',
    video: false,
    viewportHeight: 1536,
    viewportWidth: 960
  },
  
  env: {
    lighthouse: {
      accessibility: 90
    }
  }
})
