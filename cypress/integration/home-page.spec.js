/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Home page', () => {
  context('When not logged in', () => {
    it('Redirects to the sign in page', () => {
      cy.visit('/')

      cy.get('.lbh-header__service-name').contains('DLO Bonus Scheme')
      cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

      cy.get('.lbh-heading-h1').contains('Sign in')
      cy.get('.lbh-body').contains(
        'Please sign in with your Hackney email account.'
      )

      cy.audit()
    })
  })

  context('When logged in', () => {
    beforeEach(() => {
      cy.login()
      cy.visit('/')
    })

    it('Shows the search page', () => {
      cy.get('.lbh-heading-h1').contains('Find operative')
      cy.get('.govuk-label').contains('Search by full payroll number')

      cy.audit()
    })

    it('Redirects to sign in page once logout is clicked and the cookies are cleared', () => {
      cy.logout()
      cy.visit('/')

      cy.get('.lbh-heading-h1').contains('Sign in')
      cy.get('.lbh-body').contains(
        'Please sign in with your Hackney email account.'
      )

      cy.audit()
    })
  })
})
