/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Authentication', () => {
  context('When the user is not signed in', () => {
    it('Redirects attempts to visit other URLs and shows the sign in page', () => {
      cy.visit('/search')

      cy.url().should('contains', '/login')

      cy.get('header').within(() => {
        cy.contains('a', 'Manage Bonus').should('not.exist')
        cy.contains('a', 'Search').should('not.exist')
        cy.contains('a', 'Sign out').should('not.exist')
      })

      cy.get('.lbh-header__service-name').contains('DLO Bonus Scheme')
      cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

      cy.get('.lbh-heading-h1').contains('Sign in')
      cy.contains('a', 'Sign in with Google')
      cy.get('.lbh-body').contains(
        'Please sign in with your Hackney email account.'
      )

      cy.audit()
    })
  })

  context('When the user is signed in', () => {
    beforeEach(() => {
      cy.login()
    })

    it('Allows signing out', () => {
      cy.visit('/')

      cy.get('header').within(() => {
        cy.contains('a', 'Sign out').click()
      })

      cy.get('.lbh-heading-h1').contains('Sign in')
      cy.contains('a', 'Sign in with Google')
      cy.get('.lbh-body').contains(
        'Please sign in with your Hackney email account.'
      )
    })
  })
})
