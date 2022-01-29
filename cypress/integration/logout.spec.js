/// <reference types="cypress" />

describe('Signing out', () => {
  beforeEach(() => {
    cy.login()

    cy.visit('/search')
    cy.contains('h1', 'Find operative')
  })

  it('Redirects to the login page', () => {
    cy.get('header').within(() => {
      cy.contains('a', 'Sign out').click()
    })

    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/login')
    })

    cy.get('.lbh-header__service-name').contains('DLO Bonus Scheme')
    cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

    cy.get('.lbh-heading-h1').contains('Sign in')
    cy.get('.lbh-body').contains(
      'Please sign in with your Hackney email account.'
    )

    cy.audit()
  })
})
