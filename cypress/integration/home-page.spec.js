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

      
    })
  })

  context('When logged in', () => {
    beforeEach(() => {
      cy.login()

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/periods/current',
        },
        { statusCode: 200, fixture: 'periods/current.json' }
      ).as('get_periods')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/weeks/2021-10-18',
        },
        { statusCode: 200, fixture: 'weeks/2021-10-18.json' }
      ).as('get_week_12')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/weeks/2021-10-25',
        },
        { statusCode: 200, fixture: 'weeks/2021-10-25.json' }
      ).as('get_week_13')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/band-changes/period',
        },
        { statusCode: 200, fixture: 'changes/period.json' }
      ).as('get_period')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/band-changes',
        },
        { statusCode: 200, fixture: 'changes/empty.json' }
      ).as('get_band_changes')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/band-changes/authorisations',
        },
        { statusCode: 200, body: [] }
      ).as('get_authorisations')

      cy.visit('/')
      cy.wait([
        '@get_periods',
        '@get_week_12',
        '@get_week_13',
        '@get_period',
        '@get_band_changes',
        '@get_authorisations',
      ])
    })

    it('Shows the manage open weeks page', () => {
      cy.get('.bc-open-weeks').within(() => {
        cy.contains('h1', 'Open weeks')
        cy.contains('h2', 'Period 3 – 2021')

        cy.get('section:nth-of-type(1)').within(() => {
          cy.get('section:nth-of-type(1)').within(() => {
            cy.contains('h3', 'Period 3 – 2021 / week 12')
          })

          cy.get('section:nth-of-type(2)').within(() => {
            cy.contains('h3', 'Period 3 – 2021 / week 13')
          })
        })
      })

      
    })
  })
})
