/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Search page', () => {
  beforeEach(() => {
    cy.login()
  })

  describe('Search for an operative by payroll number', () => {
    beforeEach(() => {
      cy.visit('/search')
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
        cy.clock(new Date('2021-10-27T09:00:00Z'))

        cy.intercept(
          { method: 'GET', path: '/api/v1/operatives/123456' },
          { statusCode: 200, fixture: 'operatives/electrician.json' }
        ).as('get_operative')

        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/operatives/123456/summary?bonusPeriod=2021-08-02',
          },
          { statusCode: 200, fixture: 'summaries/2021-08-02.json' }
        ).as('get_summary')

        cy.get('#payroll-number').clear().type('123456')
        cy.get('#search-button').click()

        cy.wait(['@get_operative', '@get_summary'])

        cy.location().should((loc) => {
          expect(loc.pathname).to.eq('/operatives/123456/summaries/2021-08-02')
        })

        cy.get('.lbh-heading-h2').within(() => {
          cy.contains('Alex Cable')
        })

        cy.audit()
      })
    })
  })
})
