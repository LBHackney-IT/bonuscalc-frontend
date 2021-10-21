/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Search page', () => {
  beforeEach(() => {
    cy.login()
  })

  describe('Search for an operative by payroll number', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('Checks a payroll number has been entered', () => {
      cy.get('#payroll-number').clear()
      cy.get('#search-button').click()

      cy.get('.govuk-error-message').within(() => {
        cy.contains('Enter a payroll number')
      })

      cy.audit()
    })

    it('Checks a payroll number is valid', () => {
      cy.get('#payroll-number').clear().type('ABCDEF')
      cy.get('#search-button').click()

      cy.get('.govuk-error-message').within(() => {
        cy.contains('Invalid payroll number')
      })

      cy.audit()
    })

    it('Checks a payroll number exists', () => {
      cy.intercept(
        { method: 'GET', path: '/api/v1/operatives/123456' },
        { statusCode: 404, fixture: 'operatives/not_found.json' }
      ).as('get_operative')

      cy.get('#payroll-number').clear().type('123456')
      cy.get('#search-button').click()

      cy.wait('@get_operative')

      cy.get('.govuk-error-message').within(() => {
        cy.contains('Operative not found')
      })

      cy.audit()
    })

    context('When an operative exists', () => {
      it('Redirects to the operative page', () => {
        cy.intercept(
          { method: 'GET', path: '/api/v1/operatives/123456' },
          { statusCode: 200, fixture: 'operatives/electrician.json' }
        ).as('get_operative')

        cy.get('#payroll-number').clear().type('123456')
        cy.get('#search-button').click()

        cy.wait('@get_operative')

        cy.url().should('contains', '/operatives/123456')

        cy.get('.lbh-heading-h2').within(() => {
          cy.contains('Alex Cable')
        })

        cy.audit()
      })
    })
  })
})
