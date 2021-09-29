/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Operative page', () => {
  context('When not logged in', () => {
    it('Redirects to the sign in page', () => {
      cy.visit('/operatives/123456')

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
    })

    context('And the operative does not exist', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/v1/operatives/123456' },
          { statusCode: 404, fixture: 'operatives/not_found.json' }
        ).as('get_operative')

        cy.visit('/operatives/123456')
        cy.wait('@get_operative')
      })

      it('Shows the not found message', () => {
        cy.get('.lbh-heading-h1').contains('Not Found')
        cy.get('.lbh-body').contains(
          'Couldn&apos;t find an operative with the payroll number 123456.'
        )

        cy.audit()
      })
    })

    context('And the operative exists', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/v1/operatives/123456' },
          { statusCode: 200, fixture: 'operatives/electrician.json' }
        ).as('get_operative')

        cy.visit('/operatives/123456')
        cy.wait('@get_operative')
      })

      it('Shows the operative summary', () => {
        cy.get('.lbh-heading-h2').within(() => {
          cy.contains('Alex Cable')
        })

        cy.get('.govuk-summary-list').within(() => {
          cy.get('.govuk-summary-list__row:nth-child(1)').within(() => {
            cy.get(':nth-child(1)').contains('Employee No')
            cy.get(':nth-child(2)').contains('123456')
            cy.get(':nth-child(3)').contains('Section / Team')
            cy.get(':nth-child(4)').contains('R3007')
          })

          cy.get('.govuk-summary-list__row:nth-child(2)').within(() => {
            cy.get(':nth-child(1)').contains('Trade')
            cy.get(':nth-child(2)').contains('Electrician (EL)')
            cy.get(':nth-child(3)').contains('Scheme')
            cy.get(':nth-child(4)').contains('SMV')
          })

          cy.get('.govuk-summary-list__row:nth-child(3)').within(() => {
            cy.get(':nth-child(1)').contains('Salary Band')
            cy.get(':nth-child(2)').contains('5')
            cy.get(':nth-child(3)').contains('Fixed Band')
            cy.get(':nth-child(4)').contains('No')
          })
        })

        cy.audit()
      })
    })
  })
})
