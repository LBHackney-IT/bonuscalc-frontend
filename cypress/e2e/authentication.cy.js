/// <reference types="cypress" />

// Signs in as the real Cognito test user (see cypress/plugins/cognitoSession.js).
// Needs COGNITO_E2E_ISSUER, COGNITO_E2E_CLIENT_ID, COGNITO_E2E_USERNAME and
// COGNITO_E2E_PASSWORD. These tests fail when they aren't set, so they can't
// be skipped by accident. The test user must be in at least one of the groups
// the app recognises.
describe('Authentication with a real Cognito token', () => {
  beforeEach(() => {
    cy.loginWithRealCognito()
  })

  it('accepts the real id token and its groups', () => {
    cy.visit('/')

    cy.url().should('not.contain', '/login')
    cy.url().should('not.contain', '/access-denied')

    cy.get('header').within(() => {
      cy.contains('a', 'Sign out')
    })
  })

  it('signs out by clearing the session and redirecting to Cognito', () => {
    cy.visit('/')

    cy.get('header').within(() => {
      cy.contains('a', 'Sign out').should('have.attr', 'href', '/api/logout')
    })

    // Don't follow the redirect: Cognito is a different site
    cy.request({ url: '/api/logout', followRedirect: false }).then(
      (response) => {
        expect(response.status).to.eq(307)
        expect(response.redirectedToUrl).to.match(
          /\/logout\?client_id=.+&logout_uri=.+%2Flogin$/
        )
      }
    )

    cy.getCookie('next-auth.session-token').should('not.exist')

    cy.visit('/')
    cy.url().should('contain', '/login')
  })
})
