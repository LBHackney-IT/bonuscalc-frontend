/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
const { lighthouse, prepareAudit } = require('cypress-audit')
const dotenvPlugin = require('cypress-dotenv')
const fs = require('fs')
const path = require('path')
const downloads = path.join(__dirname, '..', 'downloads')

const findFile = (filename) => {
  const filepath = `${downloads}/${filename}`
  const contents = fs.existsSync(filepath)
  return contents
}

const fileExists = (filename, wait) => {
  const interval = 10

  return new Promise((resolve, reject) => {
    if (wait < 0) {
      const message = `Could not find file ${downloads}/${filename}`
      return reject(new Error(message))
    }

    const file = findFile(filename)

    if (file) {
      return resolve(true)
    }

    setTimeout(() => {
      fileExists(filename, wait - interval).then(resolve, reject)
    }, interval)
  })
}

const storeData = async (data, filepath) => {
  try {
    const dirpath = path.dirname(filepath)
    await fs.promises.mkdir(dirpath, { recursive: true })
    // Paste JSON file into https://googlechrome.github.io/lighthouse/viewer/
    // for Lighthouse Report
    fs.writeFile(filepath, JSON.stringify(data))
  } catch (error) {
    console.error(error)
  }
}

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  let testTitle

  on('before:browser:launch', (browser = {}, launchOptions) => {
    // eslint complains about browser being unused unless we do something with it
    console.log(`Launching ${browser.name} browser`)

    prepareAudit(launchOptions)
  })

  on('task', {
    getTestTitle(message) {
      testTitle = message

      return null
    },
  })

  on('task', {
    lighthouse: lighthouse((report) => {
      const requestedUrl = report.lhr.requestedUrl.replace(config.baseUrl, '')
      const filepath = path.resolve(
        'cypress',
        `reports/lighthouse/${requestedUrl || 'home-page'} (${testTitle}).json`
      )

      storeData(report, filepath)
    }),
  })

  on('task', {
    downloadExists(filename, wait = 4000) {
      return fileExists(filename, wait)
    },
  })

  config = dotenvPlugin(config)
  return config
}
