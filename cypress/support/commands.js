// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-audit/commands'

Cypress.Commands.add('login', (user) => {
  const gssoTestKey = (user) => {
    if (user == 'a.week_manager') {
      return Cypress.env('GSSO_WEEK_MANAGER_TEST_KEY')
    } else if (user == 'an.operative_manager') {
      return Cypress.env('GSSO_OPERATIVE_MANAGER_TEST_KEY')
    } else if (user == 'an.authorisations_manager') {
      return Cypress.env('GSSO_AUTHORISATIONS_MANAGER_TEST_KEY')
    } else {
      return Cypress.env('GSSO_TEST_KEY')
    }
  }

  const GSSO_TEST_KEY = gssoTestKey(user)
  const GSSO_TOKEN_NAME = Cypress.env('GSSO_TOKEN_NAME')

  cy.getCookies().should('be.empty')
  cy.setCookie(GSSO_TOKEN_NAME, GSSO_TEST_KEY)
  cy.getCookie(GSSO_TOKEN_NAME).should('have.property', 'value', GSSO_TEST_KEY)
})
