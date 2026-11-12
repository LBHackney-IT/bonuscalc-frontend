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

// Signs in without going through Cognito by setting a next-auth session cookie
// signed with NEXTAUTH_SECRET, which is what the app would set after sign in.
Cypress.Commands.add('login', (user) => {
  cy.getCookies().should('be.empty')

  cy.task('signSessionCookie', user).then(({ name, value }) => {
    cy.setCookie(name, value)
    cy.getCookie(name).should('have.property', 'value', value)
  })
})
